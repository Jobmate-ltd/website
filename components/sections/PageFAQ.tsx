'use client'
import { faqPageSchema, graph, jsonLd, type FaqEntry } from '@/lib/schema'
import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

/**
 * Reusable FAQ section for non-homepage routes (industry and money pages).
 * Same contract as the homepage <FAQ />: the FAQPage schema is built from the
 * exact array rendered below, and is valid only because
 * <Accordion.Content forceMount> keeps every answer in the server-rendered
 * HTML (collapsed via `data-[state=closed]:h-0`). Do not remove one without
 * the other.
 */
export default function PageFAQ({
  faqs,
  intro,
}: {
  faqs: readonly FaqEntry[]
  intro?: string
}) {
  const [openItem, setOpenItem] = useState<string>('')

  const handleValueChange = (val: string) => {
    setOpenItem(val)
    if (val && typeof document !== 'undefined') {
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-faq-item="${val}"]`)
        if (el && 'scrollIntoView' in el) {
          (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }
  }

  return (
    <section id="faq" className="py-12 md:py-14 bg-surface-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(graph(faqPageSchema(faqs))) }}
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_32rem]">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-24 lg:self-start text-center lg:text-left">
            <p className="text-xs font-bold tracking-widest text-brand uppercase mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-balance text-white leading-tight">
              Frequently<br className="hidden lg:block" /> Asked<br className="hidden lg:block" /> Questions
            </h2>
            <p className="text-white/50 text-sm mt-4 max-w-xs mx-auto lg:mx-0">
              {intro ?? 'Everything you need to know about jobsafe.'}
            </p>
          </div>

          {/* Right — accordion */}
          <div className="w-full">
            <AccordionPrimitive.Root
              type="single"
              collapsible
              value={openItem}
              onValueChange={handleValueChange}
              className="divide-y divide-white/10"
            >
              {faqs.map((faq, i) => (
                <AccordionPrimitive.Item
                  key={i}
                  value={`item-${i}`}
                  data-faq-item={`item-${i}`}
                  className="scroll-mt-24"
                >
                  <AccordionPrimitive.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold">
                        Q
                      </span>
                      <span className="font-semibold text-white text-sm md:text-base leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <span className="shrink-0 text-brand text-xl font-light leading-none select-none">
                      {openItem === `item-${i}` ? '−' : '+'}
                    </span>
                  </AccordionPrimitive.Trigger>
                  <AccordionPrimitive.Content
                    forceMount
                    className="overflow-hidden text-sm data-[state=closed]:h-0 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
                  >
                    <p className="text-white/50 leading-relaxed pb-5 pl-9">
                      {faq.a}
                    </p>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </div>
        </div>
      </div>
    </section>
  )
}
