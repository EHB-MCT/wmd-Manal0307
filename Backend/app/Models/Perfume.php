<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfume extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'family',
        'intensity',
        'image_url',
        'notes_top',
        'notes_middle',
        'notes_base',
        'mood',
    ];
}
