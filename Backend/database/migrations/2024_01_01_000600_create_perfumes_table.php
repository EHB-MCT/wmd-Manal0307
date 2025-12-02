<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfumes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('family')->nullable();
            $table->string('intensity')->nullable();
            $table->text('image_url')->nullable();
            $table->text('notes_top')->nullable();
            $table->text('notes_middle')->nullable();
            $table->text('notes_base')->nullable();
            $table->string('mood')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perfumes');
    }
};
