import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'JobSafe — Workplace Incident Reporting Software',
    template: '%s | JobSafe',
  },
  description: 'JobSafe helps field service and industrial teams capture incidents in seconds, improve HSSE compliance, and build a stronger safety culture. Offline-capable, ISO 45001 aligned, from £2.99 per licence.',
  metadataBase: new URL('https://www.jobsafe.cloud'),
  keywords: [
    'incident reporting software UK',
    'HSSE reporting software',
    'workplace incident reporting app',
    'near miss reporting software',
    'field service safety software',
    'health and safety reporting app UK',
    'ISO 45001 software',
    'safety management software UK',
    'digital incident reporting',
    'lone worker safety app',
    'construction safety software',
    'facilities management safety',
    'RIDDOR reporting software',
    'HSE compliance software',
    'safety incident tracker',
  ],
  authors: [{ name: 'Jobmate Ltd', url: 'https://jobmate.cloud' }],
  creator: 'Jobmate Ltd',
  publisher: 'Jobmate Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'JobSafe — Workplace Incident Reporting Software',
    description: 'Record. Resolve. Prevent. The fastest way to capture and manage workplace incidents. HSSE compliant, offline-capable, from £2.99 per licence.',
    url: 'https://www.jobsafe.cloud',
    siteName: 'JobSafe',
    images: [
      {
        url: '/images/jobsafe_logo-removebg-preview.png',
        width: 1200,
        height: 630,
        alt: 'JobSafe — Workplace Incident Reporting Software',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobSafe — Workplace Incident Reporting Software',
    description: 'Record. Resolve. Prevent. HSSE compliant incident reporting from £2.99 per licence.',
    images: ['/images/jobsafe_logo-removebg-preview.png'],
  },
  alternates: {
    canonical: 'https://www.jobsafe.cloud',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'JobSafe',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'iOS, Android, Web',
              description: 'Workplace incident reporting software for field service and industrial teams. HSSE compliant, offline-capable, ISO 45001 aligned.',
              url: 'https://www.jobsafe.cloud',
              offers: {
                '@type': 'Offer',
                price: '2.99',
                priceCurrency: 'GBP',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '2.99',
                  priceCurrency: 'GBP',
                  unitText: 'per licence per month',
                },
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '47',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Jobmate Ltd',
                url: 'https://jobmate.cloud',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.jobsafe.cloud/images/jobsafe_logo-removebg-preview.png',
                },
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
