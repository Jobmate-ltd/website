import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ExternalLink } from 'lucide-react'
import { COMPARE_PAGES, EMAIL_SUPPORT, PLATFORM_LAUNCH } from '@/lib/brand'
import { CAP_CODE, COMPARE_PAGES as ALL_COMPARISONS, comparePage, isoDateFromUk, type CompareEdge, type CompareRow, type CompareSource } from '@/lib/compare'
import { COMPARE_PATHS } from '@/lib/seo/links'
import { h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'
import { Chip } from '@/components/ui/chip'
import { Card } from '@/components/ui/card'
import { CtaBand } from '@/components/ui/cta-band'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FaqAccordion } from '@/components/platform/faq-accordion'
import { RowHelp } from '@/components/compare/row-help'

/**
 * ComparePageTemplate: every "jobsafe vs X" page, in the brief's order:
 * breadcrumb, hero (the H1 from the keyword map, the visible "Last checked"
 * date, the one-line honest summary, demo and pricing buttons), "Choose X if
 * / choose jobsafe if", the fifteen-row table with a source and a date on
 * every claim about X, the "Talk to us about moving your records" section,
 * the FAQ, the "How we compare" note citing CAP Code section 3, the other
 * comparisons, the CTA. Driven entirely by the typed content in
 * lib/compare.ts.
 *
 * Everything said about the competitor sits inside an element marked
 * data-claims="competitor", which scripts/claims-check.mjs leaves out of its
 * scan of jobsafe's own claims. Those elements never nest an element of
 * their own tag name.
 *
 * @example
 *   // app/compare/evotix/page.tsx
 *   export default function Page() { return <ComparePageTemplate slug="evotix" /> }
 */

/** The edge marker is text, never colour alone. */
const EDGE: Readonly<Record<CompareEdge, { readonly label: string; readonly status: 'brand' | 'info' | 'neutral' | 'outline' }>> = {
  jobsafe: { label: 'Ours', status: 'brand' },
  them: { label: 'Theirs', status: 'info' },
  even: { label: 'Even', status: 'neutral' },
  depends: { label: 'Depends', status: 'outline' },
}

function EdgeChip({ edge }: { edge: CompareEdge }) {
  const { label, status } = EDGE[edge]
  return (
    <Chip status={status}>
      <span className="sr-only">Edge: </span>
      {label}
    </Chip>
  )
}

/** The competitor's source: the page the claim was read from, and when. Opens in a new tab and says so. */
function SourceLine({ source }: { source: CompareSource }) {
  return (
    <span className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] leading-snug text-ink-5">
      <span>Source:</span>
      <a
        href={source.url}
        target="_blank"
        rel="nofollow noopener"
        className="inline-flex items-center gap-1 rounded-control font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-2 hover:decoration-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {source.label ?? 'the page'}
        <ExternalLink className="size-3" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span>
        checked <time dateTime={isoDateFromUk(source.checked)}>{source.checked}</time>
      </span>
    </span>
  )
}

function JobsafeSourceLink({ row }: { row: CompareRow }) {
  if (!row.jobsafeSource) return null
  return (
    <Link href={row.jobsafeSource.href} className="mt-2 inline-flex items-center gap-1 rounded-control text-[12px] font-semibold text-brand-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
      {row.jobsafeSource.label}
      <ArrowRight className="size-3" aria-hidden="true" />
    </Link>
  )
}

export function ComparePageTemplate({ slug }: { slug: string }) {
  if (!PLATFORM_LAUNCH || !COMPARE_PAGES) notFound()
  const page = comparePage(slug)
  if (!page) notFound()
  const c = page.competitor
  const h1 = h1For(page.path)
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Compare', href: COMPARE_PATHS.hub },
    { name: `jobsafe vs ${c.shortName}`, href: page.path },
  ]
  const siblings = ALL_COMPARISONS.filter((other) => other.slug !== page.slug)
  const schema = jsonLd(graph(breadcrumbSchema(breadcrumbsFromTrail(crumbs))))
  const tableLabel = `jobsafe compared with ${c.shortName}, row by row`

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

        {/* Hero: H1, the visible last-checked date, the honest one-liner, the two buttons */}
        <section className="relative overflow-hidden border-b border-line-1 bg-canvas">
          <HeroBackdrop radial="right" />
          <Container className="relative pb-14 pt-10 md:pb-20 md:pt-14">
            <div className="flex max-w-3xl flex-col gap-6">
              <Breadcrumbs items={crumbs} />
              <div className="flex flex-col gap-4">
                <Eyebrow>Compare</Eyebrow>
                <h1 className="type-display text-ink-1">{h1}</h1>
                <p className="type-small font-semibold text-ink-4">
                  Last checked <time dateTime={isoDateFromUk(page.lastChecked)}>{page.lastChecked}</time>
                </p>
                <p data-claims="competitor" className="type-lead measure text-ink-4">
                  {page.summary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <BookDemoButton placement={`compare-${page.slug}-hero`} size="lg" />
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/pricing">See pricing</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Choose X if / choose jobsafe if */}
        <Section tone="grey">
          <SectionHeading eyebrow="Which one" title={`Choose ${c.shortName}, or choose jobsafe`} lead="Neither list is a verdict. Each is the honest set of reasons a UK operator would pick that product." tone="grey" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Card className="flex flex-col gap-5 p-6 md:p-8">
              <h3 className="type-h3 text-ink-1">Choose {c.shortName} if</h3>
              <ul className="flex flex-col gap-3">
                {page.chooseThem.map((item) => (
                  <li key={item} data-claims="competitor" className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-2">
                    <Check className="mt-1 size-4 shrink-0 text-ink-5" strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="flex flex-col gap-5 border-brand-tint-18 p-6 md:p-8">
              <h3 className="type-h3 text-ink-1">Choose jobsafe if</h3>
              <ul className="flex flex-col gap-3">
                {page.chooseJobsafe.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-2">
                    <Check className="mt-1 size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        {/* The fifteen rows */}
        <Section id="rows" tone="white">
          <SectionHeading
            eyebrow="Side by side"
            title="Fifteen rows, each with a source and a date"
            lead={`The same fifteen rows appear on every jobsafe comparison. Every statement about ${c.shortName} links to the page it was read from and the date it was checked. Hover or focus the info button on a row for what it means.`}
          />

          {/* Small screens: one card per row, so nothing scrolls sideways at 320px */}
          <ol className="mt-10 flex flex-col gap-4 md:hidden" aria-label={tableLabel}>
            {page.rows.map((row) => (
              <li key={row.id} id={`row-${row.id}`}>
                <Card className="flex flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold leading-snug text-ink-1">{row.topic}</h3>
                    <EdgeChip edge={row.edge} />
                  </div>
                  {row.help ? <p className="type-small text-ink-5">{row.help}</p> : null}
                  <dl className="flex flex-col gap-4 border-t border-line-1 pt-4">
                    <div className="flex flex-col gap-1">
                      <dt className="type-eyebrow text-brand-strong">jobsafe</dt>
                      <dd className="flex flex-col items-start text-[15px] leading-relaxed text-ink-2">
                        <span>{row.jobsafe}</span>
                        <JobsafeSourceLink row={row} />
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="type-eyebrow text-ink-4">{c.shortName}</dt>
                      <dd data-claims="competitor" className="flex flex-col items-start text-[15px] leading-relaxed text-ink-2">
                        <span>{row.them}</span>
                        {row.source.quote ? <q className="mt-1.5 text-[13px] leading-snug text-ink-5">{row.source.quote}</q> : null}
                        <SourceLine source={row.source} />
                      </dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ol>

          {/* From md up: the table */}
          <div className="mt-10 hidden md:block">
            <TooltipProvider delayDuration={150}>
              <Table label={tableLabel}>
                <TableCaption>
                  jobsafe and {c.shortName} on the fifteen rows every jobsafe comparison uses. The edge marker says which product has the stronger answer on that row, or that it is even or depends on the product you buy. Each {c.shortName} cell links to its source and shows the date it was checked.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[24%]">Topic</TableHead>
                    <TableHead className="w-[38%] text-brand-strong">jobsafe</TableHead>
                    <TableHead className="w-[38%]">{c.shortName}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {page.rows.map((row) => (
                    <TableRow key={row.id} id={`table-row-${row.id}`}>
                      <th scope="row" className="px-4 py-4 text-left align-top">
                        <span className="flex flex-col items-start gap-2">
                          <span className="inline-flex items-center gap-1 text-[15px] font-bold leading-snug text-ink-1">
                            {row.topic}
                            {row.help ? <RowHelp topic={row.topic} help={row.help} /> : null}
                          </span>
                          <EdgeChip edge={row.edge} />
                        </span>
                      </th>
                      <TableCell className="py-4 align-top">
                        <p className="leading-relaxed text-ink-2">{row.jobsafe}</p>
                        <JobsafeSourceLink row={row} />
                      </TableCell>
                      <TableCell data-claims="competitor" className="py-4 align-top">
                        <p className="leading-relaxed text-ink-2">{row.them}</p>
                        {row.source.quote ? <q className="mt-2 block text-[13px] leading-snug text-ink-5">{row.source.quote}</q> : null}
                        <SourceLine source={row.source} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </Section>

        {/* Moving records */}
        <Section id="switching" tone="grey" divider>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="Moving over" title={page.switching.title} tone="grey" />
            <Card className="flex flex-col gap-4 p-6 md:p-8">
              <p className="type-body text-ink-2">{page.switching.body}</p>
              <p className="type-small border-t border-line-1 pt-4 text-ink-5">
                <Link href="/pricing" className="font-semibold text-brand-strong hover:underline">
                  See pricing
                </Link>{' '}
                for the tiers and what each includes, or{' '}
                <Link href="/demo" className="font-semibold text-brand-strong hover:underline">
                  read how the demo works
                </Link>
                .
              </p>
            </Card>
          </div>
        </Section>

        {/* FAQ */}
        <FaqAccordion items={page.faqs} tone="white" lead={`Straight answers about jobsafe and ${c.shortName}.`} />

        {/* How we compare */}
        <Section id="how-we-compare" tone="grey" rhythm="tight" divider>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="How we compare" title="The rules this page follows" tone="grey" />
            <div className="flex flex-col gap-3 type-small text-ink-4">
              <p>
                The fifteen rows are the same on every jobsafe comparison page. Each statement about {c.name} was read from the page linked beside it on {page.lastChecked}, and is quoted where that page gives a line to quote. We do not rate or score other products, show their screens or use their logos; they are named in plain text. Where {c.shortName} has the stronger answer, the row says so.
              </p>
              <p>
                We follow{' '}
                <a href={CAP_CODE.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-2 hover:decoration-brand-strong">
                  {CAP_CODE.label}, {CAP_CODE.rules}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                . Facts about jobsafe come from the product as it ships today, not from a roadmap. If something here is out of date, email{' '}
                <a href={`mailto:${EMAIL_SUPPORT}`} className="font-semibold text-brand-strong hover:underline">
                  {EMAIL_SUPPORT}
                </a>{' '}
                and we will re-check the row and change the date at the top.
              </p>
            </div>
          </div>
        </Section>

        {/* Other comparisons */}
        <Section tone="white" rhythm="tight" divider>
          <nav aria-label="Other comparisons" className="flex flex-col gap-4">
            <p className="type-eyebrow text-ink-4">Other comparisons</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 type-small">
              <li>
                <Link href={COMPARE_PATHS.hub} className="font-bold text-brand-strong hover:underline">
                  All comparisons
                </Link>
              </li>
              {siblings.map((other) => (
                <li key={other.slug}>
                  <Link href={other.path} className="font-semibold text-ink-4 hover:text-ink-1">
                    jobsafe vs {other.competitor.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/platform" className="font-semibold text-ink-4 hover:text-ink-1">
                  The platform
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="font-semibold text-ink-4 hover:text-ink-1">
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>
        </Section>

        <CtaBand
          tone="grey"
          placement={`compare-${page.slug}-closing`}
          title="See jobsafe on your own setup."
          copy="A 30-minute walkthrough with someone who knows the product, on a UK haulier’s data. Bring your questions about the rows above."
          secondary={{ label: 'How the demo works', href: '/demo' }}
        />
      </main>
      <Footer />
    </>
  )
}

export default ComparePageTemplate
