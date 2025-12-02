<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comparison_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comparison_id')->constrained('comparisons')->onDelete('cascade');
            $table->foreignId('perfume_id')->constrained('perfumes')->onDelete('cascade');
            $table->boolean('is_winner')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comparison_items');
    }
};
