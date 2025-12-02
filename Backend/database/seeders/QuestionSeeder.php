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
                'question_text' => 'Comment vous sentez-vous aujourd’hui ?',
                'subtitle' => 'Votre humeur influence votre perception',
                'question_key' => 'mood',
                'answers' => [
                    ['label' => 'Calme & Serein'],
                    ['label' => 'Énergique & Dynamique'],
                    ['label' => 'Romantique & Rêveur'],
                    ['label' => 'Confiant & Assuré'],
                    ['label' => 'Mystérieux & Profond'],
                ],
            ],
            [
                'order' => 2,
                'question_text' => 'Quel est votre style de vie ?',
                'subtitle' => 'Votre quotidien façonne vos besoins',
                'question_key' => 'lifestyle',
                'answers' => [
                    ['label' => 'Actif & Sportif'],
                    ['label' => 'Raffiné & Élégant'],
                    ['label' => 'Nocturne & Social'],
                    ['label' => 'Professionnel & Posé'],
                    ['label' => 'Décontracté & Cool'],
                ],
            ],
            [
                'order' => 3,
                'question_text' => 'Quelle famille olfactive vous attire ?',
                'subtitle' => 'Faites confiance à votre instinct',
                'question_key' => 'olfactive_family',
                'answers' => [
                    ['label' => 'Frais — Citrus, aquatique'],
                    ['label' => 'Floral — Rose, jasmin'],
                    ['label' => 'Boisé — Santal, cèdre'],
                    ['label' => 'Oriental — Ambre, vanille'],
                    ['label' => 'Épicé — Cannelle, poivre'],
                ],
            ],
            [
                'order' => 4,
                'question_text' => 'Quelle intensité préférez-vous ?',
                'subtitle' => 'La projection de votre parfum',
                'question_key' => 'intensity',
                'answers' => [
                    ['label' => 'Discret — Proche de la peau'],
                    ['label' => 'Présent — Équilibré'],
                    ['label' => 'Affirmé — Impossible à ignorer'],
                ],
            ],
            [
                'order' => 5,
                'question_text' => 'Quel budget envisagez-vous ?',
                'subtitle' => 'Nous adaptons nos suggestions',
                'question_key' => 'budget',
                'answers' => [
                    ['label' => 'Moins de 200€'],
                    ['label' => '200€ - 300€'],
                    ['label' => 'Plus de 300€'],
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
