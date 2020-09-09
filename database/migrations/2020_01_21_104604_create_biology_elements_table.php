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
            $table->bigIncrements('id');
            $table->string('idx',50);
            $table->string('alias',100)->charset('utf32')->collation('utf32_unicode_ci');
            $table->string('type',25);
            $table->timestamps();

            // indexes
            $table->index('idx','idx_index');
            $table->index(['alias','type'], 'alias_type_idx');
            $table->index(['type','alias'], 'type_alias_idx');

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
