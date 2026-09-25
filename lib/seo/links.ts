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
  // Phase 3
  investigations: '/platform/investigations',
  actions: '/platform/corrective-actions',
  fleet: '/platform/fleet-compliance',
  training: '/platform/training-competence',
  documents: '/platform/document-control',
  dashboards: '/platform/dashboards',
  bowtie: '/platform/bowtie-analysis',
  // Gated on PHASE_3_INPUTS; the registry lists them so their links are ready the day they exist.
  checklists: '/platform/checklists',
  contractors: '/platform/contractors',
} as const

export const INDUSTRY_PATHS = [
  '/industries/transport-logistics',
  '/industries/window-door-fitters',
  '/industries/field-services',
  '/industries/healthcare',
  // Phase 3
  '/industries/construction',
  '/industries/facilities-management',
  '/industries/manufacturing-warehousing',
] as const

export const TOOL_PATHS = {
  hub: '/tools',
  riddor: '/tools/riddor-checker',
  matrix: '/tools/risk-matrix',
  afr: '/tools/accident-frequency-rate',
} as const

export const COMPARE_PATHS = {
  hub: '/compare',
  mitti: '/compare/mitti-safetyculture',
  evotix: '/compare/evotix',
  ecoonline: '/compare/ecoonline',
} as const

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
  '/': ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/pricing', '/platform/offline', TOOL_PATHS.riddor, TOOL_PATHS.matrix, TOOL_PATHS.afr, ...INDUSTRY_PATHS],
  '/platform': [MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, MODULE_PATHS.investigations, MODULE_PATHS.actions, MODULE_PATHS.fleet, MODULE_PATHS.training, MODULE_PATHS.documents, MODULE_PATHS.dashboards, MODULE_PATHS.bowtie, MODULE_PATHS.checklists, MODULE_PATHS.contractors, '/platform/offline', '/security', '/pricing', TOOL_PATHS.hub, '/demo'],
  [MODULE_PATHS.incidents]: ['/platform', MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, MODULE_PATHS.investigations, MODULE_PATHS.actions, MODULE_PATHS.dashboards, '/platform/offline', ARTICLES.nearMiss, ARTICLES.investigate, '/toolkit', TOOL_PATHS.afr, '/industries/facilities-management', '/industries/field-services', '/demo'],
  [MODULE_PATHS.riddor]: ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.risk, MODULE_PATHS.permits, MODULE_PATHS.investigations, MODULE_PATHS.dashboards, ARTICLES.riddorExplained, ARTICLES.accidentBook, TOOL_PATHS.riddor, TOOL_PATHS.afr, '/demo'],
  [MODULE_PATHS.risk]: ['/platform', MODULE_PATHS.permits, MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.bowtie, MODULE_PATHS.actions, MODULE_PATHS.documents, ARTICLES.loneWorker, TOOL_PATHS.matrix, '/industries/manufacturing-warehousing', '/industries/construction', '/demo'],
  [MODULE_PATHS.permits]: ['/platform', MODULE_PATHS.risk, MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.training, MODULE_PATHS.documents, MODULE_PATHS.contractors, ARTICLES.rams, '/industries/construction', '/industries/facilities-management', '/demo'],
  '/platform/offline': ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.risk, MODULE_PATHS.permits, '/security', '/demo'],
  '/pricing': ['/platform', '/demo', '/security', '/contact', '/platform/offline', COMPARE_PATHS.hub],
  '/security': ['/platform/offline', '/privacy-policy', '/contact', '/demo', '/pricing'],
  '/demo': ['/platform', '/pricing', '/contact', '/security'],
  '/contact': ['/demo', '/security', '/about', '/pricing'],
  '/about': ['/platform', '/security', '/contact', '/demo'],
  // Articles link back to the module they cluster around (flag on only).
  [ARTICLES.riddorExplained]: [MODULE_PATHS.riddor, TOOL_PATHS.riddor],
  [ARTICLES.accidentBook]: [MODULE_PATHS.riddor, TOOL_PATHS.riddor],
  [ARTICLES.nearMiss]: [MODULE_PATHS.incidents],
  [ARTICLES.investigate]: [MODULE_PATHS.investigations],
  [ARTICLES.loneWorker]: [MODULE_PATHS.risk],
  [ARTICLES.rams]: [MODULE_PATHS.permits, TOOL_PATHS.matrix],
  '/toolkit': [MODULE_PATHS.incidents, TOOL_PATHS.hub],
  // Industry pages (Phase 3): the module each of the six pains links, the two tools, the platform and the demo.
  '/industries/transport-logistics': [MODULE_PATHS.fleet, MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.training, MODULE_PATHS.dashboards, TOOL_PATHS.afr, TOOL_PATHS.riddor, '/platform', '/demo'],
  '/industries/construction': [MODULE_PATHS.permits, MODULE_PATHS.risk, MODULE_PATHS.riddor, MODULE_PATHS.training, MODULE_PATHS.investigations, MODULE_PATHS.actions, TOOL_PATHS.riddor, TOOL_PATHS.matrix, '/platform', '/demo'],
  '/industries/field-services': [MODULE_PATHS.incidents, MODULE_PATHS.fleet, MODULE_PATHS.risk, MODULE_PATHS.training, MODULE_PATHS.riddor, MODULE_PATHS.documents, TOOL_PATHS.riddor, TOOL_PATHS.matrix, '/platform', '/demo'],
  '/industries/facilities-management': [MODULE_PATHS.incidents, MODULE_PATHS.permits, MODULE_PATHS.documents, MODULE_PATHS.dashboards, MODULE_PATHS.riddor, MODULE_PATHS.actions, TOOL_PATHS.riddor, TOOL_PATHS.afr, '/platform', '/demo'],
  '/industries/manufacturing-warehousing': [MODULE_PATHS.risk, MODULE_PATHS.fleet, MODULE_PATHS.training, MODULE_PATHS.incidents, MODULE_PATHS.permits, MODULE_PATHS.bowtie, TOOL_PATHS.matrix, TOOL_PATHS.riddor, '/platform', '/demo'],
  '/industries/healthcare': [MODULE_PATHS.incidents, MODULE_PATHS.risk, MODULE_PATHS.training, MODULE_PATHS.documents, MODULE_PATHS.riddor, MODULE_PATHS.actions, TOOL_PATHS.riddor, TOOL_PATHS.matrix, '/platform', '/demo'],
  '/industries/window-door-fitters': [MODULE_PATHS.incidents, MODULE_PATHS.risk, MODULE_PATHS.training, MODULE_PATHS.fleet, MODULE_PATHS.riddor, TOOL_PATHS.riddor, TOOL_PATHS.matrix, '/platform', '/demo'],
  // Phase 3 module pages: the platform, the modules they feed, the tool that fits, the demo.
  [MODULE_PATHS.investigations]: ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.actions, MODULE_PATHS.riddor, MODULE_PATHS.risk, ARTICLES.investigate, '/demo'],
  [MODULE_PATHS.actions]: ['/platform', MODULE_PATHS.investigations, MODULE_PATHS.risk, MODULE_PATHS.bowtie, MODULE_PATHS.permits, MODULE_PATHS.fleet, MODULE_PATHS.training, MODULE_PATHS.dashboards, MODULE_PATHS.checklists, MODULE_PATHS.contractors, '/demo'],
  [MODULE_PATHS.fleet]: ['/platform', MODULE_PATHS.actions, MODULE_PATHS.incidents, MODULE_PATHS.training, MODULE_PATHS.dashboards, MODULE_PATHS.checklists, TOOL_PATHS.afr, '/industries/transport-logistics', '/industries/manufacturing-warehousing', '/demo'],
  [MODULE_PATHS.training]: ['/platform', MODULE_PATHS.actions, MODULE_PATHS.permits, MODULE_PATHS.bowtie, MODULE_PATHS.fleet, MODULE_PATHS.documents, MODULE_PATHS.checklists, '/industries/healthcare', '/industries/construction', '/demo'],
  [MODULE_PATHS.documents]: ['/platform', MODULE_PATHS.risk, MODULE_PATHS.training, MODULE_PATHS.permits, MODULE_PATHS.bowtie, ARTICLES.rams, '/platform/offline', '/demo'],
  [MODULE_PATHS.dashboards]: ['/platform', MODULE_PATHS.incidents, MODULE_PATHS.actions, MODULE_PATHS.riddor, MODULE_PATHS.fleet, TOOL_PATHS.afr, '/industries/facilities-management', '/industries/manufacturing-warehousing', '/demo'],
  [MODULE_PATHS.bowtie]: ['/platform', MODULE_PATHS.risk, MODULE_PATHS.actions, MODULE_PATHS.permits, MODULE_PATHS.training, MODULE_PATHS.documents, TOOL_PATHS.matrix, '/demo'],
  [MODULE_PATHS.checklists]: ['/platform', MODULE_PATHS.actions, MODULE_PATHS.fleet, MODULE_PATHS.incidents, MODULE_PATHS.training, '/demo'],
  [MODULE_PATHS.contractors]: ['/platform', MODULE_PATHS.permits, MODULE_PATHS.actions, MODULE_PATHS.documents, MODULE_PATHS.training, '/demo'],
  // Tools: each links the module that runs the same logic, and both ways with its article.
  [TOOL_PATHS.hub]: [TOOL_PATHS.riddor, TOOL_PATHS.matrix, TOOL_PATHS.afr, '/toolkit', '/platform'],
  [TOOL_PATHS.riddor]: [MODULE_PATHS.riddor, ARTICLES.riddorExplained, ARTICLES.accidentBook, MODULE_PATHS.incidents, TOOL_PATHS.matrix, TOOL_PATHS.afr, TOOL_PATHS.hub, '/demo'],
  [TOOL_PATHS.matrix]: [MODULE_PATHS.risk, MODULE_PATHS.bowtie, ARTICLES.rams, TOOL_PATHS.riddor, TOOL_PATHS.afr, TOOL_PATHS.hub, '/demo'],
  [TOOL_PATHS.afr]: [MODULE_PATHS.incidents, MODULE_PATHS.riddor, MODULE_PATHS.dashboards, '/industries/transport-logistics', TOOL_PATHS.riddor, TOOL_PATHS.matrix, TOOL_PATHS.hub, '/demo'],
  // Comparisons: every page links pricing and the demo; the hub links the three.
  [COMPARE_PATHS.hub]: [COMPARE_PATHS.mitti, COMPARE_PATHS.evotix, COMPARE_PATHS.ecoonline, '/pricing', '/demo', '/platform'],
  [COMPARE_PATHS.mitti]: ['/pricing', '/demo', COMPARE_PATHS.hub, COMPARE_PATHS.evotix, COMPARE_PATHS.ecoonline, MODULE_PATHS.permits, MODULE_PATHS.riddor, '/security', '/platform/offline'],
  [COMPARE_PATHS.evotix]: ['/pricing', '/demo', COMPARE_PATHS.hub, COMPARE_PATHS.mitti, COMPARE_PATHS.ecoonline, MODULE_PATHS.fleet, MODULE_PATHS.riddor, '/security', '/platform/offline'],
  [COMPARE_PATHS.ecoonline]: ['/pricing', '/demo', COMPARE_PATHS.hub, COMPARE_PATHS.mitti, COMPARE_PATHS.evotix, MODULE_PATHS.fleet, MODULE_PATHS.permits, '/security', '/platform/offline'],
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

/** The registry, minus pages that do not exist in this flag state (gated modules, comparisons). */
export function registryFor(exists: (path: string) => boolean): Readonly<Record<string, readonly string[]>> {
  return Object.fromEntries(
    Object.entries(LINK_REGISTRY)
      .filter(([source]) => exists(source))
      .map(([source, targets]) => [source, targets.filter(exists)]),
  )
}

/** The article that clusters around a module page, if any. */
export function clusterArticlesFor(modulePath: string): readonly string[] {
  return linksFrom(modulePath).filter((href) => href.startsWith('/insights/'))
}

/** The module a page (an article, the toolkit) points back at, if any. */
export function moduleFor(path: string): string | null {
  return linksFrom(path).find((href) => href.startsWith('/platform/')) ?? null
}
