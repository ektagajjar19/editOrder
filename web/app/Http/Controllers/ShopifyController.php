<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Models\ShopifyDD;

class ShopifyController extends Controller
{
    public function enableApp(Request $request)
    {
        // Log::info("ShopifyController Called...");
        // Log::info($request);
        $shop = $request->input('shop');
        $accessToken = ShopifyDD::getAccessToken($shop);

        Artisan::call('shopify:fetch-theme-id', [
            'shop' => $shop,
            'accessToken' => $accessToken
        ]);

        $themeId = trim(Artisan::output());

        if ($themeId) {
            Artisan::call('order:inject-card', [
                'shop' => $shop,
                'accessToken' => $accessToken,
                'themeId' => $themeId
            ]);
            return response()->json(['message' => 'App enabled and order confirmation template modified.']);
        } else {
            return response()->json(['error' => 'Failed to fetch theme ID for shop: ' . $shop], 500);
        }
    }
}
