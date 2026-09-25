import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileDown } from 'lucide-react'
import { DEMO_DURATION_LABEL, ENTRY_PRICE_EX_VAT_LABEL, PHONE_DISPLAY, PHONE_HREF, PLATFORM_LAUNCH, SIGNUP_TRIAL_URL, SITE_URL, TRIAL, canonicalFor } from '@/lib/brand'
import { breadcrumbSchema, graph, jsonLd, platformApplicationSchema, softwareApplicationSchema, type FaqEntry } from '@/lib/schema'
import { modulesWithPages } from '@/lib/platform'
import { PlatformIcon } from '@/components/platform/icons'
import { PricingTeaser } from '@/components/platform/pricing-teaser'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { Pricing } from '@/components/site/pricing'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'
import { MediaFrame } from '@/components/ui/frame'
import { LazyVideo } from '@/components/ui/lazy-video'
import { Card } from '@/components/ui/card'
import { Reveal } from '@/components/ui/reveal'
import { Faq } from '@/components/ui/faq'
import { CtaBand } from '@/components/ui/cta-band'

/**
 * IndustryPage — the template every industry landing page is composed from.
 *
 * A page file supplies the words and the media; this file supplies the
 * layout, the schema, the pricing block and the shared closing. Every claim
 * an industry page makes is a claim the homepage already makes about the
 * product; nothing here invents a module or a number.
 */
export interface IndustryMedia {
  kind: 'video' | 'image'
  src: string
  poster?: string
  alt: string
  caption?: string
}

export interface IconCard {
  icon: React.ReactNode
  title: string
  body: string
}

export interface IndustryContent {
  path: string
  breadcrumb: string
  /** Analytics placement prefix, e.g. "industry-healthcare". */
  placement: string
  hero: {
    eyebrow: string
    title: React.ReactNode
    lead: React.ReactNode
    media: IndustryMedia
  }
  trustFacts: readonly string[]
  point: {
    icon: React.ReactNode
    title: React.ReactNode
    body: React.ReactNode
    note?: React.ReactNode
  }
  pains: {
    title: string
    lead: string
    cards: readonly IconCard[]
  }
  commercial: {
    title: React.ReactNode
    lead: string
    cards: readonly IconCard[]
    links: readonly { label: string; href: string }[]
  }
  toolkit: {
    audience: string
  }
  faqs: readonly FaqEntry[]
  faqIntro: string
  /**
   * Phase 2 overrides, applied only while NEXT_PUBLIC_PLATFORM_LAUNCH is on:
   * replacement answers keyed by question, for the FAQs that used to deny a
   * module the platform now has. Phase 3 rebuilds these pages fully.
   */
  launch?: {
    faqs?: Readonly<Record<string, string>>
  }
  closing: {
    title: string
    copy: string
  }
}

function HeroMedia({ media }: { media: IndustryMedia }) {
  return (
    <MediaFrame caption={media.caption} className="w-full max-w-xl">
      {media.kind === 'video' ? (
        <LazyVideo src={media.src} poster={media.poster ?? ''} alt={media.alt} priority />
      ) : (
        <Image src={media.src} alt={media.alt} width={1280} height={720} priority sizes="(min-width: 1024px) 560px, 100vw" className="aspect-video w-full object-cover" />
      )}
    </MediaFrame>
  )
}

export function IndustryPage({ content }: { content: IndustryContent }) {
  const url = canonicalFor(content.path)
  const faqs = PLATFORM_LAUNCH && content.launch?.faqs ? content.faqs.map((faq) => ({ ...faq, a: content.launch?.faqs?.[faq.q] ?? faq.a })) : content.faqs
  const pageGraph = jsonLd(
    graph(
      breadcrumbSchema([
        { name: 'Home', item: `${SITE_URL}/` },
        { name: content.breadcrumb, item: url },
      ]),
      PLATFORM_LAUNCH ? platformApplicationSchema(url) : softwareApplicationSchema(url),
    ),
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />

        {/* Hero: text left, framed footage or still right, on the grid. */}
        <section className="relative overflow-hidden bg-canvas">
          <HeroBackdrop radial="right" />
          <Container size="wide" className="relative pb-14 pt-10 md:pb-20 md:pt-14">
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: content.breadcrumb, href: content.path }]} className="mb-8" />
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="flex flex-col gap-6">
                <Eyebrow>{content.hero.eyebrow}</Eyebrow>
                <h1 className="type-display max-w-[16ch] text-ink-1">{content.hero.title}</h1>
                <p className="type-lead measure text-ink-4">{content.hero.lead}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <BookDemoButton placement={`${content.placement}-hero`} size="lg" />
                  <Button variant="secondary" size="lg" asChild>
                    <a href={SIGNUP_TRIAL_URL}>Start your free trial</a>
                  </Button>
                  <Button variant="link" asChild>
                    <Link href="/toolkit">Get the free toolkit</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <HeroMedia media={content.hero.media} />
              </div>
            </div>
          </Container>
        </section>

        {/* Trust strip */}
        <div className="border-y border-line-1 bg-bg">
          <Container size="wide">
            <ul className="flex flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:gap-0 sm:divide-x sm:divide-line-1">
              {content.trustFacts.map((fact) => (
                <li key={fact} className="flex items-center gap-2 px-6 type-eyebrow text-ink-4">
                  <span aria-hidden="true" className="size-1.5 rounded-pill bg-brand" />
                  {fact}
                </li>
              ))}
            </ul>
          </Container>
        </div>

        {/* The point: the page's editorial statement */}
        <Section container="narrow" rhythm="loose">
          <Reveal className="flex flex-col items-center text-center">
            <span aria-hidden="true" className="mb-8 flex size-12 items-center justify-center rounded-pill bg-brand-tint-08 text-brand [&>svg]:size-6">
              {content.point.icon}
            </span>
            <h2 className="type-h2 text-ink-1">{content.point.title}</h2>
            <p className="type-lead mt-8 text-ink-2 md:text-[22px]">{content.point.body}</p>
            {content.point.note ? <p className="type-small mt-6 max-w-2xl text-ink-5">{content.point.note}</p> : null}
          </Reveal>
        </Section>

        {/* Pain cards */}
        <Section tone="grey" divider>
          <SectionHeading title={content.pains.title} lead={content.pains.lead} tone="grey" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {content.pains.cards.map((card, i) => (
              <Reveal as="li" key={card.title} index={i}>
                <Card className="flex h-full flex-col gap-4 p-6">
                  <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-5">
                    {card.icon}
                  </span>
                  <h3 className="text-base font-bold leading-snug text-ink-1">{card.title}</h3>
                  <p className="type-small text-ink-5">{card.body}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Section>

        {/* Commercial payoff */}
        <Section divider>
          <SectionHeading title={content.commercial.title} lead={content.commercial.lead} align="center" />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-control border border-line-1 bg-line-1 md:grid-cols-3">
            {content.commercial.cards.map((card, i) => (
              <Reveal as="li" key={card.title} index={i} className="bg-canvas p-6 md:p-8">
                <span aria-hidden="true" className="text-brand [&>svg]:size-6">{card.icon}</span>
                <h3 className="mt-5 type-h3 text-ink-1">{card.title}</h3>
                <p className="type-small mt-3 text-ink-5">{card.body}</p>
              </Reveal>
            ))}
          </ul>
          <ul className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
            {content.commercial.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 hover:decoration-brand-strong">
                  {link.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* The lower-commitment offer */}
        <Section tone="grey" divider>
          <Card className="grid items-center gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div className="flex flex-col gap-4">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                <FileDown className="size-5" />
              </span>
              <h2 className="type-h2 text-ink-1">Not sure where your gaps are? Start free.</h2>
              <p className="type-body measure text-ink-4">
                The jobsafe site reporting toolkit is free for {content.toolkit.audience}: a ready-to-use incident and near-miss report template, the RIDDOR decision flowchart, and near-miss triage. No obligation, no jargon.
              </p>
            </div>
            <Button variant="dark" size="lg" asChild>
              <Link href="/toolkit">Get the free toolkit</Link>
            </Button>
          </Card>
        </Section>

        {PLATFORM_LAUNCH ? (
          <>
          <Section tone="white" divider>
            <SectionHeading eyebrow="In the platform" title="The modules behind this page" lead="Incident reporting was where jobsafe started. The platform now carries the rest of the record; these are the pages for it." />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modulesWithPages().map((module) => (
                <li key={module.id}>
                  <Link href={module.path} className="flex h-full flex-col gap-3 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                      <PlatformIcon name={module.icon} className="size-[18px]" />
                    </span>
                    <span className="text-base font-bold text-ink-1">{module.name}</span>
                    <span className="type-small text-ink-4">{module.promise}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="type-small mt-6 text-ink-5">
              <Link href="/platform" className="font-semibold text-brand-strong hover:underline">
                See the whole platform
              </Link>
              , or how it{' '}
              <Link href="/platform/offline" className="font-semibold text-brand-strong hover:underline">
                works offline
              </Link>
              .
            </p>
          </Section>
          <PricingTeaser />
          </>
        ) : (
          <Pricing tone="white" />
        )}

        <Faq items={faqs} lead={content.faqIntro} tone="grey" />

        <CtaBand
          tone="white"
          placement={`${content.placement}-closing`}
          title={content.closing.title}
          copy={`Book ${DEMO_DURATION_LABEL} and we will show you exactly what ${content.closing.copy}`}
          secondary={{ label: 'Start your free trial', href: SIGNUP_TRIAL_URL }}
          note={
            <>
              From {ENTRY_PRICE_EX_VAT_LABEL} per licence per month. {TRIAL.label}. Or call{' '}
              <a href={PHONE_HREF} className="font-semibold text-ink-3 underline decoration-line-1 underline-offset-4 hover:text-ink-1">
                {PHONE_DISPLAY}
              </a>
              .
            </>
          }
        />
      </main>
      <Footer />
    </>
  )
}

export default IndustryPage
