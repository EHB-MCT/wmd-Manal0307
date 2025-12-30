<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\User;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function track(Request $request)
    {
        $data = $request->validate([
            'uid' => ['required', 'string', 'max:64'],
            'event_type' => ['required', 'string', 'max:100'],
            'metadata' => ['nullable', 'array'],
            'page_url' => ['nullable', 'string', 'max:2048'],
            'user_agent' => ['nullable', 'string', 'max:512'],
            'viewport_width' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'viewport_height' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'screen_width' => ['nullable', 'integer', 'min:0', 'max:20000'],
            'screen_height' => ['nullable', 'integer', 'min:0', 'max:20000'],
        ]);

        $user = User::where('uid', $data['uid'])->firstOrFail();
        $now = now();

        Interaction::create([
            'user_id' => $user->id,
            'event_type' => $data['event_type'],
            'metadata' => $this->sanitizeMetadata($data['metadata'] ?? []),
            'timestamp' => $now,
            'page_url' => $this->normalizeString($data['page_url'] ?? null, 2048),
            'user_agent' => $this->normalizeString($data['user_agent'] ?? null, 512),
            'viewport_width' => $data['viewport_width'] ?? null,
            'viewport_height' => $data['viewport_height'] ?? null,
            'screen_width' => $data['screen_width'] ?? null,
            'screen_height' => $data['screen_height'] ?? null,
        ]);

        $user->last_activity_at = $now;
        $user->save();

        return response()->json(['tracked' => true]);
    }

    private function sanitizeMetadata(array $metadata, int $depth = 0): array
    {
        if ($depth > 2) {
            return [];
        }

        $clean = [];
        $count = 0;

        foreach ($metadata as $key => $value) {
            if ($count >= 25) {
                break;
            }

            if (!is_string($key)) {
                continue;
            }

            $normalizedKey = mb_substr($key, 0, 50);

            if (is_scalar($value) || $value === null) {
                $clean[$normalizedKey] = $this->sanitizeScalar($value);
                $count++;
                continue;
            }

            if (is_array($value)) {
                $clean[$normalizedKey] = $this->sanitizeMetadata($value, $depth + 1);
                $count++;
            }
        }

        return $clean;
    }

    private function sanitizeScalar($value)
    {
        if (is_string($value)) {
            return mb_substr(strip_tags($value), 0, 255);
        }

        if (is_bool($value) || is_null($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        return null;
    }

    private function normalizeString(?string $value, int $limit): ?string
    {
        if ($value === null) {
            return null;
        }

        return mb_substr(trim($value), 0, $limit);
    }
}
