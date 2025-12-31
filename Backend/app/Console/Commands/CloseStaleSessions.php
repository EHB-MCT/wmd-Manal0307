<?php

namespace App\Console\Commands;

use App\Models\UserSession;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CloseStaleSessions extends Command
{
    protected $signature = 'sessions:close-stale {--timeout=45 : Minutes of inactivity before a session is closed}';

    protected $description = 'Mark lingering quiz sessions as finished and normalize their duration.';

    public function handle(): int
    {
        $timeout = max((int) $this->option('timeout'), 5);
        $threshold = Carbon::now()->subMinutes($timeout);

        $staleSessions = UserSession::with('user')
            ->whereNull('ended_at')
            ->where('started_at', '<=', $threshold)
            ->get();

        if ($staleSessions->isEmpty()) {
            $this->info('No stale sessions found.');

            return self::SUCCESS;
        }

        $closed = 0;
        $now = Carbon::now();

        foreach ($staleSessions as $session) {
            $session->ended_at = $now;
            $session->duration = max(0, $now->diffInSeconds($session->started_at));
            $session->completed = $session->completed ?? false;
            $session->save();

            if ($session->user && !$session->completed) {
                $session->user->quiz_completed = false;
                $session->user->save();
            }

            $closed++;
        }

        $this->info("Closed {$closed} stale session(s).");

        return self::SUCCESS;
    }
}
