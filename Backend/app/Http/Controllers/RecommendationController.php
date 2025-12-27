<?php

namespace App\Http\Controllers;

use App\Models\Perfume;
use App\Models\User;

class RecommendationController extends Controller
{
    public function get(string $uid)
    {
        $user = User::where('uid', $uid)->firstOrFail();
        $user->last_activity_at = now();
        $user->save();

        $query = Perfume::query();

        if ($user->last_mood) {
            $query->where('mood', $user->last_mood);
        }

        $recommendations = $query->inRandomOrder()->limit(4)->get();

        if ($recommendations->isEmpty()) {
            $recommendations = Perfume::inRandomOrder()->limit(4)->get();
        }

        return $recommendations->values();
    }
}
