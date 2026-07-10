import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nothing under /api/ is a document. Keep it out of the crawl budget
        // and out of the index (§5.3).
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
