import type { NextConfig } from 'next'
import { APEX_HOST, SITE_URL, isPlatformLaunched } from './lib/brand'
import { STATIC_ROUTES, publicRoutes } from './lib/routes'

const nextConfig: NextConfig = {
  // The gated toolkit PDF lives in /private (never under /public), so it is only
  // reachable through the signed download route. Ship it with that route's lambda.
  outputFileTracingIncludes: {
    '/api/toolkit/download': ['./private/**'],
  },

  // AVIF first, WebP second: the hero PNG and video posters shrink by half
  // for every browser that can decode them (Lighthouse "image delivery").
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Not `experimental.inlineCss`: it was measured (docs/PHASE-1.md) and it
  // made every page slower. Next serialises the inlined sheet into the RSC
  // payload as well as the <style> tag, so the homepage HTML grew from 220 KB
  // to 383 KB and first paint on a throttled phone moved later, not earlier.
  // The external 11 KB sheet is cached across pages instead.

  /**
   * Apex → www, permanently (308). Vercel's domain-level redirect should be set
   * to the same target so the hop happens at the edge; this rule is the
   * belt-and-braces for any request that reaches the app with the bare host.
   */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: APEX_HOST }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ]
  },

  /**
   * Routes that do not exist in this build: every platform route while
   * NEXT_PUBLIC_PLATFORM_LAUNCH is off, the comparisons while
   * NEXT_PUBLIC_COMPARE_PAGES is off, and a module page whose product input
   * (lib/brand.ts PHASE_3_INPUTS) is false. Each page also
   * calls `notFound()`, but a page-thrown 404 prerenders as Next's client-side
   * error shell (empty <body>, no lang, no fonts until JavaScript runs). A
   * rewrite to a path that has no route sends the request through the real
   * not-found route instead, so the visitor gets app/not-found.tsx
   * server-rendered with a 404, exactly like any mistyped URL, and the
   * pages' Open Graph images stay unreachable too. The list is read from
   * lib/routes.ts so a new Phase 2 page is covered by adding its route there.
   */
  async rewrites() {
    const none = { beforeFiles: [], afterFiles: [], fallback: [] }
    // Phase 3: a route can also be held back by NEXT_PUBLIC_COMPARE_PAGES or by a
    // product input; `publicRoutes()` applies all three, so whatever it leaves
    // out is rewritten to the not-found route in this build.
    const live = new Set(publicRoutes(isPlatformLaunched()).map((route) => route.path))
    const held = STATIC_ROUTES.filter((route) => !live.has(route.path))
    if (!held.length) return none
    // `beforeFiles`: a plain array is applied after the filesystem, where these
    // static pages would win. `:rest*` is optional, so it matches the bare path too.
    return {
      ...none,
      beforeFiles: held.map((route) => ({ source: `${route.path}/:rest*`, destination: '/__platform-not-launched' })),
    }
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ],
      },
    ]
  },
}

export default nextConfig
