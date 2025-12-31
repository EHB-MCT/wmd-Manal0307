<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\QuestionAnswer;
use App\Models\User;
use App\Models\UserAnswer;
use App\Models\UserSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAnalyticsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_detail_endpoint_returns_sessions_answers(): void
    {
        $question = Question::factory()->create(['order' => 1]);
        $answer = QuestionAnswer::factory()->create(['question_id' => $question->id]);

        $user = User::factory()->create();
        UserSession::factory()->create([
            'user_id' => $user->id,
            'completed' => true,
        ]);

        UserAnswer::create([
            'user_id' => $user->id,
            'question_id' => $question->id,
            'answer_id' => $answer->id,
            'time_spent' => 12,
            'abandoned' => false,
        ]);

        $response = $this->getJson("/api/admin/users/{$user->uid}");

        $response->assertOk();
        $data = $response->json();
        $this->assertSame($user->uid, $data['user']['uid']);
        $this->assertCount(1, $data['sessions']);
        $this->assertCount(1, $data['answers']);
    }
}
