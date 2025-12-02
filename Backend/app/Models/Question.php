<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'order',
        'question_text',
        'subtitle',
        'question_key',
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(QuestionAnswer::class);
    }
}
