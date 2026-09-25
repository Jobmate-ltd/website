// ─────────────────────────────────────────────────────────────────────────────
// Metadata for a page, from the keyword map.
//
//   export const metadata = buildMetadata('/platform/riddor')
//
// `buildMetadata()` looks the path up in content/seo/keyword-map.json, picks
// the pre-launch or post-launch row for the current flag state, and hands it
// to `pageMetadata()` (lib/seo/metadata.ts), which produces the canonical,
// Open Graph and Twitter blocks the same way for every route. The title is
// used verbatim (`absolute`), so what the map says is what the tab shows.
//
// A page that is not in the map keeps calling `pageMetadata()` directly with
// its own copy; the audit accepts either. A Phase 2 page with the flag off
// returns `notFound()` from its component, so its metadata is never served.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { isPlatformLaunched } from '@/lib/brand'
import { pageMetadata, type PageSeo } from '@/lib/seo/metadata'
import { findRow, rowFor } from '@/lib/seo/keyword-map'

export { pageMetadata } from '@/lib/seo/metadata'
export type { PageSeo } from '@/lib/seo/metadata'
export { KEYWORD_ROWS, findRow, rowFor, launchOnlyPaths } from '@/lib/seo/keyword-map'
export type { KeywordRow, SeoCopy, Keyword } from '@/lib/seo/keyword-map'

export function buildMetadata(path: string, overrides: Partial<Omit<PageSeo, 'path' | 'title' | 'description'>> = {}): Metadata {
  const row = findRow(path)
  if (!row) throw new Error(`buildMetadata: ${path} is not in content/seo/keyword-map.json`)
  const copy = rowFor(path, isPlatformLaunched()) ?? { title: row.title, description: row.description, h1: row.h1 }
  return pageMetadata({
    path,
    title: copy.title,
    description: copy.description,
    absoluteTitle: true,
    ogTitle: copy.title,
    ...overrides,
  })
}

/** The H1 a page must render for the current flag state. */
export function h1For(path: string): string {
  const copy = rowFor(path, isPlatformLaunched())
  if (!copy) throw new Error(`h1For: ${path} has no row for this flag state`)
  return copy.h1
}
