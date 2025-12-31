<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeInput
{
    private const MAX_LENGTH = 500;

    public function handle(Request $request, Closure $next)
    {
        if ($request->isJson() || $request->wantsJson() || $request->method() !== 'GET') {
            $request->merge($this->cleanArray($request->all()));
        }

        return $next($request);
    }

    private function cleanArray(array $values): array
    {
        $cleaned = [];

        foreach ($values as $key => $value) {
            if (is_array($value)) {
                $cleaned[$key] = $this->cleanArray($value);
                continue;
            }

            if (is_string($value)) {
                $normalized = preg_replace('/\s+/u', ' ', trim(strip_tags($value)));
                $cleaned[$key] = mb_substr($normalized, 0, self::MAX_LENGTH);
                continue;
            }

            $cleaned[$key] = $value;
        }

        return $cleaned;
    }
}
