<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNetworksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('networks', function (Blueprint $table) {
            // table's attributes
            $table->bigIncrements('id');
            $table->bigInteger('idx1');
            $table->bigInteger('idx2');
            $table->unsignedBigInteger('wid1');
            $table->unsignedBigInteger('wid2');
            $table->double('btg_score');
            $table->bigInteger('str_score');
            $table->timestamps();

            // indexing
            $table->index(['idx1','idx2'], 'idx1_idx2');
            $table->index(['idx2','idx1'], 'idx2_idx1');

            // foreign keys (Is it good set onUpdate at the value on cascade?)
            foreach (['idx1', 'idx2'] as $value)
                $table->foreign($value)
                      ->references('idx')
                      ->on('biology_elements')
                      ->onUpdate('cascade')
                      ->onDelete('cascade');
            foreach (['wid1', 'wid2'] as $value)
                $table->foreign($value)
                      ->references('id')
                      ->on('wiki_id_titles')
                      ->onUpdate('cascade')
                      ->onDelete('cascade');

            // engine
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
        Schema::dropIfExists('networks');
    }
}
