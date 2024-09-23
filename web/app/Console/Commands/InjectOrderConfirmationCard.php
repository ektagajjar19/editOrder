<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class InjectOrderConfirmationCard extends Command
{
    protected $signature = 'order:inject-card {shop} {accessToken} {themeId}';
    protected $description = 'Injects a custom card into the order confirmation page template';

    public function handle()
    {
        Log::info("InjectOrderConfirmationCard Command Running..");
        $shop = $this->argument('shop');
        $accessToken = $this->argument('accessToken');
        $themeId = $this->argument('themeId');
        Log::info($shop);
        Log::info($accessToken);
        Log::info($themeId);
        $timeLimitHours = DB::table('tbl_data')->where('store', $shop)->value('time_limit');
        Log::info($timeLimitHours);

        $timeLimitInMinutes = $timeLimitHours * 60;
        Log::info($timeLimitInMinutes);

        $gettblToken = DB::table('tbl_data')
                        ->join('tbl_edit_order_details', 'tbl_data.id', '=', 'tbl_edit_order_details.store_id')
                        ->select('tbl_data.id', 'tbl_data.store', 'tbl_edit_order_details.*')
                        ->where('tbl_data.store', $shop)
                        ->first();
        $eoBtnTitle = $gettblToken->eo_btn_title;
        Log::info($eoBtnTitle);

        // Construct the div content
        $templateContent = <<<HTML
            <div class="edit-order-card">
                <div class="card-header">
                    <h2>Edit Order easily</h2>
                    <p><strong>Take control of your Edit order with these actions</strong></p>
                </div>
                <div class="card-body">
                    <a href="#" class="edit-order-btn">{$eoBtnTitle}</a>
                </div>
                <div class="card-footer" style="display: {$this->getDisplayStyle($timeLimitInMinutes)};">
                    You have {$timeLimitInMinutes} minutes left to edit this order
                </div>
            </div>
        HTML;

        $endpoint = "https://{$shop}/admin/api/2023-01/themes/{$themeId}/assets.json";

        Log::info($endpoint);

        $params = [
            'asset' => [
                'key' => 'sections/order-status.liquid',
                'value' => $templateContent
            ]
        ];
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Shopify-Access-Token' => $accessToken
        ])->put($endpoint, $params);

        Log::debug(json_encode($response, JSON_PRETTY_PRINT));

        if ($response->successful()) {
            $this->info('Template modified successfully');
        } else {
            $this->error('Error modifying template: ' . $response->body());
        }
    }

    private function getDisplayStyle($timeLimitInMinutes)
    {
        return $timeLimitInMinutes <= 120 ? 'block' : 'none';
    }
}
