<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function start(Request $request)
    {
        $user = User::where('uid', $request->uid)->firstOrFail();

        $session = UserSession::create([
            'user_id' => $user->id,
            'started_at' => now(),
        ]);

        $user->sessions_count += 1;
        $user->save();

        return response()->json($session);
    }

    public function end(Request $request)
    {
        $session = UserSession::findOrFail($request->session_id);

        $session->ended_at = now();
        $session->duration = now()->diffInSeconds($session->started_at);
        $session->save();

        return response()->json($session);
    }
}
