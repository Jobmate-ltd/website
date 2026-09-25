import type { Metadata } from 'next'
import Image from 'next/image'
import { pageMetadata } from '@/lib/seo'
import { ENTRY_PRICE_EX_VAT_LABEL, SIGNUP_TRIAL_URL, SITE_URL, TRIAL, canonicalFor, PLATFORM_LAUNCH } from '@/lib/brand'
import { breadcrumbSchema, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { LeadForm } from '@/components/toolkit/lead-form'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'
import { MediaFrame } from '@/components/ui/frame'
import { CtaBand } from '@/components/ui/cta-band'
import { ModuleBacklink } from '@/components/insights/module-backlink'

const PATH = '/toolkit'
const URL = canonicalFor(PATH)

/**
 * The title carries the site name once: the root template appends " | jobsafe",
 * so the page title must not (the previous page rendered "… | jobsafe | jobsafe").
 */
export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'The site incident and near-miss reporting toolkit',
  description:
    'Free for UK construction: a seven-page PDF with a ready-to-use incident and near-miss report template, the RIDDOR decision flowchart, and near-miss triage. Record. Resolve. Prevent.',
  ogTitle: 'Free incident and near-miss reporting toolkit | jobsafe',
})

/** The toolkit is a seven-page PDF; these are the three working pages it is built around. */
const INSIDE = [
  {
    n: '01',
    title: 'The report template',
    body: 'Every field an investigator needs, and none they do not. Print it, or fill it on-screen.',
    image: '/toolkit/page-template.png',
    alt: 'The incident and near-miss report template page from the toolkit',
  },
  {
    n: '02',
    title: 'Is it RIDDOR-reportable?',
    body: 'Four questions. The first “yes” tells you whether it goes to the HSE, and by when.',
    image: '/toolkit/page-flowchart.png',
    alt: 'The RIDDOR decision flowchart page from the toolkit',
  },
  {
    n: '03',
    title: 'Near-miss triage',
    body: 'What to do in the first 24 hours after a near miss, from making it safe to naming the owner of the fix.',
    image: '/toolkit/page-triage.png',
    alt: 'The near-miss triage page from the toolkit',
  },
] as const

const pageGraph = jsonLd(
  graph(
    breadcrumbSchema([
      { name: 'Home', item: `${SITE_URL}/` },
      { name: 'Toolkit', item: URL },
    ]),
  ),
)

export default function ToolkitPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />

        {/* Hero: message left, gate right. The form is the CTA, so there is no second one here. */}
        <section className="relative overflow-hidden border-b border-line-1 bg-canvas">
          <HeroBackdrop radial="left" />
          <Container size="wide" className="relative pb-16 pt-10 md:pb-24 md:pt-14">
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Toolkit', href: PATH }]} className="mb-8" />
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="flex flex-col gap-6">
                <Eyebrow>Free toolkit · UK construction</Eyebrow>
                <h1 className="type-display text-ink-1">
                  Most near-misses
                  <br />
                  <span className="text-brand">never get written down.</span>
                </h1>
                <p className="type-lead measure text-ink-4">
                  This is the toolkit that fixes that: a seven-page PDF with the report template, the RIDDOR flowchart, and
                  near-miss triage.
                </p>
                <div className="hidden max-w-[230px] lg:block">
                  <MediaFrame>
                    <Image src="/toolkit/page-cover.png" alt="The cover of the Site Incident and Near-Miss Reporting Toolkit" width={430} height={608} sizes="230px" />
                  </MediaFrame>
                </div>
              </div>
              <div className="lg:pt-10">
                <LeadForm />
              </div>
            </div>
          </Container>
        </section>

        {/* What is inside: three real pages, not three identical text cards. */}
        <Section tone="grey">
          <SectionHeading eyebrow="What is inside" title="Seven pages, three tools. Nothing you have to read twice." lead="The three pages you will use on site, from the seven in the PDF." tone="grey" />
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {INSIDE.map((item) => (
              <li key={item.n} className="flex flex-col gap-4">
                <MediaFrame>
                  <Image src={item.image} alt={item.alt} width={640} height={905} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </MediaFrame>
                <p className="type-mono text-sm font-medium text-brand-strong">{item.n}</p>
                <h3 className="type-h3 -mt-2 text-ink-1">{item.title}</h3>
                <p className="type-small text-ink-5">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="type-small mt-12 max-w-[62ch] border-l-2 border-brand pl-5 text-ink-4">
            Guidance for UK workplaces, not legal advice. RIDDOR thresholds and deadlines change, so always check the current
            guidance at{' '}
            <a href="https://www.hse.gov.uk/riddor/" rel="noreferrer noopener" target="_blank" className="font-semibold text-brand-strong underline underline-offset-4">
              hse.gov.uk/riddor
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </Section>

        <CtaBand
          tone="white"
          placement="toolkit-closing"
          title="Now do all of that from your phone"
          copy="Same report, same detail, from the phone in your pocket. It routes itself to the right person and tracks to close-out."
          primary={PLATFORM_LAUNCH ? undefined : { label: 'Start your free trial', href: SIGNUP_TRIAL_URL }}
          secondary={PLATFORM_LAUNCH ? { label: 'Start your free trial', href: SIGNUP_TRIAL_URL } : { label: 'Book a demo', href: '/#get-started' }}
          note={PLATFORM_LAUNCH ? <ModuleBacklink path={PATH} bare /> : `From ${ENTRY_PRICE_EX_VAT_LABEL} per licence per month. ${TRIAL.label}.`}
        />
      </main>
      <Footer />
    </>
  )
}
