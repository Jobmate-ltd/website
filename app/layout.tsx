import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { LateWidgets } from '@/components/site/late-widgets'
import { BRAND, ENTRY_PRICE_EX_VAT_LABEL, LEGAL_NAME, PARENT_ORG_URL, SITE_URL, TWITTER_HANDLE } from '@/lib/brand'
import { graph, jsonLd, organizationSchema, websiteSchema } from '@/lib/schema'
import { token } from '@/lib/tokens'
import './globals.css'

/**
 * Manrope for everything, JetBrains Mono for report numbers, dates and
 * regulation references. Both are variable fonts vendored in assets/fonts
 * (SIL OFL; see assets/fonts/LICENSE.md) and served by next/font/local, so
 * a build never reaches Google and never fails on a fetch that does not
 * complete. No request leaves the visitor's browser for a font, either.
 */
const manrope = localFont({
  src: '../assets/fonts/manrope-variable-latin.woff2',
  weight: '200 800',
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: '../assets/fonts/jetbrains-mono-variable-latin.woff2',
  weight: '100 800',
  variable: '--font-jetbrains-mono',
  display: 'swap',
  // Used below the fold only (prices, dates, report numbers): not worth a
  // preload that competes with the hero for bandwidth on a slow phone.
  preload: false,
})

/**
 * Site-wide description. 140–158 characters, quotes the ENTRY price with VAT
 * shown (§5.1), ends on a concrete verb. Enforced by `npm run seo:audit`.
 */
const SITE_DESCRIPTION =
  `Incident reporting software for UK field teams. Works offline, with photo, GPS and timestamp evidence. From ${ENTRY_PRICE_EX_VAT_LABEL} a licence. Start your free trial.`

const SITE_TITLE = `${BRAND} — incident reporting software for UK field teams`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${BRAND}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND,
  authors: [{ name: LEGAL_NAME, url: PARENT_ORG_URL }],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
  // NO `keywords`. Next.js renders it as <meta name="keywords">, which Google
  // has ignored since 2009 and which signals a thin strategy (§5.1, T8).
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
  // Every route sets its own canonical, Open Graph and Twitter block through
  // lib/seo.ts; these are the site-wide defaults they inherit.
  openGraph: {
    siteName: BRAND,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: token('canvas'),
}

/**
 * Organization + WebSite are emitted from the root layout so they are present
 * on every route and every node in the graph can reference them by @id.
 * SoftwareApplication, BreadcrumbList and FAQPage are emitted per page, by the
 * page that owns the corresponding visible content.
 */
const siteGraph = jsonLd(graph(organizationSchema(), websiteSchema()))

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteGraph }} />
      </head>
      {/*
        `pb-[72px] lg:pb-0` reserves the height of <StickyDemoBar />, which is
        fixed to the bottom of small viewports. Desktop has no bar, so no reserve.
      */}
      <body className="flex min-h-full flex-col pb-[72px] lg:pb-0">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-control focus:bg-canvas focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-ink-1 focus:shadow-hover"
        >
          Skip to content
        </a>
        <div id="content" className="flex flex-1 flex-col">
          {children}
        </div>
        <LateWidgets />
      </body>
    </html>
  )
}
