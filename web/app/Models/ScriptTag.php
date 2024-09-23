<?php

namespace App\Models;

use Shopify\Auth\Session;
use Shopify\Clients\Graphql;
use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Delivery\HttpDelivery;

class ScriptTag{

    private const CREATE_SCRIPTTAG_MUTATION = <<<'QUERY'
    mutation scriptTagCreate($input: ScriptTagInput!) {
        scriptTagCreate(input: $input) {
            scriptTag {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
    QUERY;

    public static function call(Session $session, string $path, $displayScope = "ALL")
    {
        Log::info("ScriptTag static funtion Called..");

        $method = new HttpDelivery();
        $src = $method->getCallbackAddress($path);
        self::createScriptTag( $session, $src, $displayScope );
    }

    public static function createScriptTag( Session $session, string $src, $displayScope ){

        Log::info("ScriptTag createScriptTag funtion Called..");

        $client = new Graphql($session->getShop(), $session->getAccessToken());
        $response = $client->query(
            [
                "query" => self::CREATE_SCRIPTTAG_MUTATION,
                "variables" => [
                    "input" => [
                        "cache" => false,
                        "displayScope" => $displayScope,
                        "src" => $src
                    ]
                ]
            ],
        );
        Log::info(json_encode($response));
        if ($response->getStatusCode() !== 200) {
            throw new ShopifyProductCreatorException($response->getBody()->__toString(), $response);
        }
    }

}
