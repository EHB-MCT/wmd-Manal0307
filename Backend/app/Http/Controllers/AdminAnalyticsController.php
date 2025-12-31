<?php

namespace App\Http\Controllers;

use App\Models\Comparison;
use App\Models\Interaction;
use App\Models\User;
use App\Models\UserAnswer;
use App\Models\UserSession;
use App\Services\UserProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    private const MOOD_COLORS = [
        'calme & serein' => '#c7a45a',
        'énergique & dynamique' => '#000000',
        'romantique & rêveur' => '#d6c2a6',
        'confiant & assuré' => '#b0b0b0',
        'mystérieux & profond' => '#6f6f6f',
        'kalm & sereen' => '#c7a45a',
        'energiek & dynamisch' => '#000000',
        'romantisch & dromerig' => '#d6c2a6',
        'zelfzeker & krachtig' => '#b0b0b0',
        'mysterieus & diep' => '#6f6f6f',
    ];

    public function __construct(private UserProfileService $profileService)
    {
    }

    public function overview()
    {
        $totalAnswers = UserAnswer::count();
        $completedSessions = UserSession::where('completed', true)->count();
        $finishedSessions = UserSession::whereNotNull('ended_at')->count();
        $avgQuizDuration = UserSession::where('completed', true)
            ->whereNotNull('duration')
            ->get()
            ->map(function ($session) {
                $duration = (float) $session->duration;

                return $duration < 0 ? abs($duration) : $duration;
            })
            ->avg();
        $abandonedSessions = max($finishedSessions - $completedSessions, 0);

        return [
            'total_quizzes' => $completedSessions,
            'avg_quiz_time' => $avgQuizDuration ? round($avgQuizDuration, 1) : 0,
            'abandon_rate' => $finishedSessions > 0
                ? round(($abandonedSessions / $finishedSessions) * 100, 1)
                : 0,
            'total_comparisons' => Comparison::count(),
            'mood_distribution' => $this->moodDistribution(),
            'page_stats' => $this->pageStats(),
            'event_breakdown' => $this->eventBreakdown(),
        ];
    }

    public function questions()
    {
        return DB::table('questions')
            ->leftJoin('user_answers', 'questions.id', '=', 'user_answers.question_id')
            ->select('questions.id', 'questions.question_text', DB::raw('AVG(user_answers.time_spent) as avg_time'))
            ->groupBy('questions.id', 'questions.question_text', 'questions.order')
            ->orderBy('questions.order')
            ->get()
            ->map(function ($row) {
                $row->avg_time = $row->avg_time ? round($row->avg_time, 1) : 0;

                return $row;
            });
    }

    public function users(Request $request)
    {
        $query = User::select('uid', 'sessions_count', 'last_mood', 'quiz_completed', 'last_activity_at')
            ->orderByDesc('last_activity_at')
            ->orderByDesc('updated_at');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('uid', 'LIKE', "%{$search}%");
        }

        return $query->limit(200)->get();
    }

    public function userDetail(Request $request, string $uid)
    {
        $user = User::where('uid', $uid)->firstOrFail();
        $from = $this->parseDate($request->input('from'));
        $to = $this->parseDate($request->input('to'));
        $device = $request->input('device');

        $sessions = $user->sessions()
            ->when($from, fn ($query) => $query->where('started_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('started_at', '<=', $to))
            ->orderByDesc('started_at')
            ->limit(50)
            ->get();

        $answers = $user->answers()
            ->with(['question:id,question_text,question_key', 'answer:id,label'])
            ->orderByDesc('created_at')
            ->get();

        $interactions = $user->interactions()
            ->when($from, fn ($query) => $query->where('timestamp', '>=', $from))
            ->when($to, fn ($query) => $query->where('timestamp', '<=', $to))
            ->when($device, fn ($query) => $query->where('user_agent', 'LIKE', "%{$device}%"))
            ->orderByDesc('timestamp')
            ->limit(200)
            ->get();

        $comparisons = $user->comparisons()
            ->with(['items.perfume'])
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $profile = $this->profileService->getProfile($user);

        return [
            'user' => $user,
            'profile' => $profile,
            'sessions' => $sessions,
            'answers' => $answers,
            'interactions' => $interactions,
            'comparisons' => $comparisons,
        ];
    }

    public function comparisons()
    {
        return Comparison::with('user:id,uid')
            ->withCount('items')
            ->withCount([
                'items as winners_count' => function ($query) {
                    $query->where('is_winner', true);
                },
            ])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(function ($comparison) {
                return [
                    'id' => $comparison->id,
                    'user_uid' => $comparison->user?->uid,
                    'total_items' => $comparison->items_count,
                    'winners' => $comparison->winners_count,
                    'created_at' => $comparison->created_at,
                ];
            });
    }

    private function moodDistribution(): array
    {
        $data = UserAnswer::select('question_answers.label as label', DB::raw('COUNT(*) as total'))
            ->join('question_answers', 'user_answers.answer_id', '=', 'question_answers.id')
            ->join('questions', 'user_answers.question_id', '=', 'questions.id')
            ->where('questions.question_key', 'mood')
            ->groupBy('question_answers.label')
            ->orderByDesc('total')
            ->get();

        return $data->map(function ($row) {
            return [
                'label' => $row->label,
                'value' => (int) $row->total,
                'color' => $this->moodColorFor($row->label),
            ];
        })->toArray();
    }

    private function pageStats(): array
    {
        $stats = Interaction::where('event_type', 'page_view')
            ->whereRaw("JSON_EXTRACT(metadata, '$.page') IS NOT NULL")
            ->whereRaw("JSON_EXTRACT(metadata, '$.duration') IS NOT NULL")
            ->selectRaw("JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.page')) as page")
            ->selectRaw('COUNT(*) as views')
            ->selectRaw('AVG(CAST(JSON_UNQUOTE(JSON_EXTRACT(metadata, "$.duration")) AS DECIMAL(10,2))) as avg_duration')
            ->selectRaw('SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(metadata, "$.duration")) AS DECIMAL(10,2))) as total_duration')
            ->groupBy('page')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        return $stats->map(function ($row) {
            return [
                'page' => $row->page,
                'views' => (int) $row->views,
                'avg_duration' => round((float) $row->avg_duration, 1),
                'total_duration' => round((float) $row->total_duration, 1),
            ];
        })->toArray();
    }

    private function eventBreakdown(): array
    {
        return Interaction::select('event_type', DB::raw('COUNT(*) as total'))
            ->groupBy('event_type')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(function ($row) {
                return [
                    'event_type' => $row->event_type,
                    'total' => (int) $row->total,
                ];
            })
            ->toArray();
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable $th) {
            return null;
        }
    }

    private function moodColorFor(string $label): string
    {
        $normalized = mb_strtolower($label);

        return self::MOOD_COLORS[$normalized] ?? '#999999';
    }
}
