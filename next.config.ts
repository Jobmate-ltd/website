import type { NextConfig } from 'next'
import { APEX_HOST, SITE_URL } from './lib/brand'

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
