import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import MotionProvider from '@/components/MotionProvider'
import LaunchTicker from '@/components/sections/LaunchTicker'
import ChatWidget from '@/components/ChatWidget'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'jobsafe — Workplace Incident Reporting Software',
    template: '%s | jobsafe',
  },
  description: 'Incident reporting for field teams & transport operators. HSSE compliant, offline-capable, ISO 45001 aligned. From £2.75/licence.',
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
    title: 'jobsafe — Workplace Incident Reporting Software',
    description: 'Record. Resolve. Prevent. The fastest way to capture and manage workplace incidents. HSSE compliant, offline-capable, from £2.75 per licence.',
    url: 'https://www.jobsafe.cloud',
    siteName: 'jobsafe',
    images: [
      {
        url: '/images/og-image.png',
        width: 1203,
        height: 633,
        alt: 'jobsafe — Workplace Incident Reporting Software',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jobsafecloud',
    title: 'jobsafe — Workplace Incident Reporting Software',
    description: 'Record. Resolve. Prevent. HSSE compliant incident reporting from £2.75 per licence.',
    images: ['/images/og-image.png'],
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
              name: 'jobsafe',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'iOS, Android, Web',
              description: 'Workplace incident reporting software for field service and industrial teams. HSSE compliant, offline-capable, ISO 45001 aligned.',
              url: 'https://www.jobsafe.cloud',
              offers: {
                '@type': 'Offer',
                price: '2.75',
                priceCurrency: 'GBP',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '2.75',
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
        {/*
          SearchAtlas OTTO dynamic-optimization pixel. Rendered verbatim in <head>
          via the root layout so it loads on every route and persists across
          client-side navigation. Spread with a cast because `nowprocket` and
          `nitro-exclude` are non-standard attributes React's JSX types reject; the
          uuid, src and other attribute values are unchanged.
        */}
        <script
          {...({
            nowprocket: '',
            'nitro-exclude': '',
            type: 'text/javascript',
            id: 'sa-dynamic-optimization',
            'data-uuid': '09a87fea-bb62-4d82-a03e-d09e7a4ad5b2',
            src: 'data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjA5YTg3ZmVhLWJiNjItNGQ4Mi1hMDNlLWQwOWU3YTRhZDViMiI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw==',
          } as unknown as React.ScriptHTMLAttributes<HTMLScriptElement>)}
        />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col`}>
        <LaunchTicker />
        <MotionProvider>{children}</MotionProvider>
        <ChatWidget />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KB69331C7J"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KB69331C7J');
          `}
        </Script>
      </body>
    </html>
  )
}
