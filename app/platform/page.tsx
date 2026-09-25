import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Accessibility, ArrowRight, Download, MapPin, Users, WifiOff } from 'lucide-react'
import { PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { FAMILIES, MODULES, type Family } from '@/lib/platform'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd, platformApplicationSchema } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { CtaBand } from '@/components/ui/cta-band'
import { PlatformIcon } from '@/components/platform/icons'
import { ProductShot } from '@/components/platform/product-shot'
import { ModuleLoop } from '@/components/platform/module-loop'
import { ProductTour } from '@/components/platform/product-tour'

const PATH = '/platform'

export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Platform', href: PATH },
]

const GUARANTEES = [
  { icon: <WifiOff />, title: 'Works offline', body: 'Every module saves to the phone first and syncs itself.', href: '/platform/offline' },
  { icon: <MapPin />, title: 'Hosted in London', body: 'UK region, each organisation walled off, private files.', href: '/security' },
  { icon: <Accessibility />, title: 'WCAG 2.2 AA', body: 'Tested at 320px, with a keyboard and a screen reader.', href: '/platform/offline#gloves' },
  { icon: <Users />, title: 'Roles and multi-site', body: 'Six role levels across your sites and depots.', href: '/security#access' },
  { icon: <Download />, title: 'CSV export', body: 'Every register exports. Nothing is locked in.', href: '/security#access' },
] as const

const FAMILY_ORDER: readonly Family[] = ['record', 'resolve', 'prevent']

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  const schema = jsonLd(graph(platformApplicationSchema(canonicalFor(PATH)), breadcrumbSchema(breadcrumbsFromTrail(CRUMBS))))
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={CRUMBS} />}
          eyebrow="The platform"
          title={h1For(PATH)}
          lead="Every incident, risk, permit and certificate in one record. Health and safety management software for UK operators: report, investigate and act; assess, permit and train; all of it offline-first and hosted in London."
          actions={
            <>
              <BookDemoButton placement="platform-hero" size="lg" />
              <Button variant="secondary" size="lg" asChild>
                <Link href="#tour">Take the tour</Link>
              </Button>
            </>
          }
          media={<ProductShot id="dashboard-hero-desktop" frame priority />}
        />

        <Section id="loop" tone="white">
          <SectionHeading eyebrow="One record" title="Twelve modules around one record" lead="Nothing is re-typed. A failed checklist item, a hazard, a permit or an incident becomes the next thing in the loop on its own." />
          <div className="mt-10">
            <ModuleLoop />
          </div>
        </Section>

        <Section id="modules" tone="grey">
          <SectionHeading eyebrow="Modules" title="What is in the platform today" lead="Grouped the way the work is grouped. A module marked Expanding ships part of what it will; the pages that are not linked yet arrive with Phase 3." tone="grey" />
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {FAMILY_ORDER.map((family) => (
              <div key={family} className="flex flex-col gap-4">
                <div>
                  <p className="type-eyebrow text-brand-strong">{FAMILIES[family].name}</p>
                  <p className="type-small mt-1 text-ink-5">{FAMILIES[family].promise}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {MODULES.filter((m) => m.family === family).map((module) => {
                    const inner = (
                      <>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                          <PlatformIcon name={module.icon} className="size-[18px]" />
                        </span>
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="flex flex-wrap items-center gap-2 text-base font-bold text-ink-1">
                            {module.name}
                            {module.status === 'expanding' ? <Chip status="info">Expanding</Chip> : null}
                          </span>
                          <span className="type-small text-ink-4">{module.promise}</span>
                        </span>
                        {module.path ? <ArrowRight className="ml-auto mt-2 size-4 shrink-0 text-brand-strong" aria-hidden="true" /> : null}
                      </>
                    )
                    return (
                      <li key={module.id}>
                        {module.path ? (
                          <Link href={module.path} className="flex gap-4 rounded-control border border-line-1 bg-canvas p-4 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                            {inner}
                          </Link>
                        ) : (
                          <Card className="flex gap-4 border-dashed p-4 shadow-none">{inner}</Card>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="guarantees" tone="white">
          <SectionHeading eyebrow="Platform guarantees" title="True on every page of the product" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GUARANTEES.map((g) => (
              <li key={g.title}>
                <Link href={g.href} className="flex h-full flex-col gap-3 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">{g.icon}</span>
                  <span className="text-base font-bold text-ink-1">{g.title}</span>
                  <span className="type-small text-ink-4">{g.body}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="type-small mt-6 text-ink-5">
            Priced per user per month, in pounds, VAT shown:{' '}
            <Link href="/pricing" className="font-semibold text-brand-strong hover:underline">
              see pricing
            </Link>
            .
          </p>
        </Section>

        <Section id="tour" tone="grey">
          <SectionHeading eyebrow="Take the tour" title="Two minutes, five screens" tone="grey" />
          <div className="mt-8">
            <ProductTour />
          </div>
        </Section>

        <CtaBand tone="white" placement="platform-closing" title="Then see it on your own sites." copy="A 30-minute walkthrough with someone who knows the product, on a UK haulier’s data." secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}
