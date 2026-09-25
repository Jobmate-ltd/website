import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CalendarCheck, ListChecks, Scale, ShieldCheck } from 'lucide-react'
import { COMPARE_PAGES, PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { CAP_CODE, COMPARE_PAGES as ALL_COMPARISONS, isoDateFromUk } from '@/lib/compare'
import { COMPARE_PATHS } from '@/lib/seo/links'
import { buildMetadata, h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, itemListSchema, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { CtaBand } from '@/components/ui/cta-band'

const PATH = COMPARE_PATHS.hub

/** Phase 3 comparison hub; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH and NEXT_PUBLIC_COMPARE_PAGES are both on. */
export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Compare', href: PATH },
]

const METHOD: readonly { readonly icon: React.ReactNode; readonly title: string; readonly body: string }[] = [
  { icon: <ListChecks />, title: 'The same fifteen rows', body: 'UK hosting, prices in pounds, VAT, RIDDOR, permits, fleet, offline, free plan or demo, implementation fee, AI, company sign-in, integrations, lone worker, COSHH and security certifications. Every page, the same order.' },
  { icon: <ShieldCheck />, title: 'A source and a date on every claim', body: 'Each statement about the other product links to the page it was read from and shows the date it was checked. Where the page gives a line to quote, we quote it.' },
  { icon: <Scale />, title: 'Where they are stronger, we say so', body: 'Each row carries an edge marker: ours, theirs, even or depends. A row where the other product has the better answer says so in plain text.' },
  { icon: <CalendarCheck />, title: 'Re-checked, and dated', body: 'The pricing and product pages we compare against are monitored for change. When one changes, the row is re-checked and the date at the top of the page moves.' },
]

export default function Page() {
  if (!PLATFORM_LAUNCH || !COMPARE_PAGES) notFound()
  const lastChecked = ALL_COMPARISONS.map((page) => page.lastChecked).sort((a, b) => isoDateFromUk(b).localeCompare(isoDateFromUk(a)))[0]
  const schema = jsonLd(
    graph(
      itemListSchema(
        'jobsafe comparisons',
        ALL_COMPARISONS.map((page) => ({ name: `jobsafe vs ${page.competitor.name}`, url: canonicalFor(page.path) })),
      ),
      breadcrumbSchema(breadcrumbsFromTrail(CRUMBS)),
    ),
  )
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={CRUMBS} />}
          eyebrow="Compare"
          title={h1For(PATH)}
          lead="Three comparisons, each with the same fifteen rows, a source and a date on every claim about the other product, and the rows where the other product is stronger stated plainly."
          actions={
            <>
              <BookDemoButton placement="compare-hub-hero" size="lg" />
              <Button variant="secondary" size="lg" asChild>
                <Link href="/pricing">See pricing</Link>
              </Button>
            </>
          }
          note={
            <>
              Last checked <time dateTime={isoDateFromUk(lastChecked)}>{lastChecked}</time>. Comparisons follow{' '}
              <a href={CAP_CODE.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-2 hover:decoration-brand-strong">
                {CAP_CODE.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              , {CAP_CODE.rules}.
            </>
          }
        />

        <Section id="method" tone="white">
          <SectionHeading eyebrow="How the comparisons are made" title="Fifteen rows, sourced, dated and re-checked" lead="A comparison is only useful if you can check it. Every one of these can be." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((item) => (
              <li key={item.title}>
                <Card className="flex h-full flex-col gap-3 p-5">
                  <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">{item.icon}</span>
                  <p className="text-base font-bold text-ink-1">{item.title}</p>
                  <p className="type-small text-ink-4">{item.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="comparisons" tone="grey">
          <SectionHeading eyebrow="The comparisons" title="jobsafe against the products UK teams shortlist" tone="grey" lead="Each page opens with the honest one-line summary below, then the two lists of reasons, then the fifteen rows." />
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {ALL_COMPARISONS.map((page) => (
              <li key={page.slug}>
                <Link href={page.path} className="flex h-full flex-col gap-4 rounded-control border border-line-1 bg-canvas p-6 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <span className="type-eyebrow text-ink-4">
                    Last checked <time dateTime={isoDateFromUk(page.lastChecked)}>{page.lastChecked}</time>
                  </span>
                  <span className="type-h3 text-ink-1">jobsafe vs {page.competitor.name}</span>
                  <p data-claims="competitor" className="type-small text-ink-4">
                    {page.summary}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-brand-strong">
                    Read the comparison
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="jobsafe-side" tone="white" divider>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="Our side of the table" title="What jobsafe brings to every row" />
            <Card className="flex flex-col gap-4 p-6 md:p-8">
              <p className="type-body text-ink-2">
                The jobsafe column is the same on every page because the product is the same:{' '}
                <Link href="/platform" className="font-semibold text-brand-strong hover:underline">
                  one platform
                </Link>{' '}
                hosted in the London region, working offline in every module, with RIDDOR triage and deadlines built in, permits gated on the contractor and a live risk assessment, and MOT, tax, insurance, service and LOLER dates on every vehicle and machine.
              </p>
              <p className="type-body text-ink-2">
                Prices are quoted in pounds per user per month with VAT shown separately; no price list is published yet, so the{' '}
                <Link href="/pricing" className="font-semibold text-brand-strong hover:underline">
                  pricing page
                </Link>{' '}
                shows the tiers and what each includes, and the numbers come from a{' '}
                <Link href="/demo" className="font-semibold text-brand-strong hover:underline">
                  30-minute demo
                </Link>
                .
              </p>
              <p className="type-small border-t border-line-1 pt-4 text-ink-5">
                jobsafe holds no security certification and claims none; it has no AI features and no company sign-in yet. Those rows say so on every page.
              </p>
            </Card>
          </div>
        </Section>

        <CtaBand tone="grey" placement="compare-hub-closing" title="Bring the shortlist to the demo." copy="Thirty minutes, on a UK haulier’s setup, with someone who can answer every row above for your sites." secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}
