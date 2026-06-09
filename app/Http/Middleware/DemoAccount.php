<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class DemoAccount
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->isDemoUser()) {
            return $next($request);
        }

        if (! $request->isMethod('get') && ! $request->isMethod('head')) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'Demo account',
                'description' => 'Want to try it for real? Clone it on',
                'link' => [
                    'label' => 'GitHub',
                    'url' => 'https://github.com/jgretton/grand-prix',
                ],
            ]);

            return back();
        }

        return $next($request);

    }
}
