import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, FileText, Wrench } from 'lucide-react'
import { PLATFORM_LAUNCH, canonicalFor } from '@/lib/brand'
import { MODULES } from '@/lib/platform'
import { TOOL_PATHS } from '@/lib/seo/links'
import { h1For } from '@/lib/seo'
import { getPostBySlug } from '@/lib/insights'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, howToSchema, jsonLd, webApplicationSchema, type FaqEntry, type HowToStep } from '@/lib/schema'
import { INDUSTRY_LABELS, MODULE_LABELS, TOOLS, partitionLinks, toolByPath } from '@/lib/tools'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { CtaBand } from '@/components/ui/cta-band'
import { PlatformIcon } from '@/components/platform/icons'
import { FaqAccordion } from '@/components/platform/faq-accordion'

/**
 * ToolPage — the shell every free tool shares, in order: breadcrumb and hero
 * (the H1 from the keyword map, the lead, the demo and tour actions), the
 * tool itself, any extra sections the page adds, the "How it works" steps
 * (which also feed the HowTo schema), the module cards and articles the link
 * registry declares for the page, the FAQ, the other free tools and the
 * closing CTA. Every link in lib/seo/links.ts for the page is rendered here
 * inside <main>, so scripts/seo-check.mjs finds each one.
 *
 * @example
 *   <ToolPage path={TOOL_PATHS.afr} lead="…" toolTitle="Work out the rate" tool={<AfrCalculator />} … />
 */
export interface ToolPageProps {
  readonly path: string
  readonly eyebrow?: string
  readonly lead: string
  /** The H2 above the tool. */
  readonly toolTitle: string
  readonly toolLead?: string
  readonly tool: React.ReactNode
  /** Extra server-rendered sections between the tool and the explainer. */
  readonly afterTool?: React.ReactNode
  readonly explainer: {
    readonly eyebrow?: string
    readonly title: string
    readonly lead?: React.ReactNode
    readonly steps: readonly HowToStep[]
    readonly footnote?: React.ReactNode
  }
  readonly howTo: { readonly name: string; readonly description: string; readonly totalTime?: string }
  readonly faqs: readonly FaqEntry[]
  readonly faqLead?: string
  /** One line under "Built from the product" saying which product logic the tool runs. */
  readonly builtFrom: string
  readonly cta: { readonly title: string; readonly copy: string }
}

const cardClass = 'flex h-full flex-col gap-2 rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export function ToolPage({ path, eyebrow = 'Free tool', lead, toolTitle, toolLead, tool, afterTool, explainer, howTo, faqs, faqLead, builtFrom, cta }: ToolPageProps) {
  if (!PLATFORM_LAUNCH) notFound()
  const def = toolByPath(path)
  const url = canonicalFor(path)
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Free tools', href: TOOL_PATHS.hub },
    { name: def.name, href: path },
  ]
  const links = partitionLinks(path)
  // A module from lib/platform.ts, or a labelled page (the bowtie view) so every declared link is rendered.
  const modules = links.modules.map((href) => {
    const m = MODULES.find((module) => module.path === href)
    if (m) return { href, name: m.name, promise: m.promise, icon: m.icon }
    const label = MODULE_LABELS[href]
    return { href, name: label?.name ?? href, promise: label?.promise ?? '', icon: 'shield-alert' as const }
  })
  const articles = links.articles
    .map((href) => getPostBySlug(href.replace('/insights/', '')))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
  const others = TOOLS.filter((t) => t.path !== path && links.tools.includes(t.path))
  const schema = jsonLd(
    graph(
      webApplicationSchema({ url, name: def.name, description: def.description }),
      howToSchema({ url, name: howTo.name, description: howTo.description, steps: explainer.steps, totalTime: howTo.totalTime }),
      breadcrumbSchema(breadcrumbsFromTrail(crumbs)),
    ),
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={crumbs} />}
          eyebrow={eyebrow}
          title={h1For(path)}
          lead={lead}
          actions={
            <>
              <BookDemoButton placement={`tool-${def.slug}-hero`} size="lg" />
              <Button variant="secondary" size="lg" asChild>
                <Link href="/platform#tour">See how it works</Link>
              </Button>
            </>
          }
        />

        {/* The tool */}
        <Section id="tool" tone="white" rhythm="tight">
          <SectionHeading eyebrow="The tool" title={toolTitle} lead={toolLead} id="tool-heading" />
          <div className="mt-8">{tool}</div>
        </Section>

        {afterTool}

        {/* How it works: the same steps feed the HowTo schema above */}
        <Section id="how-it-works" tone="grey">
          <SectionHeading eyebrow={explainer.eyebrow ?? 'How it works'} title={explainer.title} lead={explainer.lead} tone="grey" />
          <ol className="mt-10 grid gap-5 md:grid-cols-2">
            {explainer.steps.map((step, i) => (
              <li key={step.name} id={`step-${i + 1}`} className="flex flex-col gap-3 rounded-control border border-line-1 bg-canvas p-6 shadow-rest">
                <span className="type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-bold leading-snug text-ink-1">{step.name}</h3>
                <p className="type-small text-ink-4">{step.text}</p>
              </li>
            ))}
          </ol>
          {explainer.footnote ? <p className="type-small mt-6 text-ink-5">{explainer.footnote}</p> : null}
        </Section>

        {/* Built from the product, and the reading behind it */}
        <Section id="built-from" tone="white" divider>
          <SectionHeading eyebrow="Built from the product" title="The same logic, inside jobsafe" lead={builtFrom} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <li key={m.href}>
                <Link href={m.href} className={cardClass}>
                  <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                    <PlatformIcon name={m.icon} className="size-[18px]" />
                  </span>
                  <span className="text-base font-bold leading-snug text-ink-1">{m.name}</span>
                  <span className="type-small text-ink-5">{m.promise}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold text-brand-strong">
                    See the module <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {articles.length ? (
            <div className="mt-12 flex flex-col gap-5">
              <h3 className="type-h3 text-ink-1">Read more</h3>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/insights/${post.slug}`} className={cardClass}>
                      <span className="flex items-center gap-2 type-eyebrow text-ink-4">
                        <FileText className="size-3.5" aria-hidden="true" />
                        {post.category}
                      </span>
                      <span className="text-base font-bold leading-snug text-ink-1">{post.title}</span>
                      <span className="type-small text-ink-5">{post.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {links.industries.length ? (
            <p className="type-small mt-8 text-ink-4">
              Asked for most often in{' '}
              {links.industries.map((href, i) => (
                <React.Fragment key={href}>
                  {i > 0 ? ', ' : ''}
                  <Link href={href} className="font-bold text-brand-strong hover:underline">
                    {INDUSTRY_LABELS[href] ?? href}
                  </Link>
                </React.Fragment>
              ))}
              .
            </p>
          ) : null}
          {links.other.length ? (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 type-small">
              {links.other.map((href) => (
                <li key={href}>
                  <Link href={href} className="font-bold text-brand-strong hover:underline">
                    {href}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Section>

        {/* FAQ: FaqAccordion emits its own FAQPage node */}
        <FaqAccordion items={faqs} tone="grey" lead={faqLead} />

        {/* Other free tools */}
        <Section tone="white" rhythm="tight" divider>
          <nav aria-labelledby="other-tools-heading" className="flex flex-col gap-5">
            <h2 id="other-tools-heading" className="type-h3 text-ink-1">
              Other free tools
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((t) => (
                <li key={t.slug}>
                  <Link href={t.path} className={cardClass}>
                    <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                      <Wrench className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="text-base font-bold leading-snug text-ink-1">{t.name}</span>
                    <span className="type-small text-ink-5">{t.short}</span>
                  </Link>
                </li>
              ))}
              {links.tools.includes(TOOL_PATHS.hub) ? (
                <li>
                  <Link href={TOOL_PATHS.hub} className={cardClass}>
                    <span className="text-base font-bold leading-snug text-ink-1">All free tools</span>
                    <span className="type-small text-ink-5">The three tools on one page, with the PDF toolkit beside them.</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold text-brand-strong">
                      Open the hub <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </Section>

        <CtaBand tone="grey" placement={`tool-${def.slug}-closing`} title={cta.title} copy={cta.copy} secondary={links.demo ? { label: 'How the demo works', href: '/demo' } : undefined} />
      </main>
      <Footer />
    </>
  )
}

export default ToolPage
