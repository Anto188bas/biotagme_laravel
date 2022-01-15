<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWikiIDsPMIDsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wiki_ids_pmids', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('wiki1');
            $table->unsignedBigInteger('wiki2');
            $table->unsignedBigInteger('pmid');
            $table->timestamps();

            $table->index('wiki1','wid1_index');
            $table->index('wiki2','wid2_index');

            $table->engine = 'InnoDB';

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wiki_ids_pmids');
    }
}
