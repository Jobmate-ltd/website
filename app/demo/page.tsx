import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarCheck, MessageSquareText, Route } from 'lucide-react'
import { DEMO_DURATION_LABEL, PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata, h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Card } from '@/components/ui/card'
import { DemoForm } from '@/components/site/demo-form'
import { ProductShot } from '@/components/platform/product-shot'

const PATH = '/demo'

export const metadata: Metadata = buildMetadata(PATH)

const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'Book a demo', href: PATH },
]

const COVERS = [
  'Your sites, your incident types, your fleet, walked through on a UK haulier’s setup so you see real data, not a blank screen.',
  'The modules that matter to you first: incidents and RIDDOR, or risk and permits, or fleet and training.',
  'The awkward questions: offline, hosting, roles, export, and what jobsafe does not do yet.',
]

const NEXT_STEPS = [
  { icon: <CalendarCheck />, title: 'Pick a slot', body: `${DEMO_DURATION_LABEL} on the calendar, at a time that suits. You get an invite with a video link.` },
  { icon: <MessageSquareText />, title: 'The walkthrough', body: 'Someone who knows the product shows you it working and answers what you ask. No slides.' },
  { icon: <Route />, title: 'What happens next', body: 'If it fits, you get a written quote for your team size and a proposed start. If it does not, we say so.' },
]

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  const schema = jsonLd(graph(breadcrumbSchema(breadcrumbsFromTrail(CRUMBS))))
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={CRUMBS} />}
          eyebrow="Book a demo"
          title={h1For(PATH)}
          lead="A 30-minute health and safety software demo on a UK haulier’s setup: incidents, RIDDOR, risk assessments, permits and fleet checks, walked through live by someone who knows the product."
          actions={
            <>
              <BookDemoButton placement="demo-hero" size="lg">
                Book a 30-minute walkthrough
              </BookDemoButton>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/platform#tour">Not ready to talk? Take the tour</Link>
              </Button>
            </>
          }
          media={<ProductShot id="dashboard-hero-desktop" frame priority />}
        />

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-8">
              <SectionHeading eyebrow="What the call covers" title="Thirty minutes, on your work" />
              <ul className="flex flex-col divide-y divide-line-1 border-y border-line-1">
                {COVERS.map((item, i) => (
                  <li key={item} className="flex gap-4 py-4">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-pill bg-brand-tint-08 type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
                      {i + 1}
                    </span>
                    <p className="type-body text-ink-2">{item}</p>
                  </li>
                ))}
              </ul>
              <SectionHeading eyebrow="What happens next" title="Three honest steps" />
              <ol className="grid gap-4">
                {NEXT_STEPS.map((step) => (
                  <li key={step.title}>
                    <Card className="flex gap-4 p-5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">{step.icon}</span>
                      <span className="flex flex-col gap-1">
                        <span className="text-base font-bold text-ink-1">{step.title}</span>
                        <span className="type-small text-ink-4">{step.body}</span>
                      </span>
                    </Card>
                  </li>
                ))}
              </ol>
              <p className="type-small text-ink-5">
                Prices are on the <Link href="/pricing" className="font-semibold text-brand-strong hover:underline">pricing page</Link>, hosting on the <Link href="/security" className="font-semibold text-brand-strong hover:underline">security page</Link>, and the rest of the product on the <Link href="/platform" className="font-semibold text-brand-strong hover:underline">platform overview</Link>. Prefer email or phone? <Link href="/contact" className="font-semibold text-brand-strong hover:underline">Contact us</Link>.
              </p>
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <DemoForm />
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
