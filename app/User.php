<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'api_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * This method will return the user having the specified ID
     *
     * @param int $ID
     * @return User
     */
    protected static function find(int $ID)
    {
        return DB::table('users')->find($ID);

    }

    /**
     *  This function allows to update the users api-token
     *
     *  @param int $ID
     *  @param string $new_token
     *
     */
     public static function setApiToken(int $ID, string $new_token){
         User::all()
             ->where('id', $ID)
             ->first()
             ->update(['api_token' => hash('sha256', $new_token)]);
     }
}
