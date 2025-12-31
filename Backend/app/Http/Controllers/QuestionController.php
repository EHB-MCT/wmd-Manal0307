<?php

namespace App\Http\Controllers;

use App\Models\Question;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::with(['answers' => function ($query) {
            $query->withCount('userAnswers');
        }])
            ->orderBy('order')
            ->get();

        return $questions->map(function ($question) {
            $totalAnswers = $question->answers->sum('user_answers_count');
            $popular = $question->answers
                ->sortByDesc('user_answers_count')
                ->first();

            if ($popular && $popular->user_answers_count > 0) {
                $question->setAttribute('popular_answer_id', $popular->id);
                $question->setAttribute('popular_answer_label', $popular->label);
                $question->setAttribute('popular_answer_total', $popular->user_answers_count);
                $question->setAttribute(
                    'popular_answer_share',
                    $totalAnswers > 0 ? round(($popular->user_answers_count / $totalAnswers) * 100) : 0
                );
            } else {
                $question->setAttribute('popular_answer_id', null);
                $question->setAttribute('popular_answer_label', null);
                $question->setAttribute('popular_answer_total', 0);
                $question->setAttribute('popular_answer_share', 0);
            }
            $question->setAttribute('answers_total_count', $totalAnswers);

            $question->answers->each->makeHidden('user_answers_count');

            return $question;
        });
    }
}
