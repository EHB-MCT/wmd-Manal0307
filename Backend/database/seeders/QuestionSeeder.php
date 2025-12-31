<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionAnswer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        QuestionAnswer::query()->delete();
        Question::query()->delete();
        DB::statement('ALTER TABLE question_answers AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE questions AUTO_INCREMENT = 1');

        $questions = [
            [
                'order' => 1,
                'question_text' => 'Hoe voelt u zich vandaag?',
                'subtitle' => 'Uw humeur beïnvloedt uw perceptie',
                'question_key' => 'mood',
                'answers' => [
                    ['label' => 'Kalm & sereen'],
                    ['label' => 'Energiek & dynamisch'],
                    ['label' => 'Romantisch & dromerig'],
                    ['label' => 'Zelfzeker & krachtig'],
                    ['label' => 'Mysterieus & diep'],
                ],
            ],
            [
                'order' => 2,
                'question_text' => 'Wat is uw levensstijl?',
                'subtitle' => 'Uw dagelijkse ritme stuurt uw geurkeuze',
                'question_key' => 'lifestyle',
                'answers' => [
                    ['label' => 'Actief & sportief'],
                    ['label' => 'Raffiné & elegant'],
                    ['label' => 'Avondmens & sociaal'],
                    ['label' => 'Zakelijk & rustig'],
                    ['label' => 'Relax & casual'],
                ],
            ],
            [
                'order' => 3,
                'question_text' => 'Welke geurfamilie spreekt u aan?',
                'subtitle' => 'Vertrouw op uw instinct',
                'question_key' => 'scent_family',
                'answers' => [
                    ['label' => 'Fris — Citrus, aquatisch'],
                    ['label' => 'Floraal — Roos, jasmijn'],
                    ['label' => 'Houtachtig — Sandelhout, ceder'],
                    ['label' => 'Oriëntaals — Amber, vanille'],
                    ['label' => 'Kruidig — Kaneel, peper'],
                ],
            ],
            [
                'order' => 4,
                'question_text' => 'Welke intensiteit verkiest u?',
                'subtitle' => 'Van subtiel tot uitgesproken',
                'question_key' => 'intensity',
                'answers' => [
                    ['label' => 'Discreet — dicht op de huid'],
                    ['label' => 'Aanwezig — mooi in balans'],
                    ['label' => 'Statement — niet te negeren'],
                ],
            ],
            [
                'order' => 5,
                'question_text' => 'Welk budget voorziet u?',
                'subtitle' => 'Wij stemmen onze suggesties af op uw investering',
                'question_key' => 'budget',
                'answers' => [
                    ['label' => 'Tot €150'],
                    ['label' => '€150 - €250'],
                    ['label' => 'Meer dan €250'],
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
