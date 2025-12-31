<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_type',
        'metadata',
        'timestamp',
        'page_url',
        'user_agent',
        'viewport_width',
        'viewport_height',
        'screen_width',
        'screen_height',
    ];

    protected $casts = [
        'metadata' => 'array',
        'timestamp' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
