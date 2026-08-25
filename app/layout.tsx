import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import MotionProvider from '@/components/MotionProvider'
import ChatWidget from '@/components/ChatWidget'
import StickyDemoBar from '@/components/StickyDemoBar'
import GrainOverlay from '@/components/GrainOverlay'
import {
  CANONICAL_HOME,
  ENTRY_PRICE_LABEL,
  LEGAL_NAME,
  OG_IMAGE,
  PARENT_ORG_URL,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/brand'
import { graph, jsonLd, organizationSchema, websiteSchema } from '@/lib/schema'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

/**
 * Site-wide description. 140–158 characters, quotes the ENTRY price (§5.1),
 * ends on a concrete verb. Enforced by `npm run seo:audit`.
 */
const SITE_DESCRIPTION =
  `Incident reporting for UK construction, field and transport teams. HSSE compliant, offline-capable and ISO 45001 aligned. From ${ENTRY_PRICE_LABEL} per licence. Start free.`

export const metadata: Metadata = {
  title: {
    default: 'jobsafe — Workplace Incident Reporting Software',
    template: '%s | jobsafe',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),

  // NO `keywords`. Next.js renders it as <meta name="keywords">, which Google
  // has ignored since 2009 and which signals a thin strategy to any human
  // auditor. Removed sitewide (§5.1, defect T8).

  authors: [{ name: LEGAL_NAME, url: PARENT_ORG_URL }],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
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
    description: `Record. Resolve. Prevent. The fastest way to capture and manage workplace incidents. HSSE compliant, offline-capable, from ${ENTRY_PRICE_LABEL} per licence.`,
    url: CANONICAL_HOME,
    siteName: 'jobsafe',
    images: [
      {
        url: OG_IMAGE.path,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'jobsafe — Workplace Incident Reporting Software',
    description: `Record. Resolve. Prevent. HSSE compliant incident reporting from ${ENTRY_PRICE_LABEL} per licence.`,
    images: [OG_IMAGE.path],
  },
  alternates: {
    // Trailing slash: self-referential and exact against what is served and
    // against the GSC property `https://www.jobsafe.cloud/` (defect T6).
    canonical: CANONICAL_HOME,
  },
}

/**
 * Organization + WebSite are emitted from the root layout so they are present
 * on every route and every node in the graph can reference them by @id.
 * SoftwareApplication and FAQPage are emitted per-page, by the page that owns
 * the corresponding visible content.
 */
const siteGraph = jsonLd(graph(organizationSchema(), websiteSchema()))

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: siteGraph }}
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
      {/*
        `pb-[72px] lg:pb-0`: reserves the height of <StickyDemoBar />, which is
        fixed to the bottom of small viewports and would otherwise sit over the
        last rows of the footer. Desktop has no bar, so no reserve.
      */}
      <body className={`${geist.variable} flex min-h-full flex-col pb-[72px] lg:pb-0`}>
        <GrainOverlay />
        <MotionProvider>{children}</MotionProvider>
        <ChatWidget />
        <StickyDemoBar />
        <SpeedInsights />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-72H4Q5HDVL"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-72H4Q5HDVL');
          `}
        </Script>
      </body>
    </html>
  )
}
