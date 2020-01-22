<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class BiologyElementWikiIdTitle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('biology_element_wiki_id_title', function (Blueprint $table) {
            // table's attributes
            $table->unsignedBigInteger('wiki_id');
            $table->string('bioidx_id');
            $table->timestamps();

            // NOTA: primary key da settare.....

            // foreign keys
            $table->foreign('wiki_id')
               ->references('id')
               ->on('wiki_id_titles')
               ->onDelete('cascade');
            $table->foreign('bioidx_id')
               ->references('idx')
               ->on('biology_elements')
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
        Schema::dropIfExists('biology_element_wiki_id_title');
    }
}
