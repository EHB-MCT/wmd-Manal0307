<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\User;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function track(Request $request)
    {
        $data = $request->validate([
            'uid' => ['required', 'string'],
            'event_type' => ['required', 'string'],
            'metadata' => ['nullable', 'array'],
        ]);

        $user = User::where('uid', $data['uid'])->firstOrFail();
        $now = now();

        Interaction::create([
            'user_id' => $user->id,
            'event_type' => $data['event_type'],
            'metadata' => $data['metadata'] ?? [],
            'timestamp' => $now,
        ]);

        $user->last_activity_at = $now;
        $user->save();

        return response()->json(['tracked' => true]);
    }
}
