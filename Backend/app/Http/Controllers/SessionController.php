<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function start(Request $request)
    {
        $data = $request->validate([
            'uid' => ['required', 'string'],
        ]);

        $user = User::where('uid', $data['uid'])->firstOrFail();

        $session = UserSession::create([
            'user_id' => $user->id,
            'started_at' => now(),
        ]);

        $user->sessions_count += 1;
        $user->last_activity_at = now();
        $user->save();

        return response()->json($session);
    }

    public function end(Request $request)
    {
        $data = $request->validate([
            'session_id' => ['required', 'integer', 'exists:user_sessions,id'],
            'completed' => ['nullable', 'boolean'],
        ]);

        $session = UserSession::with('user')->findOrFail($data['session_id']);
        $endedAt = now();

        $session->ended_at = $endedAt;
        $session->duration = $endedAt->diffInSeconds($session->started_at);
        $session->save();

        if ($session->user) {
            if ($request->boolean('completed')) {
                $session->user->quiz_completed = true;
            }

            $session->user->last_activity_at = $endedAt;
            $session->user->save();
        }

        return response()->json($session);
    }
}
