import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PHONE_DISPLAY, PHONE_HREF, PLATFORM_LAUNCH } from '@/lib/brand'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'

/**
 * The 404 page, server-rendered inside the root layout.
 *
 * Without this file a route that calls `notFound()` (every Phase 2 page while
 * NEXT_PUBLIC_PLATFORM_LAUNCH is off) prerenders as Next's client-side error
 * shell: an empty <body>, no `lang`, no fonts, until JavaScript runs. This
 * page gives those URLs, and any mistyped one, the same header, footer and
 * type as the rest of the site. It carries no links to pages that do not
 * exist in the current flag state.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

const PLACES = [
  { href: '/', label: 'Home' },
  { href: '/insights', label: 'Insights' },
  { href: '/academy', label: 'Academy' },
  { href: '/toolkit', label: 'Toolkit' },
  { href: '/about', label: 'About' },
] as const

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero container="narrow" eyebrow="404" title="That page is not here." lead="The address may be mistyped, or the page has moved. Nothing has been lost on your side." />
        <Section container="narrow">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/">
                  Back to the homepage
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              {PLATFORM_LAUNCH ? (
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/platform">See the platform</Link>
                </Button>
              ) : null}
            </div>
            <nav aria-label="Other places to go">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {PLACES.map((place) => (
                  <li key={place.href}>
                    <Link href={place.href} className="inline-flex min-h-11 items-center text-sm font-bold text-brand-strong hover:underline focus-visible:outline-none focus-visible:underline">
                      {place.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="type-small text-ink-4">
              If you followed a link from somewhere else, tell us and we will fix it:{' '}
              <a href={PHONE_HREF} className="font-semibold text-ink-1 underline decoration-line-1 underline-offset-4 hover:decoration-ink-1">
                {PHONE_DISPLAY}
              </a>
              .
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
