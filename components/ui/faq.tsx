import * as React from 'react'
import { Plus } from 'lucide-react'
import { faqPageSchema, graph, jsonLd, type FaqEntry } from '@/lib/schema'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

/**
 * Faq — server-rendered questions and answers.
 *
 * Each item is a native <details>: the answer text is in the HTML, collapsed
 * by the browser rather than unmounted, and needs no JavaScript to open. The
 * FAQPage JSON-LD is emitted from the same array that is rendered, so the
 * schema and the visible text are the same text by construction. Google
 * explicitly permits collapsed accordions for FAQ rich results; it does not
 * permit answers that are absent from the DOM. `name` gives the group
 * exclusive-open behaviour in browsers that support it.
 *
 * @example
 *   <Faq eyebrow="FAQ" title="Questions" items={faqs} />
 */
export interface FaqProps {
  items: readonly FaqEntry[]
  eyebrow?: string
  title?: React.ReactNode
  lead?: React.ReactNode
  tone?: 'white' | 'grey'
  id?: string
  /** Emit FAQPage JSON-LD (default true). Set false on a page that already has one. */
  schema?: boolean
  className?: string
}

export function Faq({
  items,
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  lead,
  tone = 'white',
  id = 'faq',
  schema = true,
  className,
}: FaqProps) {
  const groupId = React.useId().replace(/:/g, '')
  return (
    <Section id={id} tone={tone} className={className}>
      {schema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph(faqPageSchema(items))) }} />
      ) : null}
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,36rem)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} tone={tone} />
        </div>
        <div className="divide-y divide-line-1 border-y border-line-1">
          {items.map((item, i) => (
            <details key={item.q} className="faq group" name={`faq-${groupId}`}>
              <summary className="flex cursor-pointer items-start justify-between gap-4 py-5 text-left">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-pill bg-brand-tint-08 type-mono text-[11px] font-medium text-brand-strong">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-bold leading-snug text-ink-1 md:text-base">{item.q}</span>
                </span>
                <Plus
                  aria-hidden="true"
                  className="faq-marker mt-0.5 size-5 shrink-0 text-brand transition-transform duration-200 ease-out-expo"
                  strokeWidth={2.25}
                />
              </summary>
              <p className="type-body pb-6 pl-9 text-ink-4">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default Faq
