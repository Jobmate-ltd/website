import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://www.jobsafe.cloud/sitemap.xml',
    host: 'https://www.jobsafe.cloud',
  }
}
