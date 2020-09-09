<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BiologyElement extends Model
{
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
        return $this->belongsToMany(
            'App\WikiIdTitle',
            'biology_element_wiki_id_title',
            'bioidx_id',
            'wiki_id',
            'idx',
            'id'
        );
    }

    /**
     *  formatted_wiki_id_titles returns a vector having BioTG_id as key and all the wiki_id-title as component of the
     *  vector associated with the considered key
     *
     * @param  array $bio_ids
     * @return array
     */
    public static function formatted_wiki_id_titles($bio_ids){
        $associations =  BiologyElement::whereIn('idx',array_keys($bio_ids))
            ->select('idx')
            ->with('wiki_id_titles:id,title')
            ->get();

        foreach ($associations as $association){
            foreach($association['wiki_id_titles'] as $wiki_page)
                $bio_ids[$association['idx']]['wiki_pages'][$wiki_page['id']] = $wiki_page['title'];
        }

        return $bio_ids;
    }
}
