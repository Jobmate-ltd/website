// ─────────────────────────────────────────────────────────────────────────────
// The internal link registry.
//
// Contextual links — the ones in a page's own copy, not the header or the
// footer — are declared here, one entry per source page, so that:
//   · every page renders its "Connected to" / related / cluster links from
//     the same list (`linksFrom`), and
//   · scripts/seo-check.mjs can prove each Phase 2 page has at least three
//     contextual links in and three out, and that every declared link is
//     really in the served HTML inside <main>.
//
// Keys and values are site paths. Order matters for rendering. Node's test
// runner imports this file directly, so keep it dependency-free.
// ─────────────────────────────────────────────────────────────────────────────

export const MODULE_PATHS = {
  incidents: '/platform/incident-reporting',
  riddor: '/platform/riddor',
  risk: '/platform/risk-assessments',
  permits: '/platform/permits-to-work',
} as const

export const INDUSTRY_PATHS = [
  '/industries/transport-logistics',
  '/industries/window-door-fitters',
  '/industries/field-services',
  '/industries/healthcare',
] as const

const ARTICLES = {
  riddorExplained: '/insights/riddor-reporting-explained',
  accidentBook: '/insights/accident-book-requirements-uk',
  nearMiss: '/insights/near-miss-reporting-safety-culture',
  investigate: '/insights/how-to-investigate-a-workplace-accident',
  loneWorker: '/insights/lone-worker-safety-guide',
  rams: '/insights/rams-risk-assessments-method-statements',
} as const

/** Contextual links each page renders, by source path. */
export const LINK_REGISTRY: Readonly<Record<string, readonly string[]>> = {
  '/': ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/pricing', '/platform/offline', ...INDUSTRY_PATHS],
  '/platform': [MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/platform/offline', '/security', '/pricing', '/demo'],
  [MODULE_PATHS.incidents]: ['/platform', MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/platform/offline', ARTICLES.nearMiss, ARTICLES.investigate, '/toolkit', '/demo'],
  [MODULE_PATHS.riddor]: ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.risk, MODULE_PATHS.permits, ARTICLES.riddorExplained, ARTICLES.accidentBook, '/demo'],
  [MODULE_PATHS.risk]: ['/platform', MODULE_PATHS.permits, MODULE_PATHS.incidents, MODULE_PATHS.riddor, ARTICLES.loneWorker, '/demo'],
  [MODULE_PATHS.permits]: ['/platform', MODULE_PATHS.risk, MODULE_PATHS.incidents, MODULE_PATHS.riddor, ARTICLES.rams, '/demo'],
  '/platform/offline': ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/security', '/demo'],
  '/pricing': ['/platform', '/demo', '/security', '/contact', '/platform/offline'],
  '/security': ['/platform/offline', '/privacy-policy', '/contact', '/demo', '/pricing'],
  '/demo': ['/platform', '/pricing', '/contact', '/security'],
  '/contact': ['/demo', '/security', '/about', '/pricing'],
  '/about': ['/platform', '/security', '/contact', '/demo'],
  // Articles link back to the module they cluster around (flag on only).
  [ARTICLES.riddorExplained]: [MODULE_PATHS.riddor],
  [ARTICLES.accidentBook]: [MODULE_PATHS.riddor],
  [ARTICLES.nearMiss]: [MODULE_PATHS.incidents],
  [ARTICLES.investigate]: [MODULE_PATHS.incidents],
  [ARTICLES.loneWorker]: [MODULE_PATHS.risk],
  [ARTICLES.rams]: [MODULE_PATHS.permits],
  '/toolkit': [MODULE_PATHS.incidents],
  // Industry pages point at the modules instead of denying them.
  ...Object.fromEntries(INDUSTRY_PATHS.map((path) => [path, [MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/platform']])),
}

/** Contextual links a page renders. */
export function linksFrom(path: string): readonly string[] {
  return LINK_REGISTRY[path] ?? []
}

/** Pages whose copy links to `path`. */
export function linksTo(path: string): readonly string[] {
  return Object.entries(LINK_REGISTRY)
    .filter(([, targets]) => targets.includes(path))
    .map(([source]) => source)
}

/** The article that clusters around a module page, if any. */
export function clusterArticlesFor(modulePath: string): readonly string[] {
  return linksFrom(modulePath).filter((href) => href.startsWith('/insights/'))
}

/** The module a page (an article, the toolkit) points back at, if any. */
export function moduleFor(path: string): string | null {
  return linksFrom(path).find((href) => href.startsWith('/platform/')) ?? null
}
