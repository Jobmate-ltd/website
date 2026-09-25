// ─────────────────────────────────────────────────────────────────────────────
// The keyword map, typed. The data lives in content/seo/keyword-map.json so
// it can be diffed and updated without touching code; this module gives it
// a shape and the two lookups everything else needs.
//
// A row has a post-launch title / description / H1 and, for a page that
// exists before the platform launches, a `prelaunch` variant. `rowFor()`
// returns whichever applies to the flag state it is given. Node's test runner
// imports this file directly, so keep the imports relative and erasable.
// ─────────────────────────────────────────────────────────────────────────────

import map from '../../content/seo/keyword-map.json' with { type: 'json' }

export interface Keyword {
  readonly keyword: string
  /** UK monthly searches; null when the tool had no figure. */
  readonly volume: number | null
  readonly kd?: number | null
}

export interface SeoCopy {
  /** The full <title>, exactly as it should render. */
  readonly title: string
  readonly description: string
  readonly h1: string
}

export interface KeywordRow extends SeoCopy {
  readonly path: string
  /** The phase the page arrives in. Phase 2+ pages are 404 while the flag is off. */
  readonly phase: 1 | 2 | 3 | 4
  readonly primary: Keyword
  readonly supporting: readonly Keyword[]
  /** "People also ask" questions the page's FAQ must answer, answer-first. */
  readonly paa?: readonly string[]
  /** How the page renders while NEXT_PUBLIC_PLATFORM_LAUNCH is off. */
  readonly prelaunch?: SeoCopy
}

export const KEYWORD_ROWS: readonly KeywordRow[] = map.rows as readonly KeywordRow[]

export function findRow(path: string): KeywordRow | undefined {
  return KEYWORD_ROWS.find((row) => row.path === path)
}

/**
 * The copy a page must render for the given flag state, or null if the page
 * does not exist in that state (a Phase 2 page with the flag off).
 */
export function rowFor(path: string, platformLaunched: boolean): SeoCopy | null {
  const row = findRow(path)
  if (!row) return null
  if (platformLaunched) return { title: row.title, description: row.description, h1: row.h1 }
  if (row.prelaunch) return row.prelaunch
  return row.phase === 1 ? { title: row.title, description: row.description, h1: row.h1 } : null
}

/** Paths that only exist once the platform has launched. */
export function launchOnlyPaths(): readonly string[] {
  return KEYWORD_ROWS.filter((row) => row.phase >= 2 && !row.prelaunch).map((row) => row.path)
}
