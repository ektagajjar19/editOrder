<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TblEditedOrders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('edited_orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('orderId')->nullable();
            $table->string('orderName', 100)->nullable();
            $table->string('store')->nullable();
            $table->integer('customerId')->unsigned()->nullable();
            $table->string('customerName')->nullable();
            $table->string('customerEmail')->nullable();
            $table->dateTime('order_edited_at')->nullable();
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
        Schema::dropIfExists('edited_orders');
    }
}
