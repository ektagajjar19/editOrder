<?php

use Shopify\Utils;
use Shopify\Context;
use App\Models\Session;
use Shopify\Auth\OAuth;
use App\Models\ScriptTag;
use App\Models\ShopifyDD;
use Shopify\Clients\Rest;
use App\Lib\EnsureBilling;
use App\Lib\ProductCreator;
use App\Lib\AuthRedirection;
use Illuminate\Http\Request;
use Shopify\Webhooks\Topics;
use Shopify\Webhooks\Registry;
use App\Models\ShopifyScriptTag;
use Shopify\Clients\HttpHeaders;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Config;
use Shopify\Auth\Session as AuthSession;
use App\Http\Controllers\ShopifyController;
use App\Http\Controllers\DataActionController;
use App\Http\Controllers\OrderActionController;
use Shopify\Exception\InvalidWebhookException;
use App\Exceptions\ShopifyProductCreatorException;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
| If you are adding routes outside of the /api path, remember to also add a
| proxy rule for them in web/frontend/vite.config.js
|
*/
// Route::get('/js/connected_alert.js', function () {
//     return response()->file(public_path('js/connected_alert.js'));
// });

Route::get('/js/en_edit_order.js', function (Request $request) {
    return response()->file(public_path('js/en_edit_order.js'));
});

Route::fallback(function (Request $request) {
    if (Context::$IS_EMBEDDED_APP &&  $request->query("embedded", false) === "1") {
        if (env('APP_ENV') === 'production') {
            return file_get_contents(public_path('index.html'));
        } else {
            return file_get_contents(base_path('frontend/index.html'));
        }
    } else {
        return redirect(Utils::getEmbeddedAppUrl($request->query("host", null)) . "/" . $request->path());
    }
})->middleware('shopify.installed');

Route::get('/api/auth', function (Request $request) {
    $shop = Utils::sanitizeShopDomain($request->query('shop'));

    // Delete any previously created OAuth sessions that were not completed (don't have an access token)
    Session::where('shop', $shop)->where('access_token', null)->delete();

    return AuthRedirection::redirect($request);
});


Route::get('/api/auth/callback', function (Request $request) {
    $session = OAuth::callback(
        $request->cookie(),
        $request->query(),
        ['App\Lib\CookieHandler', 'saveShopifyCookie'],
    );

    $host = $request->query('host');
    $shop = Utils::sanitizeShopDomain($request->query('shop'));

    $response = Registry::register('/api/webhooks', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
    if ($response->isSuccess()) {
        Log::debug("Registered APP_UNINSTALLED webhook for shop $shop");
    } else {
        Log::error(
            "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
                print_r($response->getBody(), true)
        );
    }
    
    ShopifyDD::defaultData($session);

    $redirectUrl = Utils::getEmbeddedAppUrl($host);
    if (Config::get('shopify.billing.required')) {
        list($hasPayment, $confirmationUrl) = EnsureBilling::check($session, Config::get('shopify.billing'));

        if (!$hasPayment) {
            $redirectUrl = $confirmationUrl;
        }
    }
    return redirect($redirectUrl);
});

Route::get('/api/products/count', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); 

    $client = new Rest($session->getShop(), $session->getAccessToken());
    $result = $client->get('products/count');

    return response($result->getDecodedBody());
})->middleware('shopify.auth');

Route::post('/api/products', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); 

    $success = $code = $error = null;
    try {
        ProductCreator::call($session, 5);
        $success = true;
        $code = 200;
        $error = null;
    } catch (\Exception $e) {
        $success = false;

        if ($e instanceof ShopifyProductCreatorException) {
            $code = $e->response->getStatusCode();
            $error = $e->response->getDecodedBody();
            if (array_key_exists("errors", $error)) {
                $error = $error["errors"];
            }
        } else {
            $code = 500;
            $error = $e->getMessage();
        }

        Log::error("Failed to create products: $error");
    } finally {
        return response()->json(["success" => $success, "error" => $error], $code);
    }
})->middleware('shopify.auth');

Route::post('/api/webhooks', function (Request $request) {
    try {
        $topic = $request->header(HttpHeaders::X_SHOPIFY_TOPIC, '');

        $response = Registry::process($request->header(), $request->getContent());
        if (!$response->isSuccess()) {
            Log::error("Failed to process '$topic' webhook: {$response->getErrorMessage()}");
            return response()->json(['message' => "Failed to process '$topic' webhook"], 500);
        }
    } catch (InvalidWebhookException $e) {
        Log::error("Got invalid webhook request for topic '$topic': {$e->getMessage()}");
        return response()->json(['message' => "Got invalid webhook request for topic '$topic'"], 401);
    } catch (\Exception $e) {
        Log::error("Got an exception when handling '$topic' webhook: {$e->getMessage()}");
        return response()->json(['message' => "Got an exception when handling '$topic' webhook"], 500);
    }
});

Route::post('/api/data', [DataActionController::class, 'index'])->middleware('shopify.auth');
Route::post('/api/getorderstatus', [OrderActionController::class, 'getorderstatus']);
Route::post('api/fetch/updateOrderShippingAddress', [OrderActionController::class, 'updateOrderShippingAddress']);
Route::post('api/fetch/updateOrder', [OrderActionController::class, 'updateOrder']);

Route::get('/api/get/data', [DataActionController::class, 'getdata'])->middleware('shopify.auth');
Route::post('/api/get/data', [DataActionController::class, 'getdata']);

Route::get('/api/get/editorderdata', [DataActionController::class, 'getDefaultDataEditOrder'])->middleware('shopify.auth');
Route::post('/api/get/editorderdata', [DataActionController::class, 'getDefaultDataEditOrder']);

Route::get('/api/get/editaddressdata', [DataActionController::class, 'getDefaultDataEditAddress'])->middleware('shopify.auth');
Route::post('/api/get/editaddressdata', [DataActionController::class, 'getDefaultDataEditAddress']);

Route::get('/api/get/additemsdata', [DataActionController::class, 'getDefaultDataAddItems'])->middleware('shopify.auth');
Route::post('/api/get/additemsdata', [DataActionController::class, 'getDefaultDataAddItems']);

Route::post('/enable-app', [ShopifyController::class, 'enableApp']);
