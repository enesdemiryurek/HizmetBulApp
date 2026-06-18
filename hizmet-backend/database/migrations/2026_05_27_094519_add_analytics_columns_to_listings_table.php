<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->unsignedBigInteger('views')->default(0)->after('is_active');
            $table->unsignedBigInteger('clicks')->default(0)->after('views');
            $table->unsignedBigInteger('message_clicks')->default(0)->after('clicks');
            $table->unsignedBigInteger('phone_clicks')->default(0)->after('message_clicks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['views', 'clicks', 'message_clicks', 'phone_clicks']);
        });
    }
};
