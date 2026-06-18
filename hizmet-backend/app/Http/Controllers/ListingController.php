<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class ListingController extends Controller
{
    /** GET /api/listings — my listings */
    public function index(Request $request)
    {
        $listings = Listing::with(['reviews.user:id,name,avatar'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(function ($listing) {
                $reviewsCount = $listing->reviews->count();
                $avgRating = $reviewsCount > 0 ? round($listing->reviews->avg('rating'), 1) : 0.0;
                $avgPricePaid = $reviewsCount > 0 ? round($listing->reviews->avg('price_paid')) : null;
                $gamificationData = $this->getGamificationLevel($listing->reviews);
                $gamificationLevel = $gamificationData['level'];
                $gamificationXp = $gamificationData['xp'];
                $gamificationNextXp = $gamificationData['next_xp'];

                return [
                    'id'               => $listing->id,
                    'service'          => $listing->service,
                    'sub_services'     => $listing->sub_services ?? [],
                    'title'            => $listing->title,
                    'description'      => $listing->description,
                    'process'          => $listing->process,
                    'cover_image'      => $listing->cover_image
                        ? url('storage/' . $listing->cover_image)
                        : null,
                    'portfolio_images' => collect($listing->portfolio_images ?? [])
                        ->map(fn($p) => url('storage/' . $p))
                        ->toArray(),
                    'price_range'      => $listing->price_range,
                    'experience'       => $listing->experience,
                    'city'             => $listing->city,
                    'district'         => $listing->district,
                    'tags'             => $listing->tags ?? [],
                    'views'            => $listing->views ?? 0,
                    'clicks'           => $listing->clicks ?? 0,
                    'message_clicks'   => $listing->message_clicks ?? 0,
                    'phone_clicks'     => $listing->phone_clicks ?? 0,
                    'rating'           => $avgRating,
                    'reviewCount'      => $reviewsCount,
                    'avg_price_paid'   => $avgPricePaid,
                    'gamification_level' => $gamificationLevel,
                    'gamification_xp'    => $gamificationXp,
                    'gamification_next_xp' => $gamificationNextXp,
                    'reviews'          => $listing->reviews->map(function($r) use ($listing) {
                        return [
                            'id' => $r->id,
                            'author' => $r->user->name,
                            'avatar' => $r->user->avatar ? url('storage/' . $r->user->avatar) : null,
                            'rating' => $r->rating,
                            'comment' => $r->comment,
                            'price_paid' => $r->price_paid,
                            'date' => $r->created_at->diffForHumans(),
                            'service' => $listing->service,
                        ];
                    }),
                    'is_promoted'      => (bool)$listing->is_promoted,
                    'promoted_until'   => $listing->promoted_until,
                    'created_at'       => $listing->created_at,
                ];
            });

        return response()->json(['success' => true, 'listings' => $listings]);
    }

    /** GET /api/listings/public — all active listings (for keşfet) */
    public function publicIndex()
    {
        // Auto-expire promotions: reset is_promoted=false where promoted_until is in the past
        $expiredCount = Listing::where('is_promoted', true)
            ->whereNotNull('promoted_until')
            ->where('promoted_until', '<', now())
            ->update(['is_promoted' => false]);

        // Clear cache if any promotions expired
        if ($expiredCount > 0) {
            Cache::forget('public_listings_v1');
        }

        $listings = Cache::remember('public_listings_v1', 60, function () {
            return Listing::with(['user:id,name,phone,avatar,city,district,role', 'reviews.user:id,name,avatar'])
                ->where('is_active', true)
                ->orderBy('is_promoted', 'desc')
                ->latest()
                ->get()
                ->map(function ($listing) {
                $reviewsCount = $listing->reviews->count();
                $avgRating = $reviewsCount > 0 ? round($listing->reviews->avg('rating'), 1) : 0.0;
                $avgPricePaid = $reviewsCount > 0 ? round($listing->reviews->avg('price_paid')) : null;
                $gamificationData = $this->getGamificationLevel($listing->reviews);
                $gamificationLevel = $gamificationData['level'];
                $gamificationXp = $gamificationData['xp'];
                $gamificationNextXp = $gamificationData['next_xp'];

                // Check if promotion is actually still active (not expired)
                $isPromotedActive = $listing->is_promoted
                    && ($listing->promoted_until === null || \Carbon\Carbon::parse($listing->promoted_until)->isFuture());

                return [
                    'id'               => $listing->id,
                    'service'          => $listing->service,
                    'sub_services'     => $listing->sub_services ?? [],
                    'title'            => $listing->title,
                    'description'      => $listing->description,
                    'process'          => $listing->process,
                    'cover_image'      => $listing->cover_image
                        ? url('storage/' . $listing->cover_image)
                        : null,
                    'portfolio_images' => collect($listing->portfolio_images ?? [])
                        ->map(fn($p) => url('storage/' . $p))
                        ->toArray(),
                    'price_range'      => $listing->price_range,
                    'experience'       => $listing->experience,
                    'city'             => $listing->city,
                    'district'         => $listing->district,
                    'tags'             => $listing->tags ?? [],
                    'rating'           => $avgRating,
                    'reviewCount'      => $reviewsCount,
                    'avg_price_paid'   => $avgPricePaid,
                    'gamification_level' => $gamificationLevel,
                    'gamification_xp'    => $gamificationXp,
                    'gamification_next_xp' => $gamificationNextXp,
                    'reviews'          => $listing->reviews->map(function($r) use ($listing) {
                        return [
                            'id' => $r->id,
                            'author' => $r->user->name,
                            'avatar' => $r->user->avatar ? url('storage/' . $r->user->avatar) : null,
                            'rating' => $r->rating,
                            'comment' => $r->comment,
                            'price_paid' => $r->price_paid,
                            'images' => collect($r->images ?? [])->map(fn($img) => url('storage/' . $img))->toArray(),
                            'date' => $r->created_at->diffForHumans(),
                            'service' => $listing->service,
                        ];
                    }),
                    'is_promoted'      => $isPromotedActive,
                    'promoted_until'   => $listing->promoted_until,
                    'created_at'       => $listing->created_at,
                    'user'             => [
                        'id'       => $listing->user->id,
                        'name'     => $listing->user->name,
                        'phone'    => $listing->user->phone,
                        'city'     => $listing->user->city,
                        'district' => $listing->user->district,
                        'avatar'   => $listing->user->avatar
                            ? url('storage/' . $listing->user->avatar)
                            : null,
                    ],
                ];
            });
        });

        return response()->json(['success' => true, 'listings' => $listings]);
    }

    /** GET /api/listings/public/{id} — single active listing */
    public function showPublic($id)
    {
        $listing = Listing::with(['user:id,name,phone,avatar,city,district,role', 'reviews.user:id,name,avatar'])
            ->where('is_active', true)
            ->where('id', $id)
            ->first();

        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        $reviewsCount = $listing->reviews->count();
        $avgRating = $reviewsCount > 0 ? round($listing->reviews->avg('rating'), 1) : 0.0;
        $avgPricePaid = $reviewsCount > 0 ? round($listing->reviews->avg('price_paid')) : null;
        $gamificationData = $this->getGamificationLevel($listing->reviews);

        $mapped = [
            'id'               => $listing->id,
            'service'          => $listing->service,
            'sub_services'     => $listing->sub_services ?? [],
            'title'            => $listing->title,
            'description'      => $listing->description,
            'process'          => $listing->process,
            'cover_image'      => $listing->cover_image ? url('storage/' . $listing->cover_image) : null,
            'portfolio_images' => collect($listing->portfolio_images ?? [])->map(fn($p) => url('storage/' . $p))->toArray(),
            'price_range'      => $listing->price_range,
            'experience'       => $listing->experience,
            'city'             => $listing->city,
            'district'         => $listing->district,
            'tags'             => $listing->tags ?? [],
            'rating'           => $avgRating,
            'reviewCount'      => $reviewsCount,
            'avg_price_paid'   => $avgPricePaid,
            'gamification_level' => $gamificationData['level'],
            'gamification_xp'    => $gamificationData['xp'],
            'gamification_next_xp' => $gamificationData['next_xp'],
            'reviews'          => $listing->reviews->map(function($r) use ($listing) {
                return [
                    'id' => $r->id,
                    'author' => $r->user->name,
                    'avatar' => $r->user->avatar ? url('storage/' . $r->user->avatar) : null,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'price_paid' => $r->price_paid,
                    'images' => collect($r->images ?? [])->map(fn($img) => url('storage/' . $img))->toArray(),
                    'date' => $r->created_at->diffForHumans(),
                    'service' => $listing->service,
                ];
            }),
            'is_promoted'      => $listing->is_promoted,
            'created_at'       => $listing->created_at,
            'user'             => [
                'id'       => $listing->user->id,
                'name'     => $listing->user->name,
                'phone'    => $listing->user->phone,
                'city'     => $listing->user->city,
                'district' => $listing->user->district,
                'avatar'   => $listing->user->avatar ? url('storage/' . $listing->user->avatar) : null,
            ],
        ];

        return response()->json(['success' => true, 'listing' => $mapped]);
    }

    /** POST /api/listings */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service'            => 'required|string|max:100',
            'title'              => 'required|string|max:255',
            'description'        => 'required|string',
            'process'            => 'nullable|string',
            'cover_image'        => 'nullable|image|max:5120',
            'portfolio_images.*' => 'nullable|image|max:5120',
            'price_range'        => 'nullable|string|max:100',
            'experience'         => 'nullable|string|max:100',
            'city'               => 'nullable|string|max:100',
            'district'           => 'nullable|string|max:100',
            'tags'               => 'nullable|string', // JSON string from FormData
            'sub_services'       => 'nullable|string', // JSON array of selected sub services
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('listings/covers', 'public');
        }

        $portfolioPaths = [];
        if ($request->hasFile('portfolio_images')) {
            foreach ($request->file('portfolio_images') as $file) {
                $portfolioPaths[] = $file->store('listings/portfolio', 'public');
            }
        }

        $tags = [];
        if ($request->tags) {
            $decoded = json_decode($request->tags, true);
            if (is_array($decoded)) $tags = $decoded;
        }

        $sub_services = [];
        if ($request->sub_services) {
            $decodedSub = json_decode($request->sub_services, true);
            if (is_array($decodedSub)) $sub_services = $decodedSub;
        }

        $listing = Listing::create([
            'user_id'          => $request->user()->id,
            'service'          => $request->service,
            'sub_services'     => $sub_services,
            'title'            => $request->title,
            'description'      => $request->description,
            'process'          => $request->process,
            'cover_image'      => $coverPath,
            'portfolio_images' => $portfolioPaths,
            'price_range'      => $request->price_range,
            'experience'       => $request->experience,
            'city'             => $request->city,
            'district'         => $request->district,
            'tags'             => $tags,
        ]);

        return response()->json(['success' => true, 'listing' => $this->formatListing($listing)], 201);
    }

    /** PUT /api/listings/{id} */
    public function update(Request $request, $id)
    {
        $listing = Listing::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $coverPath = $listing->cover_image;
        if ($request->hasFile('cover_image')) {
            if ($coverPath) Storage::disk('public')->delete($coverPath);
            $coverPath = $request->file('cover_image')->store('listings/covers', 'public');
        }

        // Merge existing portfolio images that were not deleted with any new uploads
        $existing = [];
        if ($request->has('existing_portfolio')) {
            $decoded = json_decode($request->existing_portfolio, true);
            if (is_array($decoded)) {
                $existing = $decoded;
            }
        } else {
            // fallback if parameter not sent (e.g. older api requests)
            $existing = $listing->portfolio_images ?? [];
        }

        $portfolioPaths = $existing;
        if ($request->hasFile('portfolio_images')) {
            foreach ($request->file('portfolio_images') as $file) {
                $portfolioPaths[] = $file->store('listings/portfolio', 'public');
            }
        }

        $tags = $listing->tags ?? [];
        if ($request->tags) {
            $decoded = json_decode($request->tags, true);
            if (is_array($decoded)) $tags = $decoded;
        }

        $sub_services = $listing->sub_services ?? [];
        if ($request->sub_services) {
            $decodedSub = json_decode($request->sub_services, true);
            if (is_array($decodedSub)) $sub_services = $decodedSub;
        }

        $listing->update([
            'service'          => $request->service ?? $listing->service,
            'sub_services'     => $sub_services,
            'title'            => $request->title ?? $listing->title,
            'description'      => $request->description ?? $listing->description,
            'process'          => $request->process ?? $listing->process,
            'cover_image'      => $coverPath,
            'portfolio_images' => $portfolioPaths,
            'price_range'      => $request->price_range ?? $listing->price_range,
            'experience'       => $request->experience ?? $listing->experience,
            'city'             => $request->city ?? $listing->city,
            'district'         => $request->district ?? $listing->district,
            'tags'             => $tags,
        ]);

        return response()->json(['success' => true, 'listing' => $this->formatListing($listing->fresh())]);
    }

    /** DELETE /api/listings/{id} */
    public function destroy(Request $request, $id)
    {
        $listing = Listing::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        if ($listing->cover_image) Storage::disk('public')->delete($listing->cover_image);
        foreach ($listing->portfolio_images ?? [] as $img) {
            Storage::disk('public')->delete($img);
        }

        $listing->delete();
        return response()->json(['success' => true, 'message' => 'İlan silindi.']);
    }

    private function formatListing(Listing $listing): array
    {
        return [
            'id'               => $listing->id,
            'service'          => $listing->service,
            'sub_services'     => $listing->sub_services ?? [],
            'title'            => $listing->title,
            'description'      => $listing->description,
            'process'          => $listing->process,
            'cover_image'      => $listing->cover_image ? url('storage/' . $listing->cover_image) : null,
            'portfolio_images' => collect($listing->portfolio_images ?? [])
                ->map(fn($p) => url('storage/' . $p))->toArray(),
            'price_range'      => $listing->price_range,
            'experience'       => $listing->experience,
            'city'             => $listing->city,
            'district'         => $listing->district,
            'tags'             => $listing->tags ?? [],
            'views'            => $listing->views ?? 0,
            'clicks'           => $listing->clicks ?? 0,
            'message_clicks'   => $listing->message_clicks ?? 0,
            'phone_clicks'     => $listing->phone_clicks ?? 0,
            'is_active'        => $listing->is_active,
            'is_promoted'      => $listing->is_promoted,
            'created_at'       => $listing->created_at,
        ];
    }

    private function getGamificationLevel($reviews) {
        $xp = 0;
        foreach ($reviews as $review) {
            $xp += ($review->rating * 10);
        }

        if ($xp < 250) return ['level' => 'Çırak', 'xp' => $xp, 'next_xp' => 250];
        if ($xp < 1000) return ['level' => 'Kalfa', 'xp' => $xp, 'next_xp' => 1000];
        if ($xp < 2500) return ['level' => 'Usta', 'xp' => $xp, 'next_xp' => 2500];
        return ['level' => 'Efsane Usta', 'xp' => $xp, 'next_xp' => null];
    }

    /** POST /api/listings/{id}/track */
    public function trackAnalytics(Request $request, $id)
    {
        $listing = Listing::find($id);
        if (!$listing) {
            return response()->json(['success' => false, 'message' => 'İlan bulunamadı'], 404);
        }

        $action = $request->input('action'); // 'view', 'click', 'message', 'phone'

        switch ($action) {
            case 'view':
                $listing->increment('views');
                break;
            case 'click':
                $listing->increment('clicks');
                break;
            case 'message':
                $listing->increment('message_clicks');
                break;
            case 'phone':
                $listing->increment('phone_clicks');
                break;
            default:
                return response()->json(['success' => false, 'message' => 'Geçersiz eylem (action)'], 400);
        }

        return response()->json(['success' => true, 'message' => "Takip edildi: {$action}"]);
    }
}
