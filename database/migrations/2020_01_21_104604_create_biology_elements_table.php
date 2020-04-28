<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBiologyElementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('biology_elements', function (Blueprint $table) {
            // table's attributes
            $table->bigInteger('idx')->primary();
            $table->string('name',100)->charset('utf32')->collation('utf32_unicode_ci');
            $table->string("id_source",30);
            $table->string('source',25);
            $table->string('type',25);
            $table->timestamps();

            // indexes
            $table->index(['name','type'], 'name_type_idx');
            $table->index(['type','name'], 'type_name_idx');

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
        Schema::dropIfExists('biology_elements');
    }
}
