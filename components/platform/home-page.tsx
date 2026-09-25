import Link from 'next/link'
import { CANONICAL_HOME, DEMO_DURATION_LABEL } from '@/lib/brand'
import { HOME_FAQS, HOME_PAA, PLATFORM_FACTS } from '@/lib/platform'
import { graph, jsonLd, platformApplicationSchema } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { FactStrip } from '@/components/ui/fact-strip'
import { CtaBand } from '@/components/ui/cta-band'
import { PlatformIcon } from '@/components/platform/icons'
import { PlatformHero } from '@/components/platform/hero'
import { FamilyTabs } from '@/components/platform/family-tabs'
import { IncidentStory } from '@/components/platform/incident-story'
import { RegulationBento } from '@/components/platform/regulation-bento'
import { SignalToggle } from '@/components/platform/signal-toggle'
import { PlatformIndustries } from '@/components/platform/industries'
import { WhySwitch } from '@/components/platform/why-switch'
import { PricingTeaser } from '@/components/platform/pricing-teaser'
import { FreeTools } from '@/components/platform/free-tools'
import { FaqAccordion } from '@/components/platform/faq-accordion'

/**
 * PlatformHomePage — the Phase 2 homepage, thirteen sections in the order
 * the brief sets: header, hero, fact strip, Record/Resolve/Prevent, the
 * incident story, UK law, the signal toggle, industries, why teams switch,
 * pricing teaser, free tools, FAQ, CTA + footer.
 * Rendered by app/page.tsx only when the launch flag is on.
 */
const homeGraph = jsonLd(graph(platformApplicationSchema(CANONICAL_HOME)))

export function PlatformHomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeGraph }} />
        <PlatformHero />
        <FactStrip variant="marquee" facts={PLATFORM_FACTS.map((fact) => ({ icon: <PlatformIcon name={fact.icon} />, label: fact.label, detail: fact.detail }))} />
        <FamilyTabs />
        <IncidentStory />
        <RegulationBento />
        <Section id="offline" tone="white" divider>
          <SectionHeading
            eyebrow="Offline, proven live"
            title="Turn the signal off and file a report"
            lead="Every module saves to the phone first. Try it here: no signal, a three-field report, then watch it sync when signal comes back."
          />
          <div className="mt-10">
            <SignalToggle />
          </div>
          <p className="type-small mt-6 text-ink-5">
            The rules of what happens offline, how sync resolves, and how to install the app on a phone are on{' '}
            <Link href="/platform/offline" className="font-semibold text-brand-strong hover:underline">
              the offline page
            </Link>
            .
          </p>
        </Section>
        <PlatformIndustries />
        <WhySwitch />
        <PricingTeaser />
        <FreeTools />
        <FaqAccordion items={[...HOME_FAQS, ...HOME_PAA]} lead="Straight answers, including the ones that are not yet a yes." />
        <CtaBand
          tone="grey"
          placement="home-closing"
          title="See it running on your own sites."
          copy={`${DEMO_DURATION_LABEL}, on a real setup, with someone who knows the product.`}
          secondary={{ label: 'How the demo works', href: '/demo' }}
        />
      </main>
      <Footer />
    </>
  )
}

export default PlatformHomePage
