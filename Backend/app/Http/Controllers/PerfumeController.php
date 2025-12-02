<?php

namespace App\Http\Controllers;

use App\Models\Perfume;

class PerfumeController extends Controller
{
    public function index()
    {
        return Perfume::all();
    }
}
