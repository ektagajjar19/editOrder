<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TblEditAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_edit_address_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('store_id');
            $table->string('ea_success_msg')->nullable()->default(null);
            $table->string('ea_error_msg')->nullable()->default(null);
            $table->string('ea_btn_title')->nullable()->default(null);
            $table->string('ea_btn_bgcolor')->nullable()->default(null);
            $table->string('ea_btn_textcolor')->nullable()->default(null);
            $table->string('ea_popup_title')->nullable()->default(null);
            $table->string('ea_popup_btn_title')->nullable()->default(null);
            $table->string('ea_popup_bg_color')->nullable()->default(null);
            $table->string('ea_popup_title_color')->nullable()->default(null);
            $table->string('ea_popup_btn_color')->nullable()->default(null);
            $table->string('ea_popup_border_color')->nullable()->default(null);
            $table->string('ea_layout_alignment')->nullable()->default(null);
            $table->boolean('activate_at_order_details')->nullable();
            $table->boolean('activate_at_order_status')->nullable();
            $table->timestamps();
            $table->foreign('store_id')->references('id')->on('tbl_data')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_edit_address_details');
    }
}
