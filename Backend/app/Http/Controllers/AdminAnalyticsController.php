<?php

namespace App\Http\Controllers;

use App\Models\Comparison;
use App\Models\User;
use App\Models\UserAnswer;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function overview()
    {
        return [
            'total_quizzes' => User::where('quiz_completed', true)->count(),
            'avg_quiz_time' => UserAnswer::avg('time_spent'),
            'abandon_rate' => UserAnswer::count() > 0
                ? UserAnswer::where('abandoned', true)->count() / UserAnswer::count() * 100
                : 0,
            'total_comparisons' => Comparison::count(),
        ];
    }

    public function questions()
    {
        return DB::table('questions')
            ->join('user_answers', 'questions.id', '=', 'user_answers.question_id')
            ->select('questions.id', 'questions.question_text', DB::raw('AVG(time_spent) as avg_time'))
            ->groupBy('questions.id', 'questions.question_text')
            ->get();
    }
}
