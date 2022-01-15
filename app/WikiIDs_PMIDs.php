<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WikiIDs_PMIDs extends Model
{
    /**
     *  The model's attributes are all massive assignable because the data will be upload
     *  from a csv file obtained by spark application.
     */
    protected $guarded = [];

    /**
     *  formatted_wiki_id_titles returns a vector having BioTG_id as key and all the wiki_id-title as component of the
     *  vector associated with the considered key
     *
     * @param  array $bio_network
     * @return array
     */
    public static function pmid_associations($bio_network) {
        $nodes     = $bio_network['nodes'];
        $wid1_wid2 = array();
        foreach($bio_network['edges'] as &$edge){
            $wid1s           = $nodes[$edge['idx1']];
            $wid2s           = $nodes[$edge['idx2']];
            $selected_pmids  = [];

            if(array_key_exists("wiki_pages", $wid1s) && array_key_exists("wiki_pages", $wid2s))
                foreach (array_keys($wid1s["wiki_pages"]) as $key1) {
                    if (!array_key_exists($key1, $wid1_wid2))
                        $wid1_wid2[$key1] = array();
                    foreach (array_keys($wid2s["wiki_pages"]) as $key2) {
                        if (!array_key_exists($key2, $wid1_wid2[$key1])) {
                            $tmp = DB::table('wiki_ids_pmids')->where([
                                ['wiki1', '=', $key1],
                                ['wiki2', '=', $key2]
                            ])->select(["pmid"])
                                ->get()->toArray();

                            $pmids = [];
                            if (count($tmp) != 0)
                                foreach ($tmp as $pmid => $object)
                                    array_push($pmids, $object->pmid);

                            $wid1_wid2[$key1][$key2] = $pmids;
                        }
                        $selected_pmids = array_unique(array_merge ($selected_pmids, $wid1_wid2[$key1][$key2]));
                    }
                }
            $edge['pmids'] = $selected_pmids;
        }
        return $bio_network;
    }

}
