import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Calculator, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { modulePage, modulePageLive, modulePageName } from '@/lib/platform-modules'
import type { IndustryContent } from '@/lib/industries/types'
import { h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd, platformApplicationSchema } from '@/lib/schema'
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
import { Card } from '@/components/ui/card'
import { CtaBand } from '@/components/ui/cta-band'
import { ProductShot } from '@/components/platform/product-shot'
import { FaqAccordion } from '@/components/platform/faq-accordion'

/**
 * IndustryPageTemplate — the Phase 3 industry page, in the brief's order:
 * breadcrumb, hero (the sector H1 from the keyword map, lead, real screen,
 * two CTAs), three sourced facts with the source and year on the page, six
 * pains each answered by a module, three screens with sector captions, the
 * legal framing with its sources, the free tools that fit, eight FAQs (with
 * FAQPage from the same array), the closing CTA. A templates slot is
 * reserved for Phase 4 and renders nothing until then.
 *
 * Rendered only when NEXT_PUBLIC_PLATFORM_LAUNCH is on. The four industry
 * pages that existed before Phase 3 keep rendering their Phase 1 page while
 * the flag is off (see app/industries/<sector>/page.tsx); the three new
 * ones are 404.
 *
 * @example
 *   // app/industries/construction/page.tsx
 *   export default function Page() { return <IndustryPageTemplate content={construction} /> }
 */
export function IndustryPageTemplate({ content }: { content: IndustryContent }) {
  if (!PLATFORM_LAUNCH) notFound()
  const url = canonicalFor(content.path)
  const h1 = h1For(content.path)
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: content.name, href: content.path },
  ]
  const schema = jsonLd(graph(platformApplicationSchema(url), breadcrumbSchema(breadcrumbsFromTrail(crumbs))))
  const pains = content.pains.map((pain) => {
    const page = modulePage(pain.module)
    const live = page ? modulePageLive(page) : false
    return { ...pain, name: modulePageName(pain.module), href: live && page ? page.path : null }
  })

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

        {/* 1. Hero */}
        <section className="relative overflow-hidden border-b border-line-1 bg-canvas">
          <HeroBackdrop radial="right" />
          <Container className="relative pb-14 pt-10 md:pb-20 md:pt-14">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <div className="flex flex-col gap-6">
                <Breadcrumbs items={crumbs} />
                <div className="flex flex-col gap-4">
                  <Eyebrow>{content.eyebrow}</Eyebrow>
                  <h1 className="type-display max-w-[18ch] text-ink-1">{h1}</h1>
                  <p className="type-lead measure text-ink-4">{content.lead}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <BookDemoButton placement={`${content.placement}-hero`} size="lg" />
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/platform#tour">See how it works</Link>
                  </Button>
                </div>
              </div>
              <ProductShot id={content.hero} frame priority />
            </div>
          </Container>
        </section>

        {/* 2. Three sourced facts */}
        {content.facts.length ? (
          <Section tone="grey">
            <SectionHeading eyebrow="The numbers" title={content.facts.length === 1 ? 'One fact from the official statistics' : `${content.facts.length === 2 ? 'Two' : 'Three'} facts from the official statistics`} lead={content.factsLead} tone="grey" />
            <ul className={cn('mt-10 grid gap-5', content.facts.length > 1 && 'md:grid-cols-2', content.facts.length > 2 && 'lg:grid-cols-3')}>
              {content.facts.map((fact) => (
                <li key={fact.figure + fact.detail}>
                  <Card className="flex h-full flex-col gap-4 p-6">
                    <p className="type-display text-brand-strong">{fact.figure}</p>
                    <p className="text-[15px] font-bold leading-snug text-ink-1">{fact.detail}</p>
                    {fact.note ? <p className="type-small text-ink-5">{fact.note}</p> : null}
                    <p className="type-small mt-auto border-t border-line-1 pt-4 text-ink-4">
                      Source:{' '}
                      <a href={fact.source.url} rel="noopener noreferrer" className="font-semibold text-ink-3 underline decoration-line-1 underline-offset-4 hover:text-ink-1 hover:decoration-ink-3">
                        {fact.source.name}
                      </a>
                      , {fact.source.year}. Checked {fact.source.checked}.
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* 3. Six pains, each answered by a module */}
        <Section tone="white">
          <SectionHeading eyebrow="What goes wrong" title="Six things that go wrong, and the module that answers each" lead="Every one of these is a record somebody could not produce when it was asked for. Each links to the module that keeps it." />
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pains.map((item, i) => (
              <li key={item.pain}>
                <Card className="flex h-full flex-col gap-5 p-6">
                  <span className="type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15px] font-bold leading-snug text-ink-1">{item.pain}</p>
                  <div className="flex flex-col gap-1.5 border-t border-line-1 pt-4">
                    <p className="type-eyebrow text-brand-strong">With jobsafe</p>
                    <p className="type-small text-ink-4">{item.outcome}</p>
                  </div>
                  {item.href ? (
                    <Link href={item.href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                      {item.name}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <p className="type-small mt-auto text-ink-5">{item.name}: in the platform, page to follow.</p>
                  )}
                </Card>
              </li>
            ))}
          </ol>
        </Section>

        {/* 4. Three screens with sector captions */}
        <Section tone="grey" divider>
          <SectionHeading eyebrow="On the screen" title="Three screens from the product, on this sector’s data" lead="Real captures from the demo setup. Nothing is mocked up." tone="grey" />
          <ul className="mt-10 grid gap-8 md:grid-cols-3 md:items-start">
            {content.screens.map((screen) => (
              <li key={screen.id} className={cn('flex flex-col gap-3', screen.id.endsWith('-phone') && 'md:items-center')}>
                <figure className="flex flex-col gap-3">
                  <ProductShot id={screen.id} frame className={screen.id.endsWith('-phone') ? 'max-w-[260px]' : undefined} />
                  <figcaption className="type-small text-ink-4">{screen.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Section>

        {/* Templates: reserved for Phase 4. Renders nothing until the sector templates ship. */}

        {/* 5. The legal framing, with its sources */}
        <Section tone="white">
          <SectionHeading eyebrow="The law, precisely" title={content.legal.title} lead={content.legal.lead} />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {content.legal.points.map((point) => (
              <li key={point.title}>
                <Card className="flex h-full flex-col gap-3 p-6">
                  <h3 className="text-base font-bold leading-snug text-ink-1">{point.title}</h3>
                  <p className="type-small text-ink-4">{point.body}</p>
                  {point.source ? (
                    <p className="type-small mt-auto border-t border-line-1 pt-4 text-ink-5">
                      <a href={point.source.url} rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ink-3 underline decoration-line-1 underline-offset-4 hover:text-ink-1 hover:decoration-ink-3">
                        {point.source.name}
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </a>{' '}
                      Checked {point.source.checked}.
                    </p>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
          <p className="type-small mt-6 text-ink-5">jobsafe holds no certification and claims none. The records are yours; so is the judgement in them.</p>
        </Section>

        {/* 6. Free tools that fit the sector */}
        <Section tone="grey" divider rhythm="tight">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="Try it free" title="Two tools built from the product" lead="No sign-up. Each runs the product’s own logic in your browser." tone="grey" />
            <div className="flex flex-col gap-4">
              <ul className="grid gap-4 sm:grid-cols-2">
                {content.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="flex h-full items-start gap-4 rounded-control border border-brand-tint-18 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-brand hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                        <Calculator className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-base font-bold leading-snug text-ink-1">{tool.label}</span>
                        <span className="type-small text-ink-5">{tool.why}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="type-small text-ink-5">
                Or see{' '}
                <Link href="/platform" className="font-semibold text-brand-strong hover:underline">
                  the whole platform
                </Link>
                , what feeds what, and the two-minute tour.
              </p>
            </div>
          </div>
        </Section>

        {/* 7. Eight questions, each naming its regulation */}
        <FaqAccordion items={content.faqs} tone="white" lead={content.faqLead} />

        {/* 8. CTA */}
        <CtaBand tone="grey" placement={`${content.placement}-closing`} title={content.closing.title} copy={content.closing.copy} secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}

export default IndustryPageTemplate
