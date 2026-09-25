/**
 * Every public route, for the axe and screenshot sweeps. Kept in sync with
 * lib/routes.ts and lib/insights.ts. The Phase 2 and Phase 3 routes join the
 * list when the server under test was built with
 * NEXT_PUBLIC_PLATFORM_LAUNCH=true (set the same variable, or E2E_PLATFORM=on,
 * when running the suite); the comparisons when NEXT_PUBLIC_COMPARE_PAGES=true
 * (or E2E_COMPARE=on) as well.
 */
export const PHASE_1_ROUTES = [
  '/',
  '/about',
  '/academy',
  '/insights',
  '/insights/rams-risk-assessments-method-statements',
  '/insights/how-to-investigate-a-workplace-accident',
  '/insights/first-aid-at-work-requirements',
  '/insights/riddor-reporting-explained',
  '/insights/near-miss-reporting-safety-culture',
  '/insights/lone-worker-safety-guide',
  '/insights/accident-book-requirements-uk',
  '/insights/riddor-changes-2026-consultation',
  '/insights/toolbox-talks-that-work',
  '/industries/window-door-fitters',
  '/industries/healthcare',
  '/industries/field-services',
  '/industries/transport-logistics',
  '/toolkit',
  '/privacy-policy',
  '/terms',
  '/cookies',
] as const

export const PHASE_2_ROUTES = ['/platform', '/platform/incident-reporting', '/platform/riddor', '/platform/risk-assessments', '/platform/permits-to-work', '/platform/offline', '/pricing', '/security', '/demo', '/contact'] as const

/** Phase 3: the remaining module pages, the new industries and the free tools (the gated module pages are 404 and not listed). */
export const PHASE_3_ROUTES = [
  '/platform/investigations',
  '/platform/corrective-actions',
  '/platform/fleet-compliance',
  '/platform/training-competence',
  '/platform/document-control',
  '/platform/dashboards',
  '/platform/bowtie-analysis',
  '/industries/construction',
  '/industries/facilities-management',
  '/industries/manufacturing-warehousing',
  '/tools',
  '/tools/riddor-checker',
  '/tools/risk-matrix',
  '/tools/accident-frequency-rate',
] as const

/** The comparisons need NEXT_PUBLIC_COMPARE_PAGES=true as well (or E2E_COMPARE=on). */
export const COMPARE_ROUTES = ['/compare', '/compare/mitti-safetyculture', '/compare/evotix', '/compare/ecoonline'] as const

export const PLATFORM_ON = process.env.E2E_PLATFORM === 'on' || process.env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true'
export const COMPARE_ON = PLATFORM_ON && (process.env.E2E_COMPARE === 'on' || process.env.NEXT_PUBLIC_COMPARE_PAGES === 'true')

export const ROUTES: readonly string[] = PLATFORM_ON ? [...PHASE_1_ROUTES, ...PHASE_2_ROUTES, ...PHASE_3_ROUTES, ...(COMPARE_ON ? COMPARE_ROUTES : [])] : PHASE_1_ROUTES

export const WIDTHS = [320, 768, 1280] as const
