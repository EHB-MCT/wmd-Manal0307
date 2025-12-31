<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAnswer;
use App\Services\UserProfileService;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    private const MOOD_LABELS = [
        'calme & serein' => 'Calme & Serein',
        'kalm & sereen' => 'Calme & Serein',
        'énergique & dynamique' => 'Énergique & Dynamique',
        'energiek & dynamisch' => 'Énergique & Dynamique',
        'romantique & rêveur' => 'Romantique & Rêveur',
        'romantisch & dromerig' => 'Romantique & Rêveur',
        'confiant & assuré' => 'Confiant & Assuré',
        'zelfzeker & krachtig' => 'Confiant & Assuré',
        'mystérieux & profond' => 'Mystérieux & Profond',
        'mysterieux & profond' => 'Mystérieux & Profond',
        'mysterieus & diep' => 'Mystérieux & Profond',
    ];

    public function __construct(private UserProfileService $profileService)
    {
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'uid' => ['required', 'string'],
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer_id' => ['nullable', 'integer', 'exists:question_answers,id'],
            'time_spent' => ['nullable', 'numeric'],
            'abandoned' => ['nullable', 'boolean'],
            'question_key' => ['nullable', 'string'],
            'answer_label' => ['nullable', 'string'],
        ]);

        $user = User::where('uid', $data['uid'])->firstOrFail();

        UserAnswer::create([
            'user_id' => $user->id,
            'question_id' => $data['question_id'],
            'answer_id' => $data['answer_id'] ?? null,
            'time_spent' => $data['time_spent'],
            'abandoned' => $data['abandoned'] ?? false,
        ]);

        if (($data['question_key'] ?? null) === 'mood') {
            $user->last_mood = $this->normalizeMood($data['answer_label'] ?? '') ?? $user->last_mood;
        }

        if ($request->boolean('abandoned')) {
            $user->quiz_completed = false;
        }

        $user->last_activity_at = now();
        $user->save();

        $this->profileService->calculate($user);

        return response()->json(['status' => 'ok']);
    }

    private function normalizeMood(?string $label): ?string
    {
        if (!$label) {
            return null;
        }

        $key = mb_strtolower(trim($label));

        return self::MOOD_LABELS[$key] ?? $label;
    }
}
