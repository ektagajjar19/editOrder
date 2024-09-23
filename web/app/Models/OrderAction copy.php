<?php

namespace App\Models;

use Carbon\Carbon;
use Shopify\Clients\Graphql;
use Illuminate\Support\Facades\DB;
use Facade\FlareClient\Http\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderAction extends Model
{
    use HasFactory;
    protected $_access_token;

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
    public function editAddressMutation($orderId, $shopName, $address1, $address2, $city, $pincode, $phone, $state, $country) {
        try {
            $this->getSessionData($shopName);
            if (empty($shopName)) {
                throw new \Exception('Shop name is not provided.');
            }
    
            $mutation = '
            mutation editOrderShippingAddress($orderId: ID!, $newAddress: MailingAddressInput!) {
                orderEditBegin(id: $orderId) {
                    calculatedOrder {
                        id
                    }
                    userErrors {
                        field
                        message
                    }
                }
                orderEditUpdateShippingAddress(id: $orderId, shippingAddress: $newAddress) {
                    order {
                        id
                        shippingAddress {
                            address1
                            address2
                            city
                            province
                            country
                            zip
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
                orderEditCommit(id: $orderId) {
                    order {
                        id
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }';
    
            $variables = [
                'orderId' => "gid://shopify/Order/{$orderId}",
                'newAddress' => [
                    'address1' => $address1,
                    'address2' => $address2,
                    'city' => $city,
                    'province' => $state,
                    'country' => $country,
                    'zip' => $pincode,
                    'phone' => $phone,
                ],
            ];
    
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
                    'variables' => $variables,
                ],
            ]);
    
            $responseData = json_decode($response->getBody()->getContents(), true);
    
            if (isset($responseData['errors']) || isset($responseData['data']['orderEditBegin']['userErrors']) || isset($responseData['data']['orderEditUpdateShippingAddress']['userErrors']) || isset($responseData['data']['orderEditCommit']['userErrors'])) {
                $errors = $responseData['errors'] ?? array_merge(
                    $responseData['data']['orderEditBegin']['userErrors'] ?? [],
                    $responseData['data']['orderEditUpdateShippingAddress']['userErrors'] ?? [],
                    $responseData['data']['orderEditCommit']['userErrors'] ?? []
                );
                Log::error("Error updating shipping address for orderId {$orderId}: " . json_encode($errors));
                return null;
            }
    
            Log::info("Shipping address updated successfully for orderId: {$orderId}");
            return $responseData['data']['orderEditCommit']['order'];
        } catch (\Exception $e) {
            Log::error("Error updating shipping address for orderId {$orderId}: " . $e->getMessage());
            return null;
        }
    }
    
}
