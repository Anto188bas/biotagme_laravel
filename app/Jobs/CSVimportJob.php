<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CSVimportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePaths;
    protected $tablesName;
    protected $tableParams;

    /**
     * Create a new job instance.
     *
     * @param  array $filePaths
     * @return void
     */
    public function __construct($filePaths)
    {
        $this->filePaths         = $filePaths;
        $this->tablesName        = array (
            "wiki_id_titles",
            "biology_elements",
            "biology_element_wiki_id_title",
            "wiki_ids_pmids"
        );
        $this->tableParams       = array (
            "(id,title,@create_at,@update_at)",
            "(idx,alias,type,@create_at,@update_at)",
            "(bioidx_id,wiki_id,@create_at,@update_at)",
            "(pmid,wiki1,wiki2,@create_at,@update_at)"
        );
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // drop all tables rows
        if(count($this->filePaths) > 1) {
            DB::table($this->tablesName[2])->delete();
            DB::table($this->tablesName[0])->delete();
            DB::table($this->tablesName[1])->delete();
        }
        else
            DB::table($this->tablesName[3])->delete();

        // connection to mysql database
        $connection = DB::connection();
        $pdo        = $connection->getPdo();


        for($i=0; $i < count($this->filePaths); $i++){
            // insert
            $idx_vet = count($this->filePaths) == 1 ? 3 : $i;
            $query   = "LOAD DATA LOCAL INFILE '".$this->filePaths[$i]."'
                      INTO TABLE ".$this->tablesName[$idx_vet]."
                      FIELDS TERMINATED BY '\\t'
                      LINES TERMINATED BY '\\n'
                      IGNORE 1 ROWS ".
                      $this->tableParams[$idx_vet].
                      " SET created_at=NOW(), updated_at=NOW()";

            $pdo->exec($query);

            // delete file
            unlink($this->filePaths[$i]);
        }
    }
}
