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
//
// seo-audit-ignore: no-checklists — the manifest lists /platform/checklists,
// the module page gated on PHASE_3_INPUTS.checklistBuilderShipped. It is
// platformOnly and `requires` that input, so it is 404, out of the nav and
// out of the sitemap until the product ships the builder.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { COMPARE_PAGES, PHASE_3_INPUTS, type Phase3Input } from './brand.ts'

export interface StaticRoute {
  readonly path: string
  /** ISO date (YYYY-MM-DD) the content last changed. */
  readonly updated: string
  readonly changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  readonly priority: number
  /** Phase 2 routes: hidden from the sitemap and nav until the platform launches. */
  readonly platformOnly?: boolean
  /** Phase 3 comparison pages: also need NEXT_PUBLIC_COMPARE_PAGES. */
  readonly compareOnly?: boolean
  /** Phase 3 pages built only once a product input is true. */
  readonly requires?: Phase3Input
}

/** Phase 1 shipped on 25/09/2026; every page it touched carries that date. */
const PHASE_1 = '2026-09-25'
/** Phase 2 pages carry the date the flag is flipped; until then this is their build date. */
const PHASE_2 = '2026-09-25'
/** Phase 3 pages: modules, industries, tools and comparisons. */
const PHASE_3 = '2026-09-25'

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
  // Phase 2: the platform relaunch, held behind NEXT_PUBLIC_PLATFORM_LAUNCH.
  { path: '/platform', updated: PHASE_2, changeFrequency: 'weekly', priority: 0.95, platformOnly: true },
  { path: '/platform/incident-reporting', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/platform/riddor', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/platform/risk-assessments', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/platform/permits-to-work', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/platform/offline', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/pricing', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/security', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.7, platformOnly: true },
  { path: '/demo', updated: PHASE_2, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/contact', updated: PHASE_2, changeFrequency: 'yearly', priority: 0.6, platformOnly: true },
  // Phase 3: the remaining module pages, the new industries, the free tools and the comparisons.
  { path: '/platform/investigations', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/platform/corrective-actions', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/platform/fleet-compliance', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/platform/training-competence', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/platform/document-control', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true },
  { path: '/platform/dashboards', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true },
  { path: '/platform/bowtie-analysis', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/platform/checklists', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true, requires: 'checklistBuilderShipped' },
  { path: '/platform/contractors', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true, requires: 'contractorCrudShipped' },
  { path: '/industries/construction', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/industries/facilities-management', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/industries/manufacturing-warehousing', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/tools', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true },
  { path: '/tools/riddor-checker', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/tools/risk-matrix', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.9, platformOnly: true },
  { path: '/tools/accident-frequency-rate', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.8, platformOnly: true },
  { path: '/compare', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true, compareOnly: true },
  { path: '/compare/mitti-safetyculture', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true, compareOnly: true },
  { path: '/compare/evotix', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true, compareOnly: true },
  { path: '/compare/ecoonline', updated: PHASE_3, changeFrequency: 'monthly', priority: 0.7, platformOnly: true, compareOnly: true },
] as const

/** The flags a route's existence depends on, beyond the launch flag. */
export interface RouteFlags {
  readonly compare?: boolean
  readonly inputs?: Readonly<Record<Phase3Input, boolean>>
}

/** Is `path` a page in this flag state? Nav and footer never render a link this returns false for. */
export function routeExists(path: string, platformLaunched: boolean, flags: RouteFlags = {}): boolean {
  return publicRoutes(platformLaunched, flags).some((route) => route.path === path)
}

/**
 * Routes that should be public now. Phase 2 routes are held back by the
 * launch flag; comparison pages also by NEXT_PUBLIC_COMPARE_PAGES; a page
 * gated on a Phase 3 input by that input.
 */
export function publicRoutes(platformLaunched: boolean, { compare = COMPARE_PAGES, inputs = PHASE_3_INPUTS }: RouteFlags = {}): readonly StaticRoute[] {
  return STATIC_ROUTES.filter((route) => {
    if (route.platformOnly && !platformLaunched) return false
    if (route.compareOnly && !compare) return false
    if (route.requires && !inputs[route.requires]) return false
    return true
  })
}

/** `YYYY-MM-DD` → Date at midnight UTC. */
export function isoDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`)
}
