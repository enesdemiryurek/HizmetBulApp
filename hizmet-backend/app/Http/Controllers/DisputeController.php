<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dispute;

class DisputeController extends Controller
{
    public function index(Request $request)
    {
        // For security, you would typically check if user is an admin here
        // if ($request->user()->role !== 'admin') return abort(403);
        
        $disputes = Dispute::with(['customer', 'provider'])->orderBy('created_at', 'desc')->get();
            
        return response()->json(['disputes' => $disputes]);
    }

    public function resolve(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:resolved_customer,resolved_provider',
        ]);
        
        $dispute = Dispute::findOrFail($id);
        $dispute->status = $request->status;
        $dispute->save();
            
        return response()->json(['message' => 'Anlaşmazlık durumu güncellendi', 'dispute' => $dispute]);
    }
}
