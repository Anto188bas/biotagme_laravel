<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Network extends Model
{
    /**
     *  The model's attributes are all massive assignable because the data will be upload
     *  from a csv file obtained by spark application.
     */
    protected $guarded = [];
}
