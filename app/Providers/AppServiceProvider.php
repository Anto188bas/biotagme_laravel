<?php

namespace App\Providers;

use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Queue::after(function (JobProcessed $event){
            Redis::publish('import', json_encode(['event' => 'CSVimportEvent', 'data' => $event->job->payload()]));
        });

        Queue::failing(function (JobFailed $event){
            Redis::publish('import', json_encode(['event' => 'CSVimportEvent', 'data' => $event->job->payload()]));
        });
    }
}
