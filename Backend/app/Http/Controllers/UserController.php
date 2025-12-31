<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function init(Request $request)
    {
        $request->validate([
            'uid' => ['nullable', 'string'],
        ]);

        $uid = $request->uid;

        if ($uid) {
            $user = User::where('uid', $uid)->first();
            if ($user) {
                $user->last_activity_at = now();
                $user->save();

                return response()->json($user);
            }
        }

        $newUID = uniqid('usr_');

        $user = User::create([
            'uid' => $newUID,
            'sessions_count' => 0,
            'quiz_completed' => false,
            'last_activity_at' => now(),
        ]);

        return response()->json($user);
    }
}
