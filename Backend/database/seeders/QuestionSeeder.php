<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionAnswer;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'order' => 1,
                'question_text' => 'Quel est ton mood aujourd’hui ?',
                'question_key' => 'mood',
                'answers' => [
                    ['label' => 'Calme', 'color' => '#A5D8FF'],
                    ['label' => 'Énergique', 'color' => '#FFC857'],
                    ['label' => 'Romantique', 'color' => '#F4A1D6'],
                    ['label' => 'Mystérieux', 'color' => '#8E44AD'],
                ],
            ],
            [
                'order' => 2,
                'question_text' => 'Quel est ton style de vie ?',
                'question_key' => 'lifestyle',
                'answers' => [
                    ['label' => 'Minimaliste', 'color' => '#2D3142'],
                    ['label' => 'Créatif', 'color' => '#EF8354'],
                    ['label' => 'Aventurier', 'color' => '#60A561'],
                    ['label' => 'Luxueux', 'color' => '#CDA434'],
                ],
            ],
            [
                'order' => 3,
                'question_text' => 'Quel budget veux-tu consacrer à ton parfum ?',
                'question_key' => 'budget',
                'answers' => [
                    ['label' => 'Moins de 50€', 'color' => '#9EBC9F'],
                    ['label' => '50€ - 100€', 'color' => '#F6AE2D'],
                    ['label' => '100€ - 200€', 'color' => '#33658A'],
                    ['label' => '200€ et plus', 'color' => '#2F4858'],
                ],
            ],
            [
                'order' => 4,
                'question_text' => 'Dans quel contexte vas-tu porter ce parfum ?',
                'question_key' => 'context',
                'answers' => [
                    ['label' => 'Quotidien', 'color' => '#84BCDA'],
                    ['label' => 'Soirées', 'color' => '#C94C4C'],
                    ['label' => 'Travail', 'color' => '#2A3D45'],
                    ['label' => 'Occasions spéciales', 'color' => '#D4A5A5'],
                ],
            ],
            [
                'order' => 5,
                'question_text' => 'Quelle intensité préfères-tu ?',
                'question_key' => 'intensity_preference',
                'answers' => [
                    ['label' => 'Discrète', 'color' => '#F0E5DE'],
                    ['label' => 'Présente', 'color' => '#F76F8E'],
                    ['label' => 'Envoûtante', 'color' => '#441151'],
                ],
            ],
        ];

        foreach ($questions as $questionData) {
            $answers = $questionData['answers'] ?? [];
            unset($questionData['answers']);

            $question = Question::create($questionData);

            foreach ($answers as $answer) {
                QuestionAnswer::create([
                    'question_id' => $question->id,
                    'label' => $answer['label'],
                    'color' => $answer['color'] ?? null,
                ]);
            }
        }
    }
}
