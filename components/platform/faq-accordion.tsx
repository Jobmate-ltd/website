import * as React from 'react'
import { faqPageSchema, graph, jsonLd, type FaqEntry } from '@/lib/schema'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

/**
 * FaqAccordion — the Phase 2 FAQ: shadcn/ui Accordion with every answer in
 * the server HTML (the content is force-mounted and collapsed), and FAQPage
 * JSON-LD emitted from the same array it renders, so the schema and the
 * visible text cannot disagree.
 *
 * @example
 *   <FaqAccordion items={HOME_FAQS} lead="Straight answers." />
 */
export function FaqAccordion({
  items,
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  lead,
  tone = 'white',
  id = 'faq',
  schema = true,
}: {
  items: readonly FaqEntry[]
  eyebrow?: string
  title?: React.ReactNode
  lead?: React.ReactNode
  tone?: 'white' | 'grey'
  id?: string
  schema?: boolean
}) {
  return (
    <Section id={id} tone={tone}>
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph(faqPageSchema(items))) }} /> : null}
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,40rem)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} tone={tone} />
        </div>
        <Accordion type="single" collapsible className="border-t border-line-1">
          {items.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger>
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-pill bg-brand-tint-08 type-mono text-[11px] font-medium text-brand-strong" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9">
                <p>{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}

export default FaqAccordion
