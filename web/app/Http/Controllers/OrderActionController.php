<?php

namespace App\Http\Controllers;

use App\Models\OrderAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderActionController extends Controller
{
    protected $_validator;
    protected $_orderaction;
    protected $_commonErrorMessage;
    protected $_commonEditSuccessOrderMessage;

    public function __construct(){
        $this->_validator = new Validator();
        $this->_orderaction = new OrderAction();
        $this->_commonErrorMessage = "Sorry, Something went wrong. Please try again or contact us for help.";
        $this->_commonEditSuccessOrderMessage = "Order Edited successfully.";
    }

    function getdata(Request $request){
        try{
            $validator =$this-> _validator::make($request->all(),[
                'shop' => 'required'
            ]);
            if($validator->fails()){
                return response()->json(['error_message' => $validator->errors()->all()], 200);
            }
            $data = $this->_orderaction->getData($request->shop);
            if($data){
                return response()->json(['status' => true, 'data' => $_data], 200);
            }
            return response()->json(['status' => false, 'message' => $this->_commonErrorMessage ], 200);
        }
        catch(\Exception $errors){
            return response()->json(['status' => false, 'message' => $this->_commonErrorMessage ], 200);
        }
    }

    public function updateOrderShippingAddress(Request $request) {
        try {
            $validator = $this->_validator::make($request->all(), [
                'orderId' => 'required',
                'shop_name' => 'required',
                'address1' => 'required',
                'address2' => 'required',
                'city' => 'required',
                'pincode' => 'required',
                'phone' => 'nullable',
                'state' => 'required',
                'country' => 'required',
            ]);
            
            if ($validator->fails()) {
                return response()->json(['error_message' => $validator->errors()->all()], 400);
            }
            
            $orderStatus = $this->_orderaction->editAddressMutation(
                $request->orderId,
                $request->shop_name,
                $request->address1,
                $request->address2,
                $request->city,
                $request->pincode,
                $request->phone,
                $request->state,
                $request->country
            );
            
            if ($orderStatus['success']) {
                return response()->json(['status' => true, 'data' => $orderStatus['order'], 'message' => $this->_commonEditSuccessOrderMessage], 200);
            } else {
                $errorMessages = array_map(function($error) {
                    return $error['message'];
            }, $orderStatus['errors']);
             return response()->json(['status' => false, 'errors' => $errorMessages, 'message' => $this->_commonErrorMessage], 500);
            }    
        } catch (\Exception $error) {
            Log::error("Error updating order shipping address: " . $error->getMessage());
            return response()->json(['status' => false, 'message' => $this->_commonErrorMessage], 500);
        }
    }
    
    public function getorderstatus(Request $request){
        try{
            $validator = $this->_validator::make($request->all(),[
                'orderId' => 'required',
                'shop_name' => 'required'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['error_message' => $validator->errors()->all()], 200);
            }
    
            $orderstatus = $this->_orderaction->getOrderStatus($request->orderId, $request->shop_name);
            if($orderstatus){
                return response()->json(['status' => true, 'data' => $orderstatus], 200);
            }
            return response()->json(['status' => false, 'message' => $this->_commonErrorMessage], 200);
        }catch(\Exception $errors){
            return response()->json(['status' => false, 'Error-message' => $this->_commonErrorMessage], 200);
        }
    }

    public function updateOrder(Request $request) {
        Log::info($request->all());
        try {
            $validator = Validator::make($request->all(), [
                'orderId' => 'required',
                'shopName' => 'required',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['error_message' => $validator->errors()->all()], 400);
            }
            $orderUpdate = $this->_orderaction->updateOrder(
                $request->orderId,
                $request->shopName
            );
            if ($orderUpdate) {
                return response()->json(['status' => true, 'data' => $orderUpdate, 'message' => $this->_commonEditSuccessOrderMessage], 200);
            }
            return response()->json(['status' => false, 'message' => $this->_commonEditSuccessOrderMessage], 500);
        } catch (\Exception $error) {
            Log::error("Error updating order: " . $error->getMessage());
            return response()->json(['status' => false, 'message' => $this->_commonErrorMessage], 500);
        }
    }
}

