<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'started_at',
        'ended_at',
        'duration',
        'completed',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'completed' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (UserSession $session) {
            if ($session->duration && $session->duration < 0) {
                $session->duration = abs($session->duration);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
