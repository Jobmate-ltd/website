import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/insights'
import { canonicalFor, isPlatformLaunched, SITE_URL } from '@/lib/brand'
import { isoDate, publicRoutes } from '@/lib/routes'

/**
 * XML sitemap, built from the route manifest in lib/routes.ts and the
 * insights posts in lib/insights.ts.
 *
 * `lastModified` is the date the content last changed — never the build time.
 * Fragment URLs (`/#pricing`) are not URLs and are never listed. Phase 2
 * routes are held back until NEXT_PUBLIC_PLATFORM_LAUNCH is true.
 *
 * Only add a route once it returns 200, renders server-side, and carries a
 * self-referential canonical (§10, Definition of done).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicRoutes(isPlatformLaunched()).map((route) => ({
      url: canonicalFor(route.path),
      lastModified: isoDate(route.updated),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/insights/${post.slug}`,
      lastModified: isoDate(post.updated ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
