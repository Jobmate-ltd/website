/**
 * Every public route, for the axe and screenshot sweeps. Kept in sync with
 * lib/routes.ts and lib/insights.ts. The Phase 2 routes join the list when
 * the server under test was built with NEXT_PUBLIC_PLATFORM_LAUNCH=true
 * (set the same variable, or E2E_PLATFORM=on, when running the suite).
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

export const PLATFORM_ON = process.env.E2E_PLATFORM === 'on' || process.env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true'

export const ROUTES: readonly string[] = PLATFORM_ON ? [...PHASE_1_ROUTES, ...PHASE_2_ROUTES] : PHASE_1_ROUTES

export const WIDTHS = [320, 768, 1280] as const
