<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Network;
use App\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use \Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhpParser\Node\Expr\Cast\Int_;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    /**
     * Handle an authentication attempt.
     *
     * @param  Request $request
     *
     * @return JsonResponse
     */
    public function authenticate(Request $request){
        $credentials = $request->only('email', 'password');

        //if the credentials match with the date into the db, then a successfully response will be returned
        if(Auth::once($credentials)){
            $token = $this->newApiToken(Auth::id());
            return response()->json(['success' => true, 'api_token' => $token], 200);
        }
        //otherwise a not-authorized response will be generated
        return response()->json(['success' => false], 401);
    }

    /**
     * Create and update the authenticated user's API token.
     *
     * @param  int $ID
     * @return string
     */
    public function newApiToken(int $ID){
        $token = Str::random(80);
        User::setApiToken($ID, $token);        // we can manager with value return.. if 0 there was a problem..
        return $token;
    }
}
