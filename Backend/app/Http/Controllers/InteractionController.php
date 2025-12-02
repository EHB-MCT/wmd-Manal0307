<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\User;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function track(Request $request)
    {
        $user = User::where('uid', $request->uid)->firstOrFail();

        Interaction::create([
            'user_id' => $user->id,
            'event_type' => $request->event_type,
            'metadata' => $request->metadata,
            'timestamp' => now(),
        ]);

        return response()->json(['tracked' => true]);
    }
}
