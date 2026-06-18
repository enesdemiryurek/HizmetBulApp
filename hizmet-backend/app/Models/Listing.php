<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service',
        'title',
        'description',
        'process',
        'cover_image',
        'portfolio_images',
        'price_range',
        'experience',
        'city',
        'district',
        'tags',
        'is_active',
        'views',
        'clicks',
        'message_clicks',
        'phone_clicks',
        'is_promoted',
        'promoted_until',
        'sub_services',
    ];

    protected $casts = [
        'portfolio_images' => 'array',
        'tags'             => 'array',
        'sub_services'     => 'array',
        'is_active'        => 'boolean',
        'is_promoted'      => 'boolean',
        'promoted_until'   => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
