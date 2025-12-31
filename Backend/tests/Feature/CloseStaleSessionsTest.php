<?php

namespace Tests\Feature;

use App\Models\UserSession;
use Illuminate\Console\Command;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CloseStaleSessionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_closes_sessions_older_than_timeout(): void
    {
        $stale = UserSession::factory()
            ->open()
            ->create([
                'started_at' => now()->subMinutes(120),
            ]);

        $fresh = UserSession::factory()
            ->open()
            ->create([
                'started_at' => now()->subMinutes(10),
            ]);

        $this->artisan('sessions:close-stale', ['--timeout' => 30])
            ->expectsOutput('Closed 1 stale session(s).')
            ->assertExitCode(Command::SUCCESS);

        $stale->refresh();
        $fresh->refresh();

        $this->assertNotNull($stale->ended_at);
        $this->assertNotNull($stale->duration);
        $this->assertFalse($stale->completed);

        $this->assertNull($fresh->ended_at);
        $this->assertNull($fresh->duration);
    }
}
