import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { FAMILIES, MODULES, moduleById, modulesWithPages, type ModuleId } from '@/lib/platform'
import { modulePage } from '@/lib/platform-modules'
import { clusterArticlesFor, linksFrom } from '@/lib/seo/links'
import { h1For } from '@/lib/seo'
import { getPostBySlug } from '@/lib/insights'
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
import { Chip } from '@/components/ui/chip'
import { Card } from '@/components/ui/card'
import { FeatureRow } from '@/components/ui/feature-row'
import { CtaBand } from '@/components/ui/cta-band'
import { PlatformIcon } from '@/components/platform/icons'
import { ProductShot } from '@/components/platform/product-shot'
import { FaqAccordion } from '@/components/platform/faq-accordion'

/**
 * ModulePageTemplate — every module page, in the brief's order: breadcrumb,
 * family eyebrow, hero (SEO H1 from the keyword map, display line, lead,
 * CTAs, screenshot), proof chips, three pains mapped to three outcomes,
 * three FeatureRows with real screens, "Connected to", the UK regulation
 * box, the FAQ, previous/next module, CTA. Driven entirely by the typed
 * content object in lib/platform-modules.ts; Phase 3 adds a module by adding
 * an object and a route file.
 *
 * @example
 *   // app/platform/riddor/page.tsx
 *   export default function Page() { return <ModulePageTemplate id="riddor" /> }
 */
export function ModulePageTemplate({ id }: { id: ModuleId }) {
  if (!PLATFORM_LAUNCH) notFound()
  const page = modulePage(id)
  if (!page) notFound()
  const mod = moduleById(id)
  const family = FAMILIES[mod.family]
  const h1 = h1For(page.path)
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Platform', href: '/platform' },
    { name: mod.name, href: page.path },
  ]
  const pages = modulesWithPages()
  const position = pages.findIndex((m) => m.id === id)
  const previous = pages[(position - 1 + pages.length) % pages.length]
  const next = pages[(position + 1) % pages.length]
  const connected = page.connected.map(moduleById)
  const articles = clusterArticlesFor(page.path)
    .map((href) => getPostBySlug(href.replace('/insights/', '')))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
  const showToolkit = linksFrom(page.path).includes('/toolkit')
  const otherPages = pages.filter((m) => m.id !== id)
  const schema = jsonLd(graph(platformApplicationSchema(canonicalFor(page.path)), breadcrumbSchema(breadcrumbsFromTrail(crumbs))))

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

        {/* 1–3: breadcrumb, eyebrow, hero */}
        <section className="relative overflow-hidden border-b border-line-1 bg-canvas">
          <HeroBackdrop radial="right" />
          <Container className="relative pb-14 pt-10 md:pb-20 md:pt-14">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <div className="flex flex-col gap-6">
                <Breadcrumbs items={crumbs} />
                <div className="flex flex-col gap-4">
                  <Eyebrow>{family.name}</Eyebrow>
                  <h1 className="type-h3 text-ink-4">{h1}</h1>
                  <p className="type-display max-w-[16ch] text-ink-1">{page.display}</p>
                  <p className="type-lead measure text-ink-4">{page.lead}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <BookDemoButton placement={`module-${id}-hero`} size="lg" />
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/platform#tour">See how it works</Link>
                  </Button>
                </div>
                {/* 4: proof chips */}
                <ul className="flex flex-wrap gap-2" aria-label="Product facts">
                  {page.proof.map((chip) => (
                    <li key={chip}>
                      <Chip status="outline">{chip}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
              <ProductShot id={page.hero} frame priority />
            </div>
          </Container>
        </section>

        {/* 5: three pains mapped to three outcomes */}
        <Section tone="grey">
          <SectionHeading eyebrow="The problem, then the record" title="Three things that go wrong on paper" tone="grey" />
          <ol className="mt-10 grid gap-5 lg:grid-cols-3">
            {page.pains.map((item, i) => (
              <li key={item.pain}>
                <Card className="flex h-full flex-col gap-5 p-6">
                  <span className="type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <p className="type-eyebrow text-ink-4">On paper</p>
                    <p className="text-[15px] font-bold leading-snug text-ink-1">{item.pain}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 border-t border-line-1 pt-4">
                    <p className="type-eyebrow text-brand-strong">With jobsafe</p>
                    <p className="type-small text-ink-4">{item.outcome}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </Section>

        {/* 6: three feature rows with real screens */}
        <Section tone="white">
          <div className="flex flex-col gap-20 md:gap-28">
            {page.features.map((feature, i) => (
              <FeatureRow
                key={feature.title}
                title={feature.title}
                lead={feature.lead}
                reverse={i % 2 === 1}
                points={feature.points.map((point) => ({ icon: <PlatformIcon name={point.icon} />, title: point.title, detail: point.detail }))}
                media={<ProductShot id={feature.screenshot} frame caption className={feature.screenshot.endsWith('-phone') ? 'max-w-[300px]' : undefined} />}
              />
            ))}
          </div>
        </Section>

        {/* 7: connected to */}
        <Section tone="grey" divider>
          <SectionHeading eyebrow="Connected to" title="Where this record goes next" lead="Every module writes to the same record, so what happens here shows up in these." tone="grey" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {connected.map((m) => {
              const inner = (
                <>
                  <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                    <PlatformIcon name={m.icon} className="size-[18px]" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2 text-base font-bold text-ink-1">
                      {m.name}
                      {m.status === 'expanding' ? <Chip status="info">Expanding</Chip> : null}
                    </span>
                    <span className="type-small text-ink-5">{m.promise}</span>
                  </span>
                </>
              )
              return (
                <li key={m.id}>
                  {m.path ? (
                    <Link href={m.path} className="flex h-full flex-col gap-3 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col gap-3 rounded-control border border-dashed border-line-1 bg-canvas p-5">
                      {inner}
                      <span className="type-small text-ink-5">Page coming in a later phase.</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </Section>

        {/* 8: UK regulation, precisely */}
        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading eyebrow="UK regulation" title={page.regulation.title} />
            <Card className="flex flex-col gap-4 p-6 md:p-8">
              {page.regulation.paragraphs.map((paragraph) => (
                <p key={paragraph} className="type-body text-ink-2">
                  {paragraph}
                </p>
              ))}
              <p className="type-small border-t border-line-1 pt-4 text-ink-5">
                jobsafe holds no certification and claims none. The records are yours; so is the judgement in them.
              </p>
            </Card>
          </div>
        </Section>

        {/* 9: FAQ */}
        <FaqAccordion items={page.faqs} tone="grey" lead={`Straight answers about ${mod.name.toLowerCase()} in jobsafe.`} />

        {/* Reading and tools: the cluster articles and, for incidents, the toolkit */}
        {articles.length || showToolkit ? (
          <Section tone="white" divider>
            <SectionHeading eyebrow="Read more" title="The guides behind this module" />
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => (
                <li key={post.slug}>
                  <Link href={`/insights/${post.slug}`} className="flex h-full flex-col gap-2 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <span className="flex items-center gap-2 type-eyebrow text-ink-4">
                      <FileText className="size-3.5" aria-hidden="true" />
                      {post.category}
                    </span>
                    <span className="text-base font-bold leading-snug text-ink-1">{post.title}</span>
                    <span className="type-small text-ink-5">{post.description}</span>
                  </Link>
                </li>
              ))}
              {showToolkit ? (
                <li>
                  <Link href="/toolkit" className="flex h-full flex-col gap-2 rounded-control border border-brand-tint-18 bg-brand-tint-04 p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-brand hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <span className="flex items-center gap-2 type-eyebrow text-brand-strong">
                      <Download className="size-3.5" aria-hidden="true" />
                      Free toolkit
                    </span>
                    <span className="text-base font-bold leading-snug text-ink-1">The site incident and near-miss reporting toolkit</span>
                    <span className="type-small text-ink-5">A seven-page PDF: the report template, the RIDDOR flowchart and near-miss triage.</span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </Section>
        ) : null}

        {/* 10: previous / next, the rest of the platform, then the CTA */}
        <Section tone="grey" rhythm="tight" divider>
          <nav aria-label="Other modules" className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href={previous.path} className="group flex items-center gap-3 rounded-control border border-line-1 bg-canvas p-4 shadow-rest transition-[border-color,box-shadow] duration-200 hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <ArrowLeft className="size-4 shrink-0 text-brand-strong" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="type-eyebrow text-ink-4">Previous module</span>
                  <span className="text-sm font-bold text-ink-1 group-hover:text-brand-strong">{previous.name}</span>
                </span>
              </Link>
              <Link href={next.path} className="group flex items-center justify-end gap-3 rounded-control border border-line-1 bg-canvas p-4 text-right shadow-rest transition-[border-color,box-shadow] duration-200 hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <span className="flex flex-col">
                  <span className="type-eyebrow text-ink-4">Next module</span>
                  <span className="text-sm font-bold text-ink-1 group-hover:text-brand-strong">{next.name}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-brand-strong" aria-hidden="true" />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 type-small">
              <li>
                <Link href="/platform" className="font-bold text-brand-strong hover:underline">
                  Platform overview
                </Link>
              </li>
              {otherPages.map((m) => (
                <li key={m.id}>
                  <Link href={m.path} className={cn('font-semibold text-ink-4 hover:text-ink-1')}>
                    {m.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/platform/offline" className="font-semibold text-ink-4 hover:text-ink-1">
                  Works offline
                </Link>
              </li>
              {MODULES.filter((m) => m.path === null).length ? (
                <li className="text-ink-5">More module pages arrive in Phase 3.</li>
              ) : null}
            </ul>
          </nav>
        </Section>
        <CtaBand
          tone="white"
          placement={`module-${id}-closing`}
          title={`See ${mod.name.toLowerCase()} on your own setup.`}
          copy="A 30-minute walkthrough with someone who knows the product, on a UK haulier’s data."
          secondary={{ label: 'How the demo works', href: '/demo' }}
        />
      </main>
      <Footer />
    </>
  )
}

export default ModulePageTemplate
