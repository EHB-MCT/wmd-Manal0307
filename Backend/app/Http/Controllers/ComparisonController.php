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
        $user = User::where('uid', $request->uid)->firstOrFail();

        $comparison = Comparison::create([
            'user_id' => $user->id,
        ]);

        foreach ($request->perfumes as $perfume) {
            ComparisonItem::create([
                'comparison_id' => $comparison->id,
                'perfume_id' => $perfume['id'],
                'is_winner' => $perfume['is_winner'] ?? false,
            ]);
        }

        return response()->json($comparison->load('items'));
    }
}
