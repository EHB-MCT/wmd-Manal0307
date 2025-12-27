<?php

namespace App\Http\Controllers;

use App\Models\Comparison;
use App\Models\ComparisonItem;
use App\Models\User;
use Illuminate\Http\Request;

class ComparisonController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'uid' => ['required', 'string'],
            'perfumes' => ['required', 'array', 'min:1'],
            'perfumes.*.id' => ['required', 'integer', 'exists:perfumes,id'],
            'perfumes.*.is_winner' => ['nullable', 'boolean'],
        ]);

        $user = User::where('uid', $data['uid'])->firstOrFail();

        $comparison = Comparison::create([
            'user_id' => $user->id,
        ]);

        foreach ($data['perfumes'] as $perfume) {
            ComparisonItem::create([
                'comparison_id' => $comparison->id,
                'perfume_id' => $perfume['id'],
                'is_winner' => $perfume['is_winner'] ?? false,
            ]);
        }

        $user->last_activity_at = now();
        $user->save();

        return response()->json($comparison->load('items'));
    }
}
