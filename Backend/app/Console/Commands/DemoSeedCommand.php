<?php

namespace App\Console\Commands;

use App\Models\Question;
use App\Models\QuestionAnswer;
use App\Models\User;
use App\Models\UserAnswer;
use App\Models\UserSession;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class DemoSeedCommand extends Command
{
    protected $signature = 'demo:seed {--count=3 : aantal demo-gebruikers}';

    protected $description = 'Genereer demo sessies, antwoorden en interacties zonder mockdata te committen.';

    public function handle(): int
    {
        $count = max((int) $this->option('count'), 1);

        $questions = Question::with('answers')->orderBy('order')->get();
        if ($questions->isEmpty()) {
            $this->error('Geen vragen gevonden. Voer eerst de seeders uit.');

            return self::FAILURE;
        }

        for ($i = 0; $i < $count; $i++) {
            $user = User::create([
                'uid' => (string) Str::uuid(),
                'sessions_count' => 0,
                'quiz_completed' => false,
                'last_activity_at' => now(),
            ]);

            $session = UserSession::create([
                'user_id' => $user->id,
                'started_at' => now()->subMinutes(rand(5, 20)),
                'ended_at' => now(),
                'duration' => rand(60, 300),
                'completed' => true,
            ]);

            foreach ($questions as $question) {
                $answer = $question->answers->random();
                UserAnswer::create([
                    'user_id' => $user->id,
                    'question_id' => $question->id,
                    'answer_id' => $answer->id,
                    'time_spent' => rand(3, 20),
                    'abandoned' => false,
                ]);
            }

            $user->quiz_completed = true;
            $user->sessions_count = 1;
            $user->last_activity_at = now();
            $user->save();
        }

        $this->info("Demo data voor {$count} gebruikers toegevoegd.");

        return self::SUCCESS;
    }
}
