// ─────────────────────────────────────────────────────────────────────────────
// Route manifest. SINGLE SOURCE OF TRUTH for the static marketing routes.
//
// The sitemap, the OG images, the axe and screenshot scripts all read this
// list. `updated` is the real last-modified date of the page's content
// (DD/MM/YYYY in commit messages, ISO here), NOT the build time: a sitemap
// that stamps every URL with "now" tells a crawler nothing. When you change a
// page's copy, change its date. `scripts/lastmod.mjs` prints the git dates
// so the two can be compared.
//
// Insights articles carry their own dates in lib/insights.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'

export interface StaticRoute {
  readonly path: string
  /** ISO date (YYYY-MM-DD) the content last changed. */
  readonly updated: string
  readonly changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  readonly priority: number
  /** Phase 2 routes: hidden from the sitemap and nav until the platform launches. */
  readonly platformOnly?: boolean
}

/** Phase 1 shipped on 25/09/2026; every page it touched carries that date. */
const PHASE_1 = '2026-09-25'

export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: '/', updated: PHASE_1, changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/industries/window-door-fitters', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/industries/healthcare', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/industries/field-services', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/industries/transport-logistics', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.9 },
  { path: '/academy', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/insights', updated: PHASE_1, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/toolkit', updated: PHASE_1, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/privacy-policy', updated: PHASE_1, changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', updated: PHASE_1, changeFrequency: 'yearly', priority: 0.2 },
  { path: '/cookies', updated: PHASE_1, changeFrequency: 'yearly', priority: 0.2 },
] as const

/** Routes that should be public now. Phase 2 routes are held back by the flag. */
export function publicRoutes(platformLaunched: boolean): readonly StaticRoute[] {
  return STATIC_ROUTES.filter((route) => !route.platformOnly || platformLaunched)
}

/** `YYYY-MM-DD` → Date at midnight UTC. */
export function isoDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`)
}
