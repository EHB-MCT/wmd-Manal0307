<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserProfileService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(private UserProfileService $service)
    {
    }

    public function show(string $uid)
    {
        $user = User::where('uid', $uid)->firstOrFail();
        $profile = $this->service->getProfile($user);
        $latestAction = $user->adminActions()->latest()->first();

        return response()->json([
            'profile' => $profile,
            'latest_action' => $latestAction,
        ]);
    }
}
