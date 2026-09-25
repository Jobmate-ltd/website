// ─────────────────────────────────────────────────────────────────────────────
// The free tools (Phase 3): the shared definitions the hub, the three tool
// pages and the tests read. Everything here is data or a pure helper; the
// product's own logic lives in lib/product-logic/ (generated, never edited)
// and the tools wrap it. Node's test runner imports this file directly, so
// the imports stay relative and the file stays free of React.
// ─────────────────────────────────────────────────────────────────────────────

import { TOOL_PATHS, linksFrom } from '../seo/links.ts'

export type ToolSlug = 'riddor-checker' | 'risk-matrix' | 'accident-frequency-rate'

export interface ToolDef {
  readonly slug: ToolSlug
  readonly path: string
  /** The name on the hub card, in the "Other free tools" row and in schema. */
  readonly name: string
  /** One line for the hub card. */
  readonly short: string
  /** The WebApplication node's description. */
  readonly description: string
}

export const TOOLS: readonly ToolDef[] = [
  {
    slug: 'riddor-checker',
    path: TOOL_PATHS.riddor,
    name: 'RIDDOR checker',
    short: 'Answer a few questions and see whether an incident is reportable, which category it falls in and the date the report must reach HSE.',
    description: 'A decision-tree checker that runs the RIDDOR 2013 triage jobsafe applies to every incident report: category, reasons, deadline and where to report.',
  },
  {
    slug: 'risk-matrix',
    path: TOOL_PATHS.matrix,
    name: '5×5 risk matrix calculator',
    short: 'Pick likelihood and severity, read the score and the band, and check which level of the hierarchy of control you are relying on.',
    description: 'An interactive 5×5 risk matrix using the likelihood and severity scales, bands and hierarchy of control from jobsafe risk assessments.',
  },
  {
    slug: 'accident-frequency-rate',
    path: TOOL_PATHS.afr,
    name: 'Accident frequency rate calculator',
    short: 'Reportable injuries against hours worked, with the formula shown, for pre-qualification questionnaires and tenders.',
    description: 'Calculates an accident frequency rate per 100,000 hours worked from reportable injuries and hours, with the working shown and the conventions explained.',
  },
] as const

export function toolByPath(path: string): ToolDef {
  const tool = TOOLS.find((t) => t.path === path)
  if (!tool) throw new Error(`No free tool at ${path}`)
  return tool
}

export function toolBySlug(slug: ToolSlug): ToolDef {
  return toolByPath(TOOLS.find((t) => t.slug === slug)?.path ?? '')
}

/** HSE's plain-English guide to risk assessment, linked from the matrix page. */
export const HSE_RISK_URL = 'https://www.hse.gov.uk/simple-health-safety/risk/' as const

/** Labels for the industry pages a tool links to, matching lib/site.ts. */
export const INDUSTRY_LABELS: Readonly<Record<string, string>> = {
  '/industries/transport-logistics': 'Transport & logistics',
  '/industries/construction': 'Construction',
  '/industries/field-services': 'Field services',
  '/industries/facilities-management': 'Facilities management',
  '/industries/manufacturing-warehousing': 'Manufacturing & warehousing',
  '/industries/healthcare': 'Healthcare',
  '/industries/window-door-fitters': 'Window & door fitters',
}

/**
 * Module pages the registry links that are not modules in lib/platform.ts
 * (the bowtie page is a view inside risk assessments, not a twelfth module).
 * The shell renders these with the label here so no declared link is dropped.
 */
export const MODULE_LABELS: Readonly<Record<string, { readonly name: string; readonly promise: string }>> = {
  '/platform/bowtie-analysis': {
    name: 'Bowtie analysis',
    promise: 'Threats, consequences and the barriers between them, inside the risk assessment.',
  },
}

export interface LinkGroups {
  /** Module pages: the "Built from the product" cards. */
  readonly modules: readonly string[]
  /** Insights articles: the "Read more" cards. */
  readonly articles: readonly string[]
  /** Industry pages: "Where it is used". */
  readonly industries: readonly string[]
  /** The sibling tools and the hub: the "Other free tools" row. */
  readonly tools: readonly string[]
  /** The demo page: the closing CTA's secondary link. */
  readonly demo: boolean
  /** Anything the groups above do not cover, rendered as plain links so nothing declared is missed. */
  readonly other: readonly string[]
}

/**
 * Splits a tool page's registry links (lib/seo/links.ts) into the places the
 * shared shell renders them. Every declared link lands in exactly one group,
 * so `scripts/seo-check.mjs` finds each one inside <main>.
 */
export function partitionLinks(path: string): LinkGroups {
  const links = linksFrom(path)
  const modules: string[] = []
  const articles: string[] = []
  const industries: string[] = []
  const tools: string[] = []
  const other: string[] = []
  let demo = false
  for (const href of links) {
    if (href === '/demo') demo = true
    else if (href.startsWith('/platform/')) modules.push(href)
    else if (href.startsWith('/insights/')) articles.push(href)
    else if (href.startsWith('/industries/')) industries.push(href)
    else if (href === TOOL_PATHS.hub || href.startsWith(`${TOOL_PATHS.hub}/`)) tools.push(href)
    else other.push(href)
  }
  return { modules, articles, industries, tools, demo, other }
}

/** `YYYY-MM-DD` → `DD/MM/YYYY`, the site's date format. Anything else is returned as given. */
export function formatUkDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}

/**
 * Formats a number the way the tools show them: thousands separated with
 * commas, a fixed number of decimals. Deterministic on the server and in the
 * browser, unlike locale formatting.
 */
export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return ''
  const fixed = Math.abs(value).toFixed(decimals)
  const [whole, fraction] = fixed.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${value < 0 ? '-' : ''}${grouped}${fraction ? `.${fraction}` : ''}`
}
