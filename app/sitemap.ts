import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/insights'
import { CANONICAL_HOME, SITE_URL } from '@/lib/brand'

/**
 * XML sitemap.
 *
 * The previous implementation listed `/#features`, `/#pricing`, `/#industries`
 * and `/#faq`. A URL fragment is not a URL. The sitemaps protocol has no
 * concept of one; Google strips the fragment, sees four duplicates of the
 * homepage, and the file loses whatever signal it was meant to carry. They are
 * removed here, not rewritten.
 *
 * Those four anchors want to be real routes. Until they are (P1: the seven
 * industry pages and a real `/pricing`), the homepage is the only thing that
 * exists and the sitemap says so honestly.
 *
 * Only add a URL here once it returns 200, renders server-side, and carries a
 * self-referential canonical (§10, Definition of done).
 */

interface Route {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

/** Static marketing routes. Extend as the architecture in §4 lands. */
const ROUTES: readonly Route[] = [
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/industries/window-door-fitters', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/industries/healthcare', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/industries/field-services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/academy', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/insights', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: CANONICAL_HOME,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/insights/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
