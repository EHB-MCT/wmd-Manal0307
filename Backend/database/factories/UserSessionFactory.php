<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<UserSession>
 */
class UserSessionFactory extends Factory
{
    protected $model = UserSession::class;

    public function definition(): array
    {
        $started = Carbon::now()->subMinutes(fake()->numberBetween(1, 60));
        $ended = (clone $started)->addMinutes(fake()->numberBetween(1, 20));

        return [
            'user_id' => User::factory(),
            'started_at' => $started,
            'ended_at' => $ended,
            'duration' => $ended->diffInSeconds($started),
            'completed' => fake()->boolean(70),
        ];
    }

    public function open(): static
    {
        return $this->state(fn () => [
            'ended_at' => null,
            'duration' => null,
            'completed' => false,
        ]);
    }
}
