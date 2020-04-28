<?php

namespace App\Http\Controllers\Network;

use App\BiologyElement;
use App\Http\Controllers\Controller;
use App\Network;
use App\WikiIdTitle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NetworksController extends Controller
{
    /**
     * Import table into mysql table.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getNetworkElements(Request $request) {
        $names = $request->get('names');
        $top_n = intval($request->get('top_n'));
        $elements = $request->get('elements');
        // add a for that iterates over each name.

        $components = BiologyElement::where('name', $names[0])
            ->whereIn('type', $elements)->get();
        for ($i=0; $i < count($components); $i++){
            $component = $components[$i];
            $networks  = $this->top_n($component, $top_n);
            $component['subnetwork'] = $networks;
            //$component['wikipage'] = $this->getWikiList($networks);
            $component['linkedComps'] = $this->getLinkedComponents($networks);
            $components[$i] = $component;
        }

        return response()->json([
            'response' => $components
        ], 200);
    }

    /**
     * Group elements having same idx1 and idx2
     *
     * @param BiologyElement $component
     * @param int $n
     * @return array
     */
    private function top_n($component, $n){
        $v1      = 0;
        $v2      = 0;
        $count   = 0;
        $sub_net = array();

        $network  = Network::where('idx1', $component['idx'])
            ->orderBy('btg_score', 'desc')
            ->orderBy('str_score', 'desc')
            ->get();

        foreach ($network as $element){
            if($count <= $n){
                if($v2 !== $element['idx2'] || $v1 !== $element['idx1']){
                    $v2 = $element['idx2'];
                    $v1 = $element['idx1'];
                    $count++;
                }
                $sub_net[] = $element;
            }
            else
                break;
        }

        return $sub_net;
    }


    /**
     * Return the wiki id of all linked elements.
     *
     * @param array $network
     * @return array
     */
    private function getWikiList($network){
        $wiki_title_ls = array();

        foreach ($network as $relationship){
            if(!array_key_exists($relationship['wid1'], $wiki_title_ls)) {
                $tmp = $relationship
                    ->get_wid1_page()
                    ->first();
                $tmp['type'] = 'wid1';
                $wiki_title_ls[$relationship['wid1']] = $tmp;
            }
            if(!array_key_exists($relationship['wid2'], $wiki_title_ls)) {
                $tmp = $relationship
                    ->get_wid2_page()
                    ->first();
                $tmp['type'] = 'wid2';
                $wiki_title_ls[$relationship['wid2']] = $tmp;
            }
        }

        return $wiki_title_ls;
    }


    /**
     * Return the linked components of the selected one.
     *
     * @param array $network
     * @return array
     */
    private function getLinkedComponents($network){
        $linked_components = array();

        foreach ($network as $relationship){
            if(!array_key_exists($relationship['idx2'], $linked_components))
                $linked_components[$relationship['idx2']] = $relationship
                    ->get_idx2_bioelem()
                    ->first();
        }

        return $linked_components;
    }
}
