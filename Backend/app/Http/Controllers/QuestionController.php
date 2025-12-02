<?php

namespace App\Http\Controllers;

use App\Models\Question;

class QuestionController extends Controller
{
    public function index()
    {
        return Question::with('answers')
            ->orderBy('order')
            ->get();
    }
}
