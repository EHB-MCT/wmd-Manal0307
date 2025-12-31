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

        return response()->json($this->service->getProfile($user));
    }
}
