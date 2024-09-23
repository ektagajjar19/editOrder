<?php

namespace App\Models;

use Shopify\Auth\Session;
use Shopify\Clients\Graphql;
use Illuminate\Support\Facades\Log;

class ShopifyScriptTag {

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

    public static function createScriptTag(Session $session, string $src, $displayScope = "ALL") {
        try {
            $client = new Graphql($session->getShop(), $session->getAccessToken());
            $response = $client->query([
                "query" => self::CREATE_SCRIPTTAG_MUTATION,
                "variables" => [
                    "input" => [
                        "cache" => false,
                        "displayScope" => $displayScope,
                        "src" => $src
                    ]
                ]
            ]);

            Log::info("GraphQL response: " . $response->getBody()->getContents());

            if ($response->getStatusCode() !== 200) {
                throw new \Exception("GraphQL request failed with status code " . $response->getStatusCode());
            }

            $data = json_decode($response->getBody()->getContents(), true); // Convert JSON response to array

            if (isset($data['errors'])) {
                throw new \Exception("GraphQL request returned errors: " . json_encode($data['errors']));
            }

            Log::info("Script tag created successfully.");

        } catch (\Exception $e) {
            Log::error("Error creating script tag: " . $e->getMessage());
            // Handle the error as needed (e.g., throw an exception, return false, etc.)
        }
    }
}
