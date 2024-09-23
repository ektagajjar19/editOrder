<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FetchThemeId extends Command
{
    protected $signature = 'shopify:fetch-theme-id {shop} {accessToken}';
    protected $description = 'Fetch the main theme ID for a Shopify store';

    public function handle()
    {
        $shop = $this->argument('shop');
        $accessToken = $this->argument('accessToken');

        $endpoint = "https://{$shop}/admin/api/2023-01/themes.json";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Shopify-Access-Token' => $accessToken
        ])->get($endpoint);

        if ($response->successful()) {
            $themes = $response->json();
            foreach ($themes['themes'] as $theme) {
                if ($theme['role'] === 'main') {
                    $this->line($theme['id']);
                    return;
                }
            }
            $this->error('Main theme not found');
        } else {
            $this->error('Error fetching themes: ' . $response->body());
        }
    }
}
