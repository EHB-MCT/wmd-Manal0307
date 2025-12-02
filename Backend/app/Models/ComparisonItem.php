<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComparisonItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'comparison_id',
        'perfume_id',
        'is_winner',
    ];

    protected $casts = [
        'is_winner' => 'boolean',
    ];

    public function comparison(): BelongsTo
    {
        return $this->belongsTo(Comparison::class);
    }

    public function perfume(): BelongsTo
    {
        return $this->belongsTo(Perfume::class);
    }
}
