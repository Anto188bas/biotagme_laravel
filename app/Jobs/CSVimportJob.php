<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CSVimportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePath;
    protected $tablesName;
    protected $tableParams;
    protected $tableParamCursor;

    /**
     * Create a new job instance.
     *
     * @param  string $filePath
     * @param  int    $tableParamsCursor
     * @return void
     */
    public function __construct($filePath, $tableParamsCursor)
    {
        $this->filePath    = $filePath;
        $this->tablesName  = explode(',', env('DB_TABLES'));
        $this->tableParamCursor = $tableParamsCursor;
        $this->tableParams = array(
            "(id,title,@create_at,@update_at)",
            "(name,id_source,source,type,@dummy,idx,@create_at,@update_at)",
            "(@dummy,@dummy,@dummy,@dummy,wiki_id,bioidx_id,@create_at,@update_at)",
            "(idx1,idx2,wid1,wid2,btg_score,str_score,@create_at,@update_at)");
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // connection to mysql database
        $connection = DB::connection();
        $pdo        = $connection->getPdo();

        // table selection
        if($this->tableParamCursor == 1){
            $tables     = array_slice($this->tablesName, 0, 1);
            $parameters = array_slice($this->tableParams, 0, 1);
        }
        elseif ($this->tableParamCursor == 2){
            $tables     = array_slice($this->tablesName, 1, 2);
            $parameters = array_slice($this->tableParams, 1, 2);
        }
        else{
            $tables     = array_slice($this->tablesName, -1, 1);
            $parameters = array_slice($this->tableParams, -1, 1);
        }

        // insert
        for ($i = 0; $i < sizeof($tables); $i++) {
            $query = "LOAD DATA LOCAL INFILE '".$this->filePath."'
                      INTO TABLE ".$tables[$i]."
                      FIELDS TERMINATED BY '\\t'
                      LINES TERMINATED BY '\\n'
                      IGNORE 1 ROWS ".
                      $parameters[$i].
                      " SET created_at=NOW(), updated_at=NOW()";

            $pdo->exec($query);
        }
    }
}
