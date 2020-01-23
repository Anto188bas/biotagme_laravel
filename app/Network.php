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

    /**
     *  Since there are two oneToMany relationships between networks and wiki_id_titles
     *  table, we need to define the corresponding belongTo functions.
     *  The first one return the title of the Wikipedia page which id is equal to wid1
     *  The second one instead return the Wikipedia page title which id is equal to wid2.
     */
    public function get_wid1_page()
    {
        return $this->belongsTo('App\WikiIdTitle', 'wid1');
    }
    public function get_wid2_page()
    {
        return $this->belongsTo('App\WikiIdTitle', 'wid2');
    }

    /**
     *  Since there are two oneToMany relationships between networks and biology_elements
     *  table, we need to define the corresponding belongTo functions.
     *  The first one return the biology element information which id is equal to idx1
     *  The second one, instead, return the biology element information which id is equal to
     *  idx2.
     */
    public function get_idx1_bioelem()
    {
        return $this->belongsTo('App\BiologyElement', 'idx1');
    }
    public function get_idx2_bioelem()
    {
        return $this->belongsTo('App\BiologyElement', 'idx2');
    }
}
