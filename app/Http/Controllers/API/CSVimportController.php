<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Jobs\CSVimportJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $path   = $request->get('path');
        $this->insertIntoTable($path);

        return response()->json([
               'response' => "The system is processing the request.. you will receive a notification when the table has
                              been imported"
        ], 200);
    }


    /**
     * save data into the corresponding table.
     *
     * @param string $path
     * @return void
     */
     private function insertIntoTable(string $path)
     {

         // get the name of the file
         $components = explode("/",$path);
         $nameFile   = end($components);
         $nameLower  = strtolower($nameFile);

         // 1. during this phase, the name of the table will be selected
         if(strpos($nameLower, 'wikiid') !== false)
         {
             $category_tab = 1;
         }
         elseif (strpos($nameLower, 'indexing') !== false)
         {
             $category_tab = 2;
         }
         else
         {
             $category_tab = 3;
         }

         CSVimportJob::dispatch($path, $category_tab);
     }

    // CREARE FUNZIONE CHE DELETE IL CONTENUTO DELLE TABELLE.. GIA' IN ENV SONO STATE SPECIFICATE.. RICHIAMARE CON
    // env(key)
}
