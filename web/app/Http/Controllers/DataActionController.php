<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Shopify\Auth\Session as AuthSession;
use Illuminate\Support\Facades\Validator;


class DataActionController extends Controller
{
    public function index(Request $request)
    {
        /** @var AuthSession */
        try {
            $session = $request->get('shopifySession');
            $storeid = DB::table('tbl_data')->where('store', $session->getShop())->value('id');
            // Log::info($storeid);
            //     Log::info($request);
                if ($request->formtype == "transaction") {
                    $validator = Validator::make($request->all(), [
                            // Edit Order
                            'successMsgEditOrder' => 'required',
                            'errorMsgEditOrder' => 'required',
                            'EditOrderBtnTitle' => 'required',
                            'EditOrderBtnBgColor' => 'required',
                            'EditOrderBtnTextColor' => 'required',
                            'EditOrderpopupTitle' => 'required',
                            'EditOrderpopupButton' => 'required',
                            'EditOrderpopupTitleColor' => 'required',
                            'EditOrderpopupBgColor' => 'required',
                            'EditOrderpopupBtnColor' => 'required',
                            'EditOrderpopupBorderColor' => 'required',
                            'EditOrderLayoutAlignment' => 'required',

                            // Edit Address
                            'successMsgEditAddress' => 'required',
                            'errorMsgEditAddress' => 'required',
                            'EditAddressBtnTitle' => 'required',
                            'EditAddressBtnBgColor' => 'required',
                            'EditAddressBtnTextColor' => 'required',
                            'EditAddresspopupTitle' => 'required',
                            'EditAddresspopupButton' => 'required',
                            'EditAddresspopupTitleColor' => 'required',
                            'EditAddresspopupBgColor' => 'required',
                            'EditAddresspopupBtnColor' => 'required',
                            'EditAddresspopupBorderColor' => 'required',
                            'EditAddressLayoutAlignment' => 'required',

                            // Add Items
                            'successMsgAddItems' => 'required',
                            'errorMsgAddItems' => 'required',
                            'AddItemsBtnTitle' => 'required',
                            'AddItemsBtnBgColor' => 'required',
                            'AddItemsBtnTextColor' => 'required',
                    ]);
                    if ($validator->fails()) {
                        return response()->json(['errors' => $validator->errors()->all()]);
                    }

                    DB::table('tbl_edit_order_details')->where('store_id', $storeid)->update([
                        'eo_success_msg' =>  $request->successMsgEditOrder,
                        'eo_error_msg' =>  $request->errorMsgEditOrder,
                        'eo_btn_title' =>  $request->EditOrderBtnTitle,
                        'eo_btn_bgcolor' =>  $request->EditOrderBtnBgColor,
                        'eo_btn_textcolor' =>  $request->EditOrderBtnTextColor,
                        'eo_popup_title' =>  $request->EditOrderpopupTitle,
                        'eo_popup_btn_title' =>  $request->EditOrderpopupButton,
                        'eo_popup_title_color' =>  $request->EditOrderpopupTitleColor,
                        'eo_popup_bg_color' =>  $request->EditOrderpopupBgColor,
                        'eo_popup_btn_color' =>  $request->EditOrderpopupBtnColor,
                        'eo_popup_border_color' =>  $request->EditOrderpopupBorderColor,
                        'eo_layout_alignment' =>  $request->EditOrderLayoutAlignment,
                        'updated_at' => now()
                    ]);
                    DB::table('tbl_edit_address_details')->where('store_id', $storeid)->update([
                        'ea_success_msg' =>  $request->successMsgEditAddress,
                        'ea_error_msg' =>  $request->errorMsgEditAddress,
                        'ea_btn_title' =>  $request->EditAddressBtnTitle,
                        'ea_btn_bgcolor' =>  $request->EditAddressBtnBgColor,
                        'ea_btn_textcolor' =>  $request->EditAddressBtnTextColor,
                        'ea_popup_title' =>  $request->EditAddresspopupTitle,
                        'ea_popup_btn_title' =>  $request->EditAddresspopupButton,
                        'ea_popup_title_color' =>  $request->EditAddresspopupTitleColor,
                        'ea_popup_bg_color' =>  $request->EditAddresspopupBgColor,
                        'ea_popup_btn_color' =>  $request->EditAddresspopupBtnColor,
                        'ea_popup_border_color' =>  $request->EditAddresspopupBorderColor,
                        'ea_layout_alignment' =>  $request->EditAddressLayoutAlignment,
                        'updated_at' => now()
                    ]);
                    DB::table('tbl_add_items')->where('store_id', $storeid)->update([
                        'ai_success_msg' =>  $request->successMsgAddItems,
                        'ai_error_msg' =>  $request->errorMsgAddItems,
                        'ai_btn_title' =>  $request->AddItemsBtnTitle,
                        'ai_btn_bgcolor' =>  $request->AddItemsBtnBgColor,
                        'ai_btn_textcolor' =>  $request->AddItemsBtnTextColor,
                        'updated_at' => now()
                    ]);
                }
                else if($request->formtype == "settings"){
                    $validator = Validator::make($request->all(), [
                        'orderDetailLayoutAlignment' => 'required',
                        'EditOrderBtnVisibility'  => 'required',
                        'EditAddressBtnVisibility' => 'required',
                        'AddItemBtnVisibility' => 'required',
                        'orderDetailCheckoutLayoutAlignment' => 'required',
                        'OSEditOrderBtnVisibility' => 'required',
                        'OSEditAddressBtnVisibility' => 'required',
                        'OSAddItemBtnVisibility' => 'required',
                        'ExcludeTag' => 'required_if:checked,true',
                        'timeLimit' => 'required',
                        'isRefund' => 'required',
                        'isRestock' => 'required',
                    ]);
                    if ($validator->fails()) {
                        return response()->json(['errors' => $validator->errors()->all()]);
                    }
                    if($request->checked){
                        $excludeTag = $request->ExcludeTag;
                    }
                    else
                        $excludeTag = null;
                    DB::table('tbl_data')->where('id', $storeid)->update([
                        'order_detail_layout_align' =>$request->orderDetailLayoutAlignment,
                        'order_status_layout_align'=>$request->orderDetailCheckoutLayoutAlignment,
                        'exclude_tag'=> $excludeTag,
                        'is_refund'=>$request->isRefund,
                        'is_restock'=>$request->isRestock,
                        'time_limit'=>$request->timeLimit,
                        'editorder_css_code'=>$request->EditOrderCssCode,
                        'is_exclude'=>$request->checked,
                        'updated_at' => now()
                    ]);
                    DB::table('tbl_edit_address_details')->where('store_id', $storeid)->update([
                        'activate_at_order_details'=>$request->EditAddressBtnVisibility,
                        'activate_at_order_status'=>$request->OSEditAddressBtnVisibility,
                        'updated_at' => now()
                    ]);
                    DB::table('tbl_edit_order_details')->where('store_id', $storeid)->update([
                        'activate_at_order_details'=>$request->EditOrderBtnVisibility,
                        'activate_at_order_status'=>$request->OSEditOrderBtnVisibility,
                        'updated_at' => now()
                    ]);
                    DB::table('tbl_add_items')->where('store_id', $storeid)->update([
                        'activate_at_order_details'=>$request->AddItemBtnVisibility,
                        'activate_at_order_status'=>$request->OSAddItemBtnVisibility,
                        'updated_at' => now()
                    ]);
                }
        } catch (\Exception $errors) {
            return response()->json(['error_message' => $errors->getMessage()], 401);
        }
        return response()->json(['success' => 'success'], 200);
    }

    public function getdata(Request $request)
    {
        if ($request->isMethod('post')) {
            // Log::info('POST request received', ['request' => $request->all()]);
            $store = $request['shop_name'];
        } else {
            /** @var AuthSession */
            $session = $request->get('shopifySession');
            // Log::info('GET request received with Shopify session', ['session' => $session]);
            $store = $session->getShop();
        }
        $gettblToken = DB::table('tbl_data')->where('store', $store)->first();
        // Log::info('Data fetched:', ['data' => $gettblToken]);
        return response()->json($gettblToken);
    }

    public function getDefaultDataEditOrder(Request $request)
    {   
        if ($request->isMethod('post')) {
            // Log::info('POST request received', ['request' => $request->all()]);
            $store = $request['shop_name'];
        } else {
            /** @var AuthSession */
            $session = $request->get('shopifySession');
            // Log::info('GET request received with Shopify session', ['session' => $session]);
            $store = $session->getShop();
        }
         /** @var AuthSession */
        // $session = $request->get('shopifySession');
        $gettblToken = DB::table('tbl_data')
                        ->join('tbl_edit_order_details', 'tbl_data.id', '=', 'tbl_edit_order_details.store_id')
                        ->select('tbl_data.id', 'tbl_data.store', 'tbl_edit_order_details.*')
                        ->where('tbl_data.store', $store)
                        ->first();
        // Log::info(json_encode($gettblToken));
        // Log::info('Edit order data fetched:', ['data' => $gettblToken]);
        return response()->json($gettblToken);
    }
    public function getDefaultDataEditAddress(Request $request)
    {
        if ($request->isMethod('post')) {
            // Log::info('POST request received', ['request' => $request->all()]);
            $store = $request['shop_name'];
        } else {
            /** @var AuthSession */
            $session = $request->get('shopifySession');
            // Log::info('GET request received with Shopify session', ['session' => $session]);
            $store = $session->getShop();
        }
        $gettblToken = DB::table('tbl_data')
                        ->join('tbl_edit_address_details', 'tbl_data.id', '=', 'tbl_edit_address_details.store_id')
                        ->select('tbl_data.id', 'tbl_data.store', 'tbl_edit_address_details.*')
                        ->where('tbl_data.store', $store)
                        ->first();
        // Log::info('Edit Address data fetched:', ['data' => $gettblToken]);
        // Log::info(json_encode($gettblToken));
        return response()->json($gettblToken);
    }
    public function getDefaultDataAddItems(Request $request)
    {
        if ($request->isMethod('post')) {
            $store = $request['shop_name'];
        } else {
            /** @var AuthSession */
            $session = $request->get('shopifySession');
            $store = $session->getShop();
        }
        $gettblToken = DB::table('tbl_data')
                        ->join('tbl_add_items', 'tbl_data.id', '=', 'tbl_add_items.store_id')
                        ->select('tbl_data.id', 'tbl_data.store', 'tbl_add_items.*')
                        ->where('tbl_data.store', $store)
                        ->first();
        return response()->json($gettblToken);
    }
}
