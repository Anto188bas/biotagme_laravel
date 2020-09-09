<?php

namespace App\Jobs;

use http\Env;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class ProcessNeoImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * @var Process
     */
    protected $process;

    /**
     * Create a new job instance.
     *
     * @param string $path_nodes
     * @param string $path_edges
     * @return void
     */
    public function __construct($path_nodes, $path_edges)
    {
        $bash_file = env("NEO_BASH_ADMIN", "/home/vagrant/data/neo4j_net_import.sh");
        $neo_path  = env("NEO_PATH",       "/home/vagrant/neo4j");
        $neo_passw = env("NEO_PASSWOR",    "biotagme");

        $this->process = new Process(
            [
                $bash_file,
                $neo_path,
                $path_nodes,
                $path_edges,
                $neo_passw
            ]
        );
        $this->process->setTimeout(1200);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->process->run();

        if (!$this->process->isSuccessful()) {
            throw new ProcessFailedException($this->process);
        }
        else
            Log::Info($this->process->getOutput());
    }
}
