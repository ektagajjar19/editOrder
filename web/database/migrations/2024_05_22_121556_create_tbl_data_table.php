<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_data', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('store')->nullable()->default(null);
            $table->longText('editorder_css_code')->nullable()->default(null);
            $table->string('order_detail_layout_align')->nullable()->default(null);
            $table->string('order_status_layout_align')->nullable()->default('center');
            $table->boolean('is_exclude')->nullable()->default(1);
            $table->longText('exclude_tag')->nullable()->default(null);
            $table->tinyInteger('is_refund')->nullable(true)->default(0);
            $table->tinyInteger('is_restock')->nullable(true)->default(0);
            $table->integer('time_limit')->unsigned()->nullable()->default(12);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_data');
    }
}
