<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AiAssistantController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Public listings (for Keşfet)
Route::get('/listings/public', [ListingController::class, 'publicIndex']);
Route::get('/listings/public/{id}', [ListingController::class, 'showPublic']);
Route::post('/listings/{id}/track', [ListingController::class, 'trackAnalytics']);
Route::post('/ai/summarize-reviews', [AiAssistantController::class, 'summarizeReviews']);

Route::middleware(['auth:sanctum', \App\Http\Middleware\UpdateLastSeen::class])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/update', [AuthController::class, 'updateProfile']);
    Route::post('/user/avatar', [AuthController::class, 'updateAvatar']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
    Route::get('/user/payments', [\App\Http\Controllers\PaymentController::class, 'userPayments']);

    // AI Assistant
    Route::post('/ai/generate-listing', [AiAssistantController::class, 'generateListing']);

    // Listings CRUD
    Route::get('/listings', [ListingController::class, 'index']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::post('/listings/{id}', [ListingController::class, 'update']); // POST for FormData
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']);
    Route::post('/listings/{id}/simulate-payment', [\App\Http\Controllers\PaymentController::class, 'simulatePayment']);
    Route::post('/listings/{id}/cancel-promotion', [\App\Http\Controllers\PaymentController::class, 'cancelPromotion']);
    Route::post('/listings/{id}/reviews', [ReviewController::class, 'store']);

    // Messaging
    Route::get('/conversations', [\App\Http\Controllers\MessageController::class, 'index']);
    Route::get('/conversations/{id}', [\App\Http\Controllers\MessageController::class, 'show']);
    Route::post('/messages', [\App\Http\Controllers\MessageController::class, 'store']);
    Route::post('/messages/{id}/handle-offer', [\App\Http\Controllers\MessageController::class, 'handleOffer']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);

    // Admin & Disputes
    Route::get('/admin/disputes', [\App\Http\Controllers\DisputeController::class, 'index']);
    Route::post('/admin/disputes/{id}/resolve', [\App\Http\Controllers\DisputeController::class, 'resolve']);
});
