<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WikiIdTitle extends Model
{
    /**
     *  The primary key will not be auto-incrementing because the ids value is equal to
     *  Wikipedia ones. To guarantee this condition the incrementing value is set to false.
     */
    public $incrementing = false;

    /**
     *  The model's attributes are all massive assignable because the data will be upload
     *  from a csv file obtained by spark application.
     */
    protected $guarded = [];

    /**
     *  The biology_elements function is defined to implement the many to many relationship
     *  between wiki_id_titles and biology_elements tables.
     */
    public function biology_elements()
    {
       return $this->belongsToMany('App\BiologyElement', 'biology_element_wiki_id_title',
           'wiki_id', 'bioidx_id', 'id', 'idx');
    }

    /**
     *   The wiki_id_titles table has a double OneToMany relationship with the networks one. For this
     *   reason, we need to implement the method get_net_wid1s and get_net_wid2s in order to get the
     *   networks records associated with the considered wid1 or wid2.
     */
     public function get_net_wid1s()
     {
         return $this->hasMany('App\Network', 'wid1');
     }

     public function get_net_wid2s()
     {
         return $this->hasMany('App\Network', 'wid2');
     }

}
