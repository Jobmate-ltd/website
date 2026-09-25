import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Hero } from '@/components/home/hero'
import { Industries } from '@/components/home/industries'
import { Features } from '@/components/home/features'
import { HowItWorks } from '@/components/home/how-it-works'
import { Results } from '@/components/home/results'
import { Closing } from '@/components/home/closing'
import { Pricing } from '@/components/site/pricing'
import { Faq } from '@/components/ui/faq'
import { CtaBand } from '@/components/ui/cta-band'
import { CANONICAL_HOME, DEMO_DURATION_LABEL } from '@/lib/brand'
import { graph, jsonLd, softwareApplicationSchema, type FaqEntry } from '@/lib/schema'

/**
 * HomePhase1 — the homepage as Phase 1 shipped it. Rendered while the launch
 * flag is off; untouched by Phase 2 so production stays byte-for-byte the
 * same page. Organization and WebSite are emitted from the root layout; the
 * homepage adds SoftwareApplication. FAQPage is emitted by <Faq/> from the
 * array it renders.
 */
const homeGraph = jsonLd(graph(softwareApplicationSchema(CANONICAL_HOME)))

const FAQS: readonly FaqEntry[] = [
  {
    q: 'Does jobsafe work without internet?',
    a: "Yes. The jobsafe mobile app stores reports locally when there's no signal and automatically syncs to the cloud as soon as connectivity is restored. Your team can capture incidents anywhere, on a building site, underground, or in a remote field location, without losing a single record.",
  },
  {
    q: 'How long does it take to set up?',
    a: "There's no installation, no hardware, and no IT involvement required. You create an account, invite your team members by email, and you're ready to start reporting. We provide onboarding guides and video lessons in the academy to get your team confident from day one.",
  },
  {
    q: 'Is jobsafe HSSE compliant?',
    a: 'jobsafe is designed to support Health, Safety, Security and Environment (HSSE) reporting requirements. Workflows align with ISO 45001 standards and the platform generates audit-ready records that satisfy both internal governance and external regulatory review. Every report is timestamped, immutable and exportable.',
  },
  {
    q: 'Can I add photos and videos to a report?',
    a: 'Yes. Workers can attach photos, short video clips and voice notes directly within the report form. All media is automatically timestamped and geotagged at the point of capture, and remains permanently linked to the incident record, accessible to investigators and auditors at any time.',
  },
  {
    q: 'How do supervisors get notified?',
    a: 'Named supervisors receive an instant push notification and email alert the moment a report is submitted. Notification rules are configurable based on incident type, severity or location. Escalation paths ensure the right people are always informed: if a supervisor is unavailable, the next person in the chain is automatically notified.',
  },
  {
    q: 'Where is my data hosted?',
    a: 'jobsafe runs on UK-based Amazon Web Services (AWS) infrastructure. Your data is encrypted at rest (AES-256) and in transit (TLS), backed up automatically, and handled in line with UK GDPR. A formal data processing agreement is available on request.',
  },
]

export function HomePhase1() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeGraph }} />
        <Hero />
        <Industries />
        <Features />
        <HowItWorks />
        <Results />
        <CtaBand
          tone="white"
          placement="home-mid-strip"
          title="Rather see it than read about it?"
          copy={`A live walkthrough on your own sites. ${DEMO_DURATION_LABEL}, at a time that suits.`}
        />
        <Pricing />
        <Faq items={FAQS} lead="Everything you need to know about jobsafe." />
        <Closing />
      </main>
      <Footer />
    </>
  )
}

export default HomePhase1
