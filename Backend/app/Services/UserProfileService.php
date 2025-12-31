<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Arr;

class UserProfileService
{
    public function calculate(User $user): UserProfile
    {
        $answers = $user->answers()->with('question')->get();

        $traits = [
            'mood' => null,
            'lifestyle' => null,
            'intensity' => null,
            'budget' => null,
            'engagement' => $user->sessions()->count(),
            'abandonments' => $user->sessions()->where('completed', false)->count(),
            'avg_time_per_answer' => round($answers->avg('time_spent') ?? 0, 2),
        ];

        foreach ($answers as $answer) {
            if (!$answer->question?->question_key) {
                continue;
            }

            $traits[$answer->question->question_key] = $answer->answer?->label;
        }

        $score = $this->scoreFromTraits($traits);
        $segment = $this->segmentFromTraits($traits, $score);

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'traits' => $traits,
                'score' => $score,
                'segment' => $segment,
            ]
        );

        return $profile->fresh();
    }

    public function getProfile(User $user): UserProfile
    {
        return $user->profile ?? $this->calculate($user);
    }

    private function scoreFromTraits(array $traits): float
    {
        $score = 0;

        $moodWeights = [
            'Calme & Serein' => 0.5,
            'Énergique & Dynamique' => 0.8,
            'Romantique & Rêveur' => 0.6,
            'Confiant & Assuré' => 1.0,
            'Mystérieux & Profond' => 0.9,
        ];

        $score += Arr::get($moodWeights, $traits['mood'] ?? '', 0.5) * 25;

        if ($traits['budget']) {
            if (str_contains($traits['budget'], 'meer dan') || str_contains($traits['budget'], 'Plus')) {
                $score += 30;
            } elseif (str_contains($traits['budget'], '200')) {
                $score += 20;
            } else {
                $score += 10;
            }
        }

        $score += min(20, ($traits['engagement'] ?? 0) * 5);
        $score -= min(15, ($traits['abandonments'] ?? 0) * 7);
        $score -= min(10, ($traits['avg_time_per_answer'] ?? 0) / 2);

        return max(0, min(100, round($score, 2)));
    }

    private function segmentFromTraits(array $traits, float $score): ?string
    {
        if (($traits['budget'] ?? null) && str_contains(strtolower($traits['budget']), 'meer dan')) {
            return 'luxury_high_spender';
        }

        if ($score >= 70) {
            return 'premium_target';
        }

        if ($score >= 40) {
            return 'engaged_mid';
        }

        return 'low_attention';
    }
}
