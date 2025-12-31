<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\QuestionAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionAnswerFactory extends Factory
{
    protected $model = QuestionAnswer::class;

    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'label' => $this->faker->word(),
        ];
    }
}
