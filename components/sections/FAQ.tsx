'use client'
import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

const faqs = [
  {
    q: 'Does JobSafe work without internet?',
    a: "Yes. The JobSafe mobile app stores reports locally when there's no signal and automatically syncs to the cloud as soon as connectivity is restored. Your team can capture incidents anywhere — on a building site, underground, or in a remote field location — without losing a single record.",
  },
  {
    q: 'How long does it take to set up?',
    a: "Most teams are live within 30 minutes. There's no installation, no hardware, and no IT involvement required. You create an account, invite your team members by email, and you're ready to start reporting. We provide onboarding guides and video walkthroughs to get your team confident from day one.",
  },
  {
    q: 'Is JobSafe HSSE compliant?',
    a: 'Yes. JobSafe is designed to support Health, Safety, Security, and Environment (HSSE) reporting requirements. Workflows align with ISO 45001 standards and the platform generates audit-ready records that satisfy both internal governance and external regulatory review. Every report is timestamped, immutable, and exportable.',
  },
  {
    q: 'Can I add photos and videos to a report?',
    a: 'Absolutely. Workers can attach photos, short video clips, and voice notes directly within the report form. All media is automatically timestamped and geotagged at the point of capture, and remains permanently linked to the incident record — accessible to investigators and auditors at any time.',
  },
  {
    q: 'How do supervisors get notified?',
    a: 'Named supervisors receive an instant push notification and email alert the moment a report is submitted. Notification rules are configurable based on incident type, severity, or location. Escalation paths ensure the right people are always informed — even if a supervisor is unavailable, the next person in the chain is automatically notified.',
  },
  {
    q: 'Is my data stored securely in the UK?',
    a: 'Yes. All JobSafe data is stored in UK-based AWS data centres and is never transferred outside the UK. We are fully GDPR compliant, use AES-256 encryption at rest and TLS in transit, and maintain a formal data processing agreement available on request.',
  },
]

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string>('')

  return (
    <section id="faq" className="py-24 bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_auto]">

          {/* Left — heading */}
          <div className="lg:sticky lg:top-32 lg:self-start text-center lg:text-left">
            <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Frequently<br className="hidden lg:block" /> Asked<br className="hidden lg:block" /> Questions
            </h2>
            <p className="text-white/50 text-sm mt-4 max-w-xs mx-auto lg:mx-0">
              Everything you need to know about JobSafe.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="sm:max-w-lg w-full lg:mx-0">
            <AccordionPrimitive.Root
              type="single"
              collapsible
              value={openItem}
              onValueChange={setOpenItem}
              className="divide-y divide-white/10"
            >
              {faqs.map((faq, i) => (
                <AccordionPrimitive.Item key={i} value={`item-${i}`}>
                  <AccordionPrimitive.Trigger className="w-full flex items-center justify-between gap-4 py-5 text-left">
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#e5342a]/10 border border-[#e5342a]/20 text-[#e5342a] text-xs font-bold">
                        Q
                      </span>
                      <span className="font-semibold text-white text-sm md:text-base leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <span className="shrink-0 text-[#e5342a] text-xl font-light leading-none select-none">
                      {openItem === `item-${i}` ? '−' : '+'}
                    </span>
                  </AccordionPrimitive.Trigger>
                  <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
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
