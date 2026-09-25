import * as React from 'react'
import { SITE_URL, canonicalFor } from '@/lib/brand'
import { breadcrumbSchema, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'

/**
 * LegalPage — the layout for privacy, terms and cookies: hero, a dated
 * "last updated" line, then prose in a 65ch measure with numbered sections.
 */
export function LegalPage({
  path,
  name,
  title,
  updated,
  intro,
  children,
}: {
  path: string
  name: string
  title: string
  /** DD/MM/YYYY, as displayed. */
  updated: string
  intro?: React.ReactNode
  children: React.ReactNode
}) {
  const url = canonicalFor(path)
  const pageGraph = jsonLd(
    graph(
      breadcrumbSchema([
        { name: 'Home', item: `${SITE_URL}/` },
        { name, item: url },
      ]),
    ),
  )
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
        <PageHero
          container="narrow"
          breadcrumbs={<Breadcrumbs items={[{ name: 'Home', href: '/' }, { name, href: path }]} />}
          eyebrow="Legal"
          title={title}
          lead={intro}
          note={
            <>
              Last updated: <span className="type-mono">{updated}</span>
            </>
          }
        />
        <Section container="prose" as="article">
          <div className="legal flex flex-col gap-10 type-body text-ink-2 [&_h2]:type-h3 [&_h2]:text-ink-1 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink-1 [&_p+p]:mt-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-brand-strong [&_a]:underline [&_a]:decoration-brand-tint-18 [&_a]:underline-offset-4 hover:[&_a]:decoration-brand-strong">
            {children}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

/** A numbered section. */
export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-28 flex-col gap-3">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

/** A hairlined table for cookie and sub-processor lists. */
export function LegalTable({ caption, head, rows }: { caption: string; head: readonly string[]; rows: readonly (readonly React.ReactNode[])[] }) {
  return (
    // The wrapper scrolls sideways on narrow screens, so it is a focusable
    // region: keyboard users can reach it and scroll it (WCAG 2.1.1).
    <div className="-mx-4 overflow-x-auto sm:mx-0" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-canvas-muted">
            {head.map((cell) => (
              <th key={cell} scope="col" className="border-b border-line-1 px-3 py-2.5 text-left type-eyebrow text-ink-4">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td key={j} className={j === 0 ? 'border-b border-line-1 px-3 py-3 font-semibold text-ink-1' : 'border-b border-line-1 px-3 py-3 text-ink-3'}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LegalPage
