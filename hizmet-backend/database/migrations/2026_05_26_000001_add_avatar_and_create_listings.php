<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add avatar to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('phone');
            $table->string('city')->nullable()->after('avatar');
            $table->string('district')->nullable()->after('city');
            $table->string('bio')->nullable()->after('district');
        });

        // Create listings table
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('service');
            $table->string('title');
            $table->text('description');
            $table->text('process')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('portfolio_images')->nullable();
            $table->string('price_range')->nullable();
            $table->string('experience')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'city', 'district', 'bio']);
        });
    }
};
