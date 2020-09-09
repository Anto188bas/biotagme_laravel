<?php

namespace App\Http\Controllers\Network;

use App\BiologyElement;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class NetworksController extends Controller
{
    /**
     * Return the echo network of selected node
     *
     * @param   Request $request
     * @return  JsonResponse
     */
    public function getNetworkElements(Request $request) {
        $names     =  $request->get('names');
        $types     =  $request->get('types');
        $elements  =  $request->get('elements');
        $top_n     =  intval($request->get('top_n'));
        $opt       =  intval($request->get('opt'));

        $results      =  $this->neo4j_curl_connector($names, $types, $elements, $top_n, $opt);
        $network_data =  [];

        if(count($results) != 0)
           $network_data = $this->nodes_edges_creation($results, $opt);

        return response()->json([
            'response' => $network_data
        ], 200);
    }


    /**
     * neo4j_curl_connector sends a HTTP request to Neo4j server so that the echo network of a selected node
     * is returned.
     *
     * @param  string $names
     * @param  string $types
     * @param  array  $elements
     * @param  int    $n
     * @param  int    $opt
     * @return array
     */
    private function neo4j_curl_connector($names, $types, $elements, $n, $opt) {
        $url   = env("NEO_URL", "");
        $query = $this->query_builder($names, $types, $elements, $n, $opt);


        // NOTE: create a laravel process
        $results = [];
        if($url != "" && $query != ""){
            $ch   = curl_init($url);
            $data =  array('statements' => [array('statement' => $query)]);

            $payload = json_encode($data);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $results = json_decode(curl_exec($ch),true);
            $results = $results != null ? $results['results'][0]['data'] : [];
            curl_close($ch);
        }

        return $results;
    }


    /**
     * neo4j_curl_connector sends a HTTP request to Neo4j server so that the echo network of a selected node
     * is returned.
     *
     * @param  string  $names
     * @param  string  $types
     * @param  array   $elements
     * @param  int     $n
     * @param  int     $opt
     * @return string
     */
    private function query_builder($names, $types, $elements, $n, $opt){
        $query = "";
        switch ($opt) {
            case 1:
                $elements4query = [];
                foreach ($elements as $element)
                    $elements4query[] ="'".$element."'";

                $id_element    = BiologyElement::where([
                    ['type',  '=' , $types],
                    ['alias', '=' , strtolower($names)]
                ])->get();

                if(count($id_element) !=0 )
                    $query = "MATCH (n1 {id:'".$id_element[0]['idx']."'})-[r1]->(n2)
                        WHERE labels(n2)[0] IN [".implode(",",$elements4query)."]
                        WITH n1,r1,n2 ORDER BY r1.btg_score DESC, r1.str_score DESC
                        WITH DISTINCT n1,n2 LIMIT ".$n."
                        WITH collect(n1) + collect(n2) as C
                        MATCH (n3)-[r2]->(n4)
                        WHERE n3 in C and n4 in C RETURN n3,labels(n3),r2,n4,labels(n4)";
                break;
            case 2:
                $names_expl = explode("\t", $names);
                $tp1_tp2    = explode("\t", $types);
                $id1_id2    = [];

                foreach (range(0, count($names_expl) - 1) as $i){
                    $id1_id2[$i] = BiologyElement::where([
                        ['type',  '=', $tp1_tp2[$i]],
                        ['alias', '=', strtolower($names_expl[$i])]
                    ])->get();
                }

                if(count($id1_id2[0]) != 0 && count($id1_id2[1]) != 0){
                    $query = "MATCH (n1 {id:'".$id1_id2[0][0]['idx']."'}), (n2 {id:'".$id1_id2[1][0]['idx']."'}),".
                             "p = shortestPath((n1)-[*..10]-(n2)) RETURN p";
                    //hypertyrosinemia
                }
        }
        return $query;
    }

    /**
     * nodes_edges_creation generates an array containing both edges and nodes in Cytoscape format.
     *
     * @param  array   $results
     * @param  int     $opt
     * @return array
     */
     private function nodes_edges_creation($results, $opt){
         $network_data = array();
         switch ($opt){
             case 1:
                 foreach ($results as $row){
                     foreach(array(0,3) as $v){
                         $node_id = $row['row'][$v]['id'];
                         $network_data['nodes'][$node_id]['name'] = $row['row'][$v]['name'];
                         $network_data['nodes'][$node_id]['type'] = $row['row'][$v + 1][0];
                     }
                     $network_data['edges'][] = [
                         'idx1'      => $row['row'][0]['id'],
                         'idx2'      => $row['row'][3]['id'],
                         'btg_score' => $row['row'][2]['btg_score'],
                         'str_score' => $row['row'][2]['str_score']
                     ];
                 }
                 break;
             case 2:
                foreach ($results as $row){
                    $elems = $row['row'][0];
                    for($i=0; $i < count($elems); $i++ ){
                        if($i % 2 == 0){
                           $node_id = $elems[$i]['id'];
                           $type    = explode(":", $node_id)[0];
                           $type    = explode("_", $type)[1];
                           $network_data['nodes'][$node_id]['name'] = $elems[$i]['name'];
                           $network_data['nodes'][$node_id]['type'] = $type;
                        }
                        else{
                            $network_data['edges'][] = [
                                'idx1'      => $elems[$i - 1]['id'],
                                'idx2'      => $elems[$i + 1]['id'],
                                'btg_score' => $elems[$i]['btg_score'],
                                'str_score' => $elems[$i]['str_score']
                            ];
                        }
                    }
                }
                break;
         }
         if(count($network_data) !== 0)
            $network_data['nodes'] = BiologyElement::formatted_wiki_id_titles($network_data['nodes']);

         return $network_data;
     }
}
