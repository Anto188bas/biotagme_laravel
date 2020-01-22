<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BiologyElement extends Model
{
    /**
     *  The primary key is not auto-incrementing because the ids value will be imported
     *  by the corresponding csv file. To guarantee this condition the $incrementing value
     *  is set to false. Another thing to do is set the name of the primary key column to
     *  "idx", otherwise the model will look for the id column.
     */
    public $incrementing  = false;
    protected $primaryKey = 'idx';

    /**
     *  The model's attributes are all massive assignable because the data will be upload
     *  from a csv file obtained by spark application.
     */
    protected $guarded = [];

    /**
     *  The wiki_id_titles function is defined to implement the many to many relationship
     *  between wiki_id_titles and biology_elements tables.
     */
    public function wiki_id_titles()
    {
        return $this->belongsToMany('App\WikiIdTitle', 'biology_element_wiki_id_title',
            'bioidx_id', 'wiki_id', 'idx', 'id');
    }
}
