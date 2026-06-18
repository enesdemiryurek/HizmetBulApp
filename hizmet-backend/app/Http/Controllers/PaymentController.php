<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function simulatePayment(Request $request, $listingId)
    {
        $request->validate([
            'cardNumber' => 'required',
            'expiryDate' => 'required',
            'cvc' => 'required',
            'duration' => 'required|in:1_week,1_month'
        ]);

        $listing = Listing::findOrFail($listingId);

        // Ensure the user owns the listing
        if ($listing->user_id != $request->user()->id) {
            return response()->json(['error' => 'Bu işlemi yapmaya yetkiniz yok.'], 403);
        }

        // Simulate payment delay
        sleep(1);

        // Calculate promotion end date
        $until = now();
        if ($listing->is_promoted && $listing->promoted_until && $listing->promoted_until->isFuture()) {
            $until = clone $listing->promoted_until;
        }

        if ($request->duration === '1_week') {
            $until->addWeek();
        } else {
            $until->addMonth();
        }

        // Update listing
        $listing->update([
            'is_promoted' => true,
            'promoted_until' => $until
        ]);

        Payment::create([
            'user_id' => $request->user()->id,
            'listing_id' => $listingId,
            'amount' => $request->duration === '1_week' ? 299.00 : 899.00,
            'package_name' => $request->duration === '1_week' ? '1 Haftalık Sponsorluk' : '1 Aylık Sponsorluk',
            'status' => 'success'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ödeme başarılı. İlanınız öne çıkarıldı!',
            'promoted_until' => $until->toDateTimeString()
        ]);
    }

    public function userPayments(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->with('listing:id,title')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['payments' => $payments]);
    }

    public function cancelPromotion(Request $request, $listingId)
    {
        $listing = Listing::findOrFail($listingId);

        // Ensure the user owns the listing
        if ($listing->user_id != $request->user()->id) {
            return response()->json(['error' => 'Bu işlemi yapmaya yetkiniz yok.'], 403);
        }

        $listing->update([
            'is_promoted' => false,
            'promoted_until' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sponsorluk iptal edildi.'
        ]);
    }
}
