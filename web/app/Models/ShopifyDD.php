<?php

declare(strict_types=1);

namespace App\Models;

use Shopify\Auth\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ShopifyDD
{
    public static function getAccessToken($shop)
    {
        return DB::table('sessions')->where('shop', $shop)->value('access_token');
    }
    public static function defaultData(Session $session){
        // Log::info(json_encode($session));
        $tblExist = DB::table('tbl_data')->where('store',trim($session->getShop()))->first();
        $array = array(
            'store' => trim($session->getShop()),
            'order_detail_layout_align' => 'center',
            'exclude_tag' => 'Exclude',
            'time_limit' => 12,
            'updated_at' => now()
        );
        if($tblExist){
            DB::table('tbl_data')->where('id', $tblExist->id)->update($array);
            $storeId = $tblExist->id;
        }
        else{
            $array['created_at'] = now();
            $storeId = DB::table('tbl_data')->insertGetId($array);
        }

        // Check if the corresponding tbl_edit_order_details record exists
        $editOrderDetailExist = DB::table('tbl_edit_order_details')->where('store_id', $storeId)->first();

        $editOrderDetailArray = [
            'store_id' => $storeId,
            'eo_success_msg' => 'Order Edited successfully !!',
            'eo_error_msg' => 'Something went wrong. Please try again or Contact us for help',
            'eo_btn_title' => 'Edit Order',
            'eo_btn_bgcolor' => '#000000',
            'eo_btn_textcolor' => '#FFFFFF',
            'eo_popup_title' => 'Update Order',
            'eo_popup_btn_title' => 'Edit Order',
            'eo_popup_bg_color' => '#FFFFFF',
            'eo_popup_title_color' => '#000000',
            'eo_popup_btn_color' => '#FF0000',
            'eo_popup_border_color' => '#00FF00',
            'eo_layout_alignment' => 'center',
            'activate_at_order_details' => true,
            'activate_at_order_status' => true,
            'updated_at' => now()
        ];

        if ($editOrderDetailExist) {
            DB::table('tbl_edit_order_details')->where('id', $editOrderDetailExist->id)->update($editOrderDetailArray);
        } else {
            $editOrderDetailArray['created_at'] = now();
            DB::table('tbl_edit_order_details')->insert($editOrderDetailArray);
        }

        // Check if the corresponding tbl_edit_address_details record exists
        $editAddressDetailExist = DB::table('tbl_edit_address_details')->where('store_id', $storeId)->first();

        $editAddressDetailArray = [
            'store_id' => $storeId,
            'ea_success_msg' => 'Address Edited successfully !!',
            'ea_error_msg' => 'Something went wrong. Please try again or Contact us for help',
            'ea_btn_title' => 'Edit Address',
            'ea_btn_bgcolor' => '#000000',
            'ea_btn_textcolor' => '#FFFFFF',
            'ea_popup_title' => 'Update Order',
            'ea_popup_bg_color' => '#FFFFFF',
            'ea_popup_btn_title' => 'Edit Order',
            'ea_popup_btn_color' => '#FFFFFF',
            'ea_popup_title_color' => '#000000',
            'ea_popup_btn_color' => '#FF0000',
            'ea_popup_border_color' => '#00FF00',
            'ea_layout_alignment' => 'center',
            'activate_at_order_details' => true,
            'activate_at_order_status' => true,
            'updated_at' => now()
        ];

        if ($editAddressDetailExist) {
            DB::table('tbl_edit_address_details')->where('id', $editAddressDetailExist->id)->update($editAddressDetailArray);
        } else {
            $editAddressDetailArray['created_at'] = now();
            DB::table('tbl_edit_address_details')->insert($editAddressDetailArray);
        }

        // Check if the corresponding tbl_add_items record exists
        $addItemsArrayExist = DB::table('tbl_add_items')->where('store_id', $storeId)->first();

        $addItemsArray = [
            'store_id' => $storeId,
            'ai_success_msg' => 'Item Added successfully !!',
            'ai_error_msg' => 'Something went wrong. Please try again or Contact us for help',
            'ai_btn_title' => 'Add Item',
            'ai_btn_bgcolor' => '#000000',
            'ai_btn_textcolor' => '#FFFFFF',
            'ai_layout_alignment' => 'center',
            'activate_at_order_details' => true,
            'activate_at_order_status' => true,
            'updated_at' => now()
        ];

        if ($addItemsArrayExist) {
            DB::table('tbl_add_items')->where('id', $addItemsArrayExist->id)->update($addItemsArray);
        } else {
            $addItemsArray['created_at'] = now();
            DB::table('tbl_add_items')->insert($addItemsArray);
        }
    }
}
