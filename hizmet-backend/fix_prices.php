<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

App\Models\Review::whereNull('price_paid')->get()->each(function($r) {
    $r->price_paid = rand(500, 5000);
    $r->save();
});

echo "Prices updated successfully.\n";
