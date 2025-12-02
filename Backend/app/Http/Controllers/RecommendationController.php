<?php

namespace App\Http\Controllers;

use App\Models\Perfume;
use App\Models\User;

class RecommendationController extends Controller
{
    public function get(string $uid)
    {
        $user = User::where('uid', $uid)->firstOrFail();

        if (!$user->last_mood) {
            return response()->json([]);
        }

        return Perfume::where('mood', $user->last_mood)->get();
    }
}
