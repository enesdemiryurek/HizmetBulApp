<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UpdateLastSeen
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()) {
            // Sadece son görülme üzerinden 2 dakika geçmişse güncelle (veritabanı yorulmasın)
            if (!$request->user()->last_seen_at || $request->user()->last_seen_at->diffInMinutes(now()) >= 2) {
                $request->user()->update(['last_seen_at' => now()]);
            }
        }
        return $next($request);
    }
}
