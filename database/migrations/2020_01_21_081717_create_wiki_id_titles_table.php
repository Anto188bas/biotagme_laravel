<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWikiIdTitlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wiki_id_titles', function (Blueprint $table) {
            // table's attributes
            $table->unsignedBigInteger('id');
            $table->string('title', 100)->charset('utf32')->collation('utf32_unicode_ci');
            $table->timestamps();

            // primary key
            $table->primary('id');

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
        Schema::dropIfExists('wiki_id_titles');
    }
}
