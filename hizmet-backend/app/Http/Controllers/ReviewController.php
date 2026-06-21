<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Listing;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request, $listingId)
    {
        $listing = Listing::findOrFail($listingId);

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:3',
            'price_paid' => 'required|numeric|min:1',
            'images.*' => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 1. Prevent self-reviewing
        if ($listing->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Kendi hizmet ilanınıza yorum yapamazsınız.'
            ], 403);
        }

        // 1.5. Ensure they have a completed job
        $hasCompletedJob = \App\Models\Conversation::where(function($q) use ($listing, $request) {
            $q->where('user_one_id', $listing->user_id)->where('user_two_id', $request->user()->id)
              ->orWhere('user_two_id', $listing->user_id)->where('user_one_id', $request->user()->id);
        })->whereHas('messages', function($q) use ($listing) {
            $q->where('sender_id', $listing->user_id)
              ->where('body', 'LIKE', 'OFFER_COMPLETED|%');
        })->exists();

        if (!$hasCompletedJob) {
            return response()->json([
                'success' => false,
                'message' => 'Yalnızca hizmeti satın alıp teslim alan (Güvenli Ödeme sürecini tamamlayan) müşteriler yorum yapabilir.'
            ], 403);
        }

        // 2. Prevent duplicate reviews by the same user
        $exists = Review::where('listing_id', $listing->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Bu ilana daha önce değerlendirme yaptınız.'
            ], 400);
        }

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagePaths[] = $file->store('reviews/images', 'public');
            }
        }

        $review = Review::create([
            'listing_id' => $listing->id,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'price_paid' => $request->price_paid,
            'images' => $imagePaths,
        ]);

        $review->load('user:id,name,avatar');

        return response()->json([
            'success' => true,
            'review' => [
                'id' => $review->id,
                'author' => $review->user->name,
                'avatar' => $review->user->avatar ? url('storage/' . $review->user->avatar) : null,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'price_paid' => $review->price_paid,
                'images' => collect($review->images ?? [])->map(fn($img) => url('storage/' . $img))->toArray(),
                'date' => $review->created_at->diffForHumans(),
                'service' => $listing->service,
            ]
        ], 201);
    }
}
