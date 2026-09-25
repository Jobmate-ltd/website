// ─────────────────────────────────────────────────────────────────────────────
// Page metadata builder.
//
// Every route calls `pageMetadata()` so that a self-referencing canonical, the
// Open Graph block and the Twitter card are produced the same way everywhere
// and cannot be forgotten. Per-route images come from the `opengraph-image.tsx`
// file convention (see lib/og.tsx); Next merges those into both og:image and
// twitter:image.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { BRAND, canonicalFor, TWITTER_HANDLE } from '@/lib/brand'

export interface PageSeo {
  /** Path from the site root, e.g. '/about'. '/' for the homepage. */
  readonly path: string
  /** <title> without the site suffix; the root template appends " | jobsafe". */
  readonly title: string
  /** ≤ 160 characters. */
  readonly description: string
  /** Defaults to `${title} | jobsafe`. */
  readonly ogTitle?: string
  readonly ogDescription?: string
  readonly type?: 'website' | 'article'
  /** Article only. ISO date. */
  readonly publishedTime?: string
  readonly modifiedTime?: string
  readonly authors?: readonly string[]
  /** Use the title verbatim, without the template (the homepage). */
  readonly absoluteTitle?: boolean
  readonly noindex?: boolean
}

export function pageMetadata(seo: PageSeo): Metadata {
  const canonical = canonicalFor(seo.path)
  const ogTitle = seo.ogTitle ?? (seo.absoluteTitle ? seo.title : `${seo.title} | ${BRAND}`)
  const ogDescription = seo.ogDescription ?? seo.description

  return {
    title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: BRAND,
      locale: 'en_GB',
      type: seo.type ?? 'website',
      ...(seo.type === 'article'
        ? {
            publishedTime: seo.publishedTime,
            modifiedTime: seo.modifiedTime ?? seo.publishedTime,
            authors: seo.authors ? [...seo.authors] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: ogTitle,
      description: ogDescription,
    },
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
