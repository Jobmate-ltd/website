import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Download, LayoutGrid, Wrench } from 'lucide-react'
import { PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { TOOL_PATHS } from '@/lib/seo/links'
import { TOOLS } from '@/lib/tools'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, itemListSchema, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { CtaBand } from '@/components/ui/cta-band'

const PATH = TOOL_PATHS.hub

/** Phase 3 hub for the free tools; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on. */
export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Free tools', href: PATH },
]

const cardClass = 'flex h-full flex-col gap-3 rounded-control border border-line-1 bg-canvas p-6 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  const schema = jsonLd(
    graph(
      itemListSchema(
        'Free health and safety tools',
        TOOLS.map((tool) => ({ name: tool.name, url: canonicalFor(tool.path) })),
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
          eyebrow="Free tools"
          title={h1For(PATH)}
          lead="Three calculators that run the platform’s own rules: the RIDDOR triage, the 5×5 risk scoring and the accident frequency rate formula tenders ask for. Each one is copied from the product code and tested against it, so what it tells you is what the app would."
          actions={
            <>
              <BookDemoButton placement="tool-hub-hero" size="lg" />
              <Button variant="secondary" size="lg" asChild>
                <Link href="/platform#tour">See how it works</Link>
              </Button>
            </>
          }
        />

        <Section id="tools" tone="white">
          <SectionHeading eyebrow="The tools" title="Three tools, one set of rules" lead="No sign-up, nothing stored. The RIDDOR checker and the matrix keep their answers in the address bar so a result can be shared." />
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <li key={tool.slug}>
                <Link href={tool.path} className={cardClass}>
                  <span className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                      <Wrench className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className="text-lg font-bold leading-snug text-ink-1">{tool.name}</span>
                  <span className="type-small text-ink-4">{tool.short}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-brand-strong">
                    Open the tool <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="more" tone="grey" divider>
          <SectionHeading eyebrow="Also free" title="The PDF toolkit, and the platform behind the tools" tone="grey" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Link href="/toolkit" className={cardClass}>
              <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                <Download className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold leading-snug text-ink-1">The PDF toolkit</span>
              <span className="type-small text-ink-4">The site incident and near-miss reporting toolkit: the report template, the RIDDOR flowchart and near-miss triage, as a seven-page PDF to print for the cab or the site office.</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-brand-strong">
                Get the toolkit <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
            <Link href="/platform" className={cardClass}>
              <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                <LayoutGrid className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold leading-snug text-ink-1">The platform</span>
              <span className="type-small text-ink-4">Where these rules run for real: incidents, RIDDOR, risk assessments with bowtie, permits, fleet, training and documents in one record, offline-first and hosted in London.</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-brand-strong">
                See the platform <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </Section>

        <CtaBand tone="white" placement="tool-hub-closing" title="See the same rules on your own sites." copy="A 30-minute walkthrough with someone who knows the product, on a UK haulier’s data." secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}
