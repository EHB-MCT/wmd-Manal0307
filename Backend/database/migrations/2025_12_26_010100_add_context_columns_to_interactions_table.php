<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('interactions', function (Blueprint $table) {
            $table->string('page_url', 2048)->nullable()->after('metadata');
            $table->string('user_agent', 512)->nullable()->after('page_url');
            $table->integer('viewport_width')->nullable()->after('user_agent');
            $table->integer('viewport_height')->nullable()->after('viewport_width');
            $table->integer('screen_width')->nullable()->after('viewport_height');
            $table->integer('screen_height')->nullable()->after('screen_width');
        });
    }

    public function down(): void
    {
        Schema::table('interactions', function (Blueprint $table) {
            $table->dropColumn([
                'page_url',
                'user_agent',
                'viewport_width',
                'viewport_height',
                'screen_width',
                'screen_height',
            ]);
        });
    }
};
