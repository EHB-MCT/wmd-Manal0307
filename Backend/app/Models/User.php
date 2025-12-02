<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'last_activity_at',
        'sessions_count',
        'quiz_completed',
        'last_mood',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'quiz_completed' => 'boolean',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(UserSession::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(UserAnswer::class);
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }

    public function comparisons(): HasMany
    {
        return $this->hasMany(Comparison::class);
    }
}
