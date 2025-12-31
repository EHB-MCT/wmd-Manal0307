<?php

use App\Console\Commands\CloseStaleSessions;
use App\Console\Commands\DemoSeedCommand;
use App\Http\Middleware\SanitizeInput;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(SanitizeInput::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->withCommands([
        CloseStaleSessions::class,
        DemoSeedCommand::class,
    ])->create();
