<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Jobs\CSVimportJob;
use App\Jobs\ProcessNeoImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CSVimportController extends Controller
{
    /**
     * Import table into mysql table.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function import(Request $request)
    {
        $mysql_paths = explode(",", $request->get('mysql_paths'));
        $neo4j_paths = explode(",", $request->get('neo4j_paths'));


        if(sizeof($mysql_paths) > 1)
            $this->insertIntoMYSQL($mysql_paths);

        if(sizeof($neo4j_paths) > 1)
            $this->insertIntoNeo4j($neo4j_paths);


        return response()->json([
            'response' => "The system is processing the request.."
        ], 200);
    }


    /**
     * save data into the corresponding mysql table.
     *
     * @param array $paths
     * @return void
     */
     private function insertIntoMYSQL($paths)
     {
         $ordered_file = [];
         foreach ($paths as $path){
             $pathFile     =  explode("/",$path);
             $nameFile     =  end($pathFile);
             $nameLower    =  strtolower($nameFile);

             $category_tab = 2;
             if     (strpos($nameLower, 'titles')  !== false)  $category_tab = 0;
             elseif (strpos($nameLower, 'aliases') !== false)  $category_tab = 1;

             $ordered_file[$category_tab] = $path;
         }

         CSVimportJob::dispatch($ordered_file);
     }


    /**
     * import network in neo4j
     *
     * @param array $paths
     * @return void
     */
    private function insertIntoNeo4j(array $paths){
        $path = explode("/", $paths[0]);
        $name = end($path);
        $name = strtolower($name);

        $idx         = strpos($name, 'nodes') !== false ? 0 : 1;
        $path_nodes  = $paths[$idx];
        $path_edges  = $paths[($idx + 1) % 2];

        ProcessNeoImport::dispatch($path_nodes,$path_edges);
    }

}
