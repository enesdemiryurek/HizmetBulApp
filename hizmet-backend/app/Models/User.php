<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Notifications\ResetPassword;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'gender',
        'services',
        'password',
        'avatar',
        'city',
        'district',
        'address',
        'website',
        'bio',
        'last_seen_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'services'          => 'array',
        'last_seen_at'      => 'datetime',
    ];

    public function listings()
    {
        return $this->hasMany(\App\Models\Listing::class);
    }

    public function reviewsAsProvider()
    {
        return $this->hasMany(Review::class, 'provider_id');
    }

    public function reviewsAsClient()
    {
        return $this->hasMany(Review::class, 'user_id');
    }

    public function conversations()
    {
        return Conversation::where('user_one_id', $this->id)
            ->orWhere('user_two_id', $this->id);
    }

    public function sendPasswordResetNotification($token)
    {
        $url = 'http://localhost:3000/sifremi-sifirla?token=' . $token . '&email=' . urlencode($this->email);
        
        $this->notify(new ResetPassword($url));
    }
}
