<?php

namespace App\Models;

use Carbon\Carbon;
use Shopify\Clients\Graphql;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Facade\FlareClient\Http\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderAction extends Model
{
    use HasFactory;
    protected $_access_token;
    public function getData($shop)
    {
        $orderId = $request->input('orderId');
        $shop = $request->input('shop');

        $commonData = DB::table('tbl_data')->where('store', $shop)->first();
        $editOrderDetails = DB::table('tbl_data')
            ->join('tbl_edit_order_details', 'tbl_data.id', '=', 'tbl_edit_order_details.store_id')
            ->select('tbl_data.id', 'tbl_data.store', 'tbl_edit_order_details.*')
            ->where('tbl_data.store', $shop)
            ->first();
        $editAddressDetails = DB::table('tbl_data')
            ->join('tbl_edit_address_details', 'tbl_data.id', '=', 'tbl_edit_address_details.store_id')
            ->select('tbl_data.id', 'tbl_data.store', 'tbl_edit_address_details.*')
            ->where('tbl_data.store', $shop)
            ->first();
        $addItems = DB::table('tbl_data')
            ->join('tbl_add_items', 'tbl_data.id', '=', 'tbl_add_items.store_id')
            ->select('tbl_data.id', 'tbl_data.store', 'tbl_add_items.*')
            ->where('tbl_data.store', $shop)
            ->first();

        if (!$commonData) {
            return response()->json([
                'status' => false,
                'message' => 'No data found for the given shop.'
            ]);
        }
        return response()->json([
            'status' => true,
            'exclude_tag' => $commonData->exclude_tag,
            'time_limit' => $commonData->time_limit,
            'store' => $commonData->store,
            'order_detail_layout_align' => $commonData->order_detail_layout_align,
            'order_status_layout_align' => $commonData->order_status_layout_align,
            'exclude_tag'=> $commonData->exclude_tag,

            'eo_btn_title' => $editOrderDetails->eo_btn_title,
            'eo_btn_bgcolor' => $editOrderDetails->eo_btn_bgcolor,
            'eo_btn_textcolor'=> $editOrderDetails->eo_btn_textcolor,
            'eo_popup_title'=>$editOrderDetails->eo_popup_title,
            'eo_popup_btn_title' => $editOrderDetails->eo_popup_btn_title,
            'eo_popup_bg_color'=> $editOrderDetails->eo_popup_bg_color,
            'eo_popup_title_color'=> $editOrderDetails->eo_popup_title_color,
            'eo_popup_btn_color' =>$editOrderDetails->eo_popup_btn_color,
            'eo_popup_border_color'=> $editOrderDetails->eo_popup_border_color,
            'eo_activate_at_order_details' => $editOrderDetails->activate_at_order_details,
            'eo_acivate_at_order_details'=> $editOrderDetails->activate_at_order_status,

            'ea_btn_title' => $editAddressDetails->ea_btn_title,
            'ea_btn_bgcolor' => $editAddressDetails->ea_btn_bgcolor,
            'ea_btn_textcolor'=> $editAddressDetails->ea_btn_textcolor,
            'ea_popup_title'=>$editAddressDetails->ea_popup_title,
            'ea_popup_btn_title' => $editAddressDetails->ea_popup_btn_title,
            'ea_popup_bg_color'=> $editAddressDetails->ea_popup_bg_color,
            'ea_popup_title_color'=> $editAddressDetails->ea_popup_title_color,
            'ea_popup_btn_color' =>$editAddressDetails->ea_popup_btn_color,
            'ea_popup_border_color'=> $editAddressDetails->ea_popup_border_color,
            'ea_activate_at_order_details' => $editAddressDetails->activate_at_order_details,
            'ea_acivate_at_order_details'=> $editAddressDetails->activate_at_order_status,

            'add_items' => $addItems,
            'ai_btn_title' => $addItems->ai_btn_title,
            'ai_btn_bgcolor' => $addItems->ai_btn_bgcolor,
            'ai_btn_textcolor' => $addItems->ai_btn_textcolor,
            'ai_activate_at_order_details' => $addItems->activate_at_order_details,
            'ai_acivate_at_order_details' => $addItems->activate_at_order_status,
        ]);
    }
    public function getSessionData($shop)
    {
        $sessionData = Session::select('access_token')->where('shop', $shop)->first();
        if ($sessionData) {
            $this->_access_token = $sessionData->access_token;
            Log::info('Access token retrieved', ['access_token' => $this->_access_token]);
        } else {
            Log::error('Access token not found for shop', ['shop' => $shop]);
        }
    }

    public function getOrderStatus($order_id, $shop)
    {
        try {
            if ($this->_access_token == '') {
                $this->getSessionData($shop);
            }
            if ($this->_access_token) {
                $client = new Graphql($shop, $this->_access_token);
                $queryString = <<<QUERY
                {
                    order(id:"gid://shopify/Order/$order_id"){
                        id
                        displayFulfillmentStatus
                        edited
                        createdAt
                        shippingAddress {
                            address1
                            address2
                            city
                            country
                            zip
                            province
                            phone
                        }
                        lineItems(first:250) {
                            edges {
                                node {
                                    id
                                    product {
                                        id
                                        tags
                                    }
                                }
                            }
                        }
                    }
                }
                QUERY;
                $response = $client->query($queryString);
                if ($response->getStatusCode() !== 200) {
                    Log::error('GraphQL query failed', ['status_code' => $response->getStatusCode()]);
                    return false;
                }
                $responseBody = $response->getDecodedBody();
                if (!isset($responseBody['data']['order'])) {
                    Log::error('Order data not found in response', ['response_body' => $responseBody]);
                    return false;
                }
    
                $excludeTagData = DB::table('tbl_data')->select('exclude_tag')->where('store', $shop)->first();
                if (!$excludeTagData) {
                    Log::error('Exclude tag data not found for store', ['store' => $shop]);
                    return false;
                }
    
                $excludeTag = $excludeTagData->exclude_tag;
    
                $lineItems = $responseBody['data']['order']['lineItems']['edges'];
                $tagsArray = [];
                $nonExcludedProductIds = [];
    
                foreach ($lineItems as $lineItem) {
                    $productTags = $lineItem['node']['product']['tags'];
                    $productId = $lineItem['node']['product']['id'];
    
                    if ($productTags && !in_array($excludeTag, $productTags)) {
                        $nonExcludedProductIds[] = $productId;
                    }
                }
    
                $orderDateTime = Carbon::parse($responseBody['data']['order']['createdAt']);
                $currentDateTime = Carbon::now();
                $diff = $currentDateTime->diff($orderDateTime);
                $diffInHours = $diff->days * 24 + $diff->h;
                $diffInMinutes = $diffInHours * 60 + $diff->i;
    
                $timeLimitData = DB::table('tbl_data')->select('time_limit')->where('store', $shop)->first();
                if (!$timeLimitData) {
                    Log::error('Time limit data not found for store', ['store' => $shop]);
                    return false;
                }
    
                $timeLimit = $timeLimitData->time_limit;
                $remainingTimeInMinutes = $timeLimit * 60 - $diffInMinutes;
                $remainingTimeInHours = $timeLimit - $diffInHours;
                $limit = $remainingTimeInMinutes <= 0;
    
                if (isset($responseBody['data']['order']['displayFulfillmentStatus'])) {
                    return [
                        'displayFulfillmentStatus' => $responseBody['data']['order']['displayFulfillmentStatus'],
                        'address1' => $responseBody['data']['order']['shippingAddress']['address1'],
                        'address2' => $responseBody['data']['order']['shippingAddress']['address2'],
                        'city' => $responseBody['data']['order']['shippingAddress']['city'],
                        'country' => $responseBody['data']['order']['shippingAddress']['country'],
                        'zip' => $responseBody['data']['order']['shippingAddress']['zip'],
                        'province' => $responseBody['data']['order']['shippingAddress']['province'],
                        'phone' => $responseBody['data']['order']['shippingAddress']['phone'],
                        'nonExcludedProductIds' => $nonExcludedProductIds,
                        'timeLimit' => $timeLimit,
                        'limit' => $limit,
                        'diffInHours' => $diffInHours,
                        'diffInMinutes' => $diffInMinutes,
                        'remainingTimeInMinutes' => $remainingTimeInMinutes,
                        'remainingTimeInHours' => $remainingTimeInHours,
                    ];
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in getOrderStatus', ['exception' => $e->getMessage()]);
            return false;
        }
        return false;
    }
    public function editAddressMutation($orderId, $shopName, $address1, $address2, $city, $pincode, $phone, $state, $country) {
        try {
            $this->getSessionData($shopName);
            if (empty($shopName)) {
                throw new \Exception('Shop name is not provided.');
            }
            
            $mutation = ' mutation editOrderShippingAddress {
                orderUpdate(
                    input: {
                        id: "gid://shopify/Order/' . $orderId . '",
                        shippingAddress: {
                            address1: "' . addslashes($address1) . '",
                            address2: "' . addslashes($address2) . '",
                            city: "' . addslashes($city) . '",
                            province: "' . addslashes($state) . '",
                            country: "' . addslashes($country) . '",
                            zip: "' . addslashes($pincode) . '",
                            phone: "' . addslashes($phone) . '"
                        }
                    }
                ) {
                    order {
                        id
                        shippingAddress {
                            address1
                            address2
                            city
                            province
                            country
                            zip
                            phone
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }';
            
            $client = new \GuzzleHttp\Client([
                'base_uri' => 'https://' . $shopName . '/admin/api/2023-04/graphql.json',
                'headers' => [
                    'X-Shopify-Access-Token' => $this->_access_token,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ],
            ]);
            
            $response = $client->post('', [
                'json' => [
                    'query' => $mutation,
                ],
            ]);
            
            $responseData = json_decode($response->getBody()->getContents(), true);
    
            if (!empty($responseData['data']['orderUpdate']['userErrors'])) {
                $errors = $responseData['data']['orderUpdate']['userErrors'];
                Log::error("Error updating shipping address for orderId {$orderId}: " . json_encode($errors));
                return ['success' => false, 'errors' => $errors];
            }
    
            if (!empty($responseData['errors'])) {
                $errors = $responseData['errors'];
                Log::error("Error updating shipping address for orderId {$orderId}: " . json_encode($errors));
                return ['success' => false, 'errors' => $errors];
            }
            
            Log::info("Shipping address updated successfully for orderId: {$orderId}");
            return ['success' => true, 'order' => $responseData['data']['orderUpdate']['order']];
            
        } catch (\Exception $e) {
            Log::error("Error updating shipping address for orderId {$orderId}: " . $e->getMessage());
            return ['success' => false, 'errors' => [['message' => $e->getMessage()]]];
        }
    }

    public function updateOrder($orderId, $shopName) {
        if (empty($this->_access_token)) {
            $this->getSessionData($shopName);
        }
        $accessToken = $this->_access_token;
        Log::info("AccessToken for UpdateOrder: " . $accessToken);
        if (!$accessToken) {
            throw new \Exception('Access token is missing or invalid.');
        }
        try {
            $query = '
            query {
                order(id: "gid://shopify/Order/' . $orderId . '") {
                    lineItems(first: 250) {
                        edges {
                            node {
                                id
                                title
                                quantity
                                image { url }
                                variant {
                                    id
                                    title
                                    price
                                    inventoryQuantity
                                    image { url } 
                                    product { tags id }
                                    product {
                                        id
                                        title
                                        variants(first: 50) { 
                                            edges {
                                                node {
                                                    id
                                                    title
                                                    price
                                                    inventoryQuantity
                                                    image { url }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    subtotalPriceSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }
                    totalShippingPriceSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }
                    currentTotalTaxSet {
                        presentmentMoney {
                            amount
                            currencyCode
                        }
                    }    
                }
            }';
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $accessToken,
            ])->post('https://' . $shopName . '/admin/api/2024-01/graphql.json', [
                'query' => $query,
            ]);
    
            $data = $response->json();
            Log::debug(json_encode($data));

            if (isset($data['errors'])) {
                throw new \Exception('GraphQL request failed: ' . json_encode($data['errors']));
            }
    
            // Filter line items
            $filteredLineItems = [];
            $subtotal = $data['data']['order']['subtotalPriceSet']['presentmentMoney']['amount'];
            $shipping = $data['data']['order']['totalShippingPriceSet']['presentmentMoney']['amount'];
            $tax = $data['data']['order']['currentTotalTaxSet']['presentmentMoney']['amount'];
            $currencyCode = $data['data']['order']['totalShippingPriceSet']['presentmentMoney']['currencyCode'];
            $taxCurrencyCode = $data['data']['order']['currentTotalTaxSet']['presentmentMoney']['currencyCode'];
            foreach ($data['data']['order']['lineItems']['edges'] as $edge) {
                $lineItem = $edge['node'];
                $tags = $lineItem['variant']['product']['tags'] ?? [];
                $hasExcludeTag = false;
                foreach ($tags as $tag) {
                    if (strtolower($tag) === 'exclude') {
                        $hasExcludeTag = true;
                        break;
                    }
                }
    
                if (!$hasExcludeTag) {
                    if (isset($lineItem['quantity'])) {
                        $orderedVariant = [
                            'id' => $lineItem['variant']['id'],
                            'title' => $lineItem['variant']['title'],
                            'price' => $lineItem['variant']['price'],
                            'inventoryQuantity' => $lineItem['variant']['inventoryQuantity'] ?? null,
                            'image' => $lineItem['variant']['image']['url'] ?? null,
                        ];
    
                        $allVariants = [];
    
                        if (isset($lineItem['variant']['product']['variants']['edges'])) {
                            foreach ($lineItem['variant']['product']['variants']['edges'] as $variantEdge) {
                                $allVariants[] = [  
                                    'id' => $variantEdge['node']['id'],
                                    'title' => $variantEdge['node']['title'],
                                    'price' => $variantEdge['node']['price'],
                                    'inventoryQuantity' => $variantEdge['node']['inventoryQuantity'] ?? null,
                                    'image' => $variantEdge['node']['image']['url'] ?? null,
                                ];
                            }
                        }
                        
                        $filteredLineItems[] = [
                            'id' => $lineItem['id'],
                            'title' => $lineItem['title'],
                            'quantity' => $lineItem['quantity'], 
                            'image' => $lineItem['image']['url'], 
                            'orderedVariant' => $orderedVariant,
                            'allVariants' => $allVariants,
                            'product' => [
                                'id' => $lineItem['variant']['product']['id'],
                                'image' => $lineItem['variant']['product']['image']['url'] ?? null,
                            ],
                        ];
                        
                    } else {
                        error_log("Quantity not set for line item ID: " . $lineItem['id']);
                    }
                }
            }
            $filteredLineItems[] = [
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'currencyCode' => $currencyCode,
                'tax' => $tax,
                'taxCurrency' => $taxCurrencyCode,
            ];
            return $filteredLineItems;
        } catch (\Exception $error) {
            Log::error("Error updating order: " . $error->getMessage());
            throw $error;
        }
    }
}
