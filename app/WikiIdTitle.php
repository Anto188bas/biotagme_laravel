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
       return $this->belongsToMany(
           'App\BiologyElement',
           'biology_element_wiki_id_title',
           'wiki_id',
           'bioidx_id',
           'id',
           'idx'
       );
    }
}
