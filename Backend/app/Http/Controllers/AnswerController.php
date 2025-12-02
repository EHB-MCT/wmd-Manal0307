<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAnswer;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    public function store(Request $request)
    {
        $user = User::where('uid', $request->uid)->firstOrFail();

        UserAnswer::create([
            'user_id' => $user->id,
            'question_id' => $request->question_id,
            'answer_id' => $request->answer_id,
            'time_spent' => $request->time_spent,
            'abandoned' => $request->abandoned ?? false,
        ]);

        if ($request->question_key === 'mood') {
            $user->last_mood = $request->answer_label;
            $user->save();
        }

        return response()->json(['status' => 'ok']);
    }
}
