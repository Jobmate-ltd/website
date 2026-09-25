import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Accessibility, Hand, PenLine, Smartphone, SunMedium } from 'lucide-react'
import { PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { modulesWithPages } from '@/lib/platform'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd, platformApplicationSchema, type FaqEntry } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Card } from '@/components/ui/card'
import { CtaBand } from '@/components/ui/cta-band'
import { SignalToggle } from '@/components/platform/signal-toggle'
import { SyncDiagram } from '@/components/platform/sync-diagram'
import { ProductShot } from '@/components/platform/product-shot'
import { FaqAccordion } from '@/components/platform/faq-accordion'
import Link from 'next/link'

const PATH = '/platform/offline'

export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Platform', href: '/platform' },
  { name: 'Works offline', href: PATH },
]

const RULES: readonly { title: string; body: string }[] = [
  { title: 'Changes queue in order and retry', body: 'Every save goes into the outbox on the phone. When signal returns they go up in the order you made them, and a failed attempt is retried, not dropped.' },
  { title: 'Each record shows “Pending sync”', body: 'A report, a permit or a checklist that has not reached the cloud yet says so on the record, so nobody assumes the office has seen it.' },
  { title: 'The newest edit wins on every device', body: 'If two people edit the same record while apart, the latest change is the one that stands, on every device, and the device that lost is told.' },
]

const GLOVES: readonly { icon: React.ReactNode; title: string; body: string }[] = [
  { icon: <Accessibility />, title: 'WCAG 2.2 AA', body: 'Tested with axe on every screen and with a keyboard, so a screen reader and a mouse-free desk both work.' },
  { icon: <Smartphone />, title: '320px screens', body: 'Laid out for the smallest phones the depot hands out, not just the one in the design file.' },
  { icon: <Hand />, title: 'Large targets', body: 'Buttons and fields sized for a gloved thumb and a moving cab.' },
  { icon: <PenLine />, title: 'Typed signature option', body: 'Where a name must be signed, it can be typed, for the days a finger on glass will not do.' },
  { icon: <SunMedium />, title: 'Readable in glare', body: 'High-contrast ink on a light ground, the same tokens as this site.' },
]

const FAQS: readonly FaqEntry[] = [
  { q: 'Does every module work offline, or just reporting?', a: 'Every module. Incidents, RIDDOR, risk assessments, permits, checklists, fleet, training and documents all save to the phone first and sync when signal returns.' },
  { q: 'What if the phone runs out of battery before it syncs?', a: 'The record is saved on the phone the moment you save it, not when it syncs. Charge the phone, open the app, and the outbox carries on.' },
  { q: 'Can a signed-in phone open the app with no signal at all?', a: 'Yes. A signed-in phone opens offline, shows the records it holds and takes new ones.' },
  { q: 'Is it an App Store or Play Store download?', a: 'No. jobsafe is an installable web app: add it to the home screen from the browser on iPhone, Android or desktop and it opens like an app, offline included. A native store app is not available yet.' },
  { q: 'What happens if two people change the same record?', a: 'The newest edit wins on every device, and the device whose edit lost is told so nothing is silently overwritten.' },
]

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
          eyebrow="Works offline"
          title={h1For(PATH)}
          lead="Works in the yard, the basement and the cab. An offline health and safety app saves every record to the phone first, shows “Pending sync” until signal returns, then syncs on its own. That is how every jobsafe module behaves, not a mode you switch on."
          actions={
            <>
              <BookDemoButton placement="offline-hero" size="lg" />
              <Button variant="secondary" size="lg" asChild>
                <Link href="#signal">Try it here</Link>
              </Button>
            </>
          }
          media={<ProductShot id="pending-sync-phone" frame priority className="max-w-[300px]" />}
        />

        <Section id="signal" tone="grey">
          <SectionHeading eyebrow="Try it" title="Turn the signal off and file a report" lead="The same three fields a driver sees. Nothing here leaves your browser." tone="grey" />
          <div className="mt-10">
            <SignalToggle size="large" />
          </div>
        </Section>

        <Section id="how-sync-works" tone="white">
          <SectionHeading eyebrow="How sync works" title="From the phone to London, in order" lead="An offline incident reporting app is only useful if what you typed in the cab is what the office sees. Three rules make sure of it." />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <SyncDiagram />
            <ol className="flex flex-col divide-y divide-line-1 border-y border-line-1">
              {RULES.map((rule, i) => (
                <li key={rule.title} className="flex gap-4 py-5">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-pill bg-brand-tint-08 type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-bold text-ink-1">{rule.title}</p>
                    <p className="type-small text-ink-4">{rule.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section id="install" tone="grey">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="Install it" title="Add it to the home screen" tone="grey" />
            <Card className="flex flex-col gap-4 p-6 md:p-8">
              <p className="type-body text-ink-2">
                jobsafe is an installable web app. On iPhone, Android and desktop you add it to the home screen from the browser and it opens full-screen like an app, with its own icon, offline included. There is nothing to download from an app store and nothing for IT to roll out.
              </p>
              <p className="type-body text-ink-2">
                Once installed and signed in, the phone opens jobsafe with no signal at all, shows the records it holds and takes new ones. A native store app is not available yet.
              </p>
              <p className="type-small border-t border-line-1 pt-4 text-ink-5">Your team is invited by email by your administrator, and installs from the link they receive.</p>
            </Card>
          </div>
        </Section>

        <Section id="gloves" tone="white">
          <SectionHeading eyebrow="Built for gloves and glare" title="Made for the hands that will use it" lead="A yard in January and a cab in July are the conditions it was tested in." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GLOVES.map((item) => (
              <li key={item.title}>
                <Card className="flex h-full flex-col gap-3 p-5">
                  <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">{item.icon}</span>
                  <p className="text-base font-bold text-ink-1">{item.title}</p>
                  <p className="type-small text-ink-4">{item.body}</p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="type-small mt-8 text-ink-5">
            Works offline in every module:{' '}
            {modulesWithPages().map((m, i) => (
              <span key={m.id}>
                {i > 0 ? ' · ' : ''}
                <Link href={m.path} className="font-semibold text-brand-strong hover:underline">
                  {m.name}
                </Link>
              </span>
            ))}
            {' · '}
            <Link href="/security" className="font-semibold text-brand-strong hover:underline">
              and it all stays in the UK
            </Link>
            .
          </p>
        </Section>

        <FaqAccordion items={FAQS} tone="grey" lead="What people ask about offline before they trust it." />
        <CtaBand tone="white" placement="offline-closing" title="See it lose signal and not lose the report." copy="A 30-minute walkthrough on a UK haulier’s setup, with the phone in flight mode." secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}
