<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/products/count',
        'api/products',
        'api/graphql',
        'api/webhooks',
        '/api/data',
        'api/get/data',
        'api/get/editorderdata',
        'api/get/editaddressdata',
        'api/get/additemsdata',
        'api/fetch/updateOrderShippingAddress',
        '/api/getorderstatus',
        'api/fetch/updateOrder'
    ];
}
