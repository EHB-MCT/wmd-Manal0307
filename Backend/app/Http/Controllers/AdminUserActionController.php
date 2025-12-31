<?php

namespace App\Http\Controllers;

use App\Models\AdminUserAction;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserActionController extends Controller
{
    public function store(Request $request, string $uid)
    {
        $data = $request->validate([
            'action_type' => ['required', 'string', 'in:flag,promote'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $user = User::where('uid', $uid)->firstOrFail();

        $action = AdminUserAction::create([
            'user_id' => $user->id,
            'action_type' => $data['action_type'],
            'context' => array_filter([
                'note' => $data['note'] ?? null,
                'performed_by' => 'admin', // placeholder since geen auth
            ]),
        ]);

        return response()->json($action->fresh()->load('user'));
    }
}
