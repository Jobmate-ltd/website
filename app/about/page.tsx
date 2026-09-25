import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import {
  ADDRESS,
  ADMIN_PRICE_EX_VAT_LABEL,
  ANNUAL_TERMS,
  EMAIL_SALES,
  ENTRY_PRICE_EX_VAT_LABEL,
  LEGAL_NAME,
  MAKER_LINE,
  PARENT_ORG_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_URL,
  canonicalFor,
} from '@/lib/brand'
import { breadcrumbSchema, graph, jsonLd, organizationSchema, softwareApplicationSchema } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { CtaBand } from '@/components/ui/cta-band'

// This page deliberately names the competing "jobsafe" entities in their own
// casing, and deliberately states that jobsafe has NO checklists module. Both
// are required by the SEO Operating Instructions (§5.6 and §4). The audit is
// told to expect them here, and only here. Neither claim changes in Phase 1
// (Workstream D); Phase 2 rewrites this page when the platform launches.
//
// seo-audit-ignore: brand-casing
// seo-audit-ignore: no-checklists

const PATH = '/about'
const URL = canonicalFor(PATH)

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'About jobsafe: UK incident reporting software',
  description:
    'jobsafe is a UK workplace incident reporting app made by Jobmate Ltd in Wolverhampton. Who we are, what the app does, and what it deliberately does not do.',
  ogTitle: 'About jobsafe',
})

const pageGraph = jsonLd(
  graph(
    organizationSchema(),
    softwareApplicationSchema(URL),
    breadcrumbSchema([
      { name: 'Home', item: `${SITE_URL}/` },
      { name: 'About', item: URL },
    ]),
  ),
)

/**
 * Other organisations that share our name. Their casing is their own and must
 * not be normalised to lowercase — that is the entire point of the section.
 */
const OTHER_ENTITIES = [
  { name: 'jobSAFE (New Zealand)', note: 'a long-established health and safety platform serving New Zealand and Australia.' },
  { name: 'JobSafe Pro', note: 'a separate product, unconnected to us.' },
  { name: 'Jobsafe (Sweden)', note: 'a Swedish service operating under a similar name.' },
  { name: 'JobSafe safety gloves', note: 'a personal protective equipment brand sold in Poland and elsewhere in Europe.' },
] as const

const link = 'font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 hover:decoration-brand-strong'

export default function About() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
        <PageHero
          container="narrow"
          breadcrumbs={<Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'About', href: PATH }]} />}
          eyebrow="About"
          title="About jobsafe, UK workplace incident reporting"
          lead={
            <>
              jobsafe is a workplace incident reporting app for United Kingdom field, construction, care, manufacturing and
              transport teams. {MAKER_LINE} {LEGAL_NAME} is a software company registered in England and Wales and based in
              Wolverhampton. Workers report incidents, near misses and hazards from a phone, offline if they have to, and
              supervisors resolve them from a single dashboard.
            </>
          }
        />

        <Section container="prose" as="article">
          <div className="flex flex-col gap-12 type-body text-ink-2">
            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Who builds jobsafe</h2>
              <p>
                {MAKER_LINE} {LEGAL_NAME} is the company behind the{' '}
                <a href={PARENT_ORG_URL} target="_blank" rel="noopener noreferrer" className={link}>
                  Jobmate
                </a>{' '}
                field operations platform. Jobmate serves organisations that send people out to do physical work: engineers,
                fitters, drivers, maintenance crews. jobsafe grew directly out of what those customers kept asking for: a way to
                capture what goes wrong at the moment it goes wrong, rather than on a paper form that reaches the office three
                days later, if at all.
              </p>
              <p>
                jobsafe runs as a standalone product with its own subscription, its own app, and its own sign-up. You do not
                need to be a Jobmate customer to use it. The two share a company, an engineering team, and a view of how field
                software ought to behave.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">What jobsafe does</h2>
              <p>
                jobsafe is a single, structured capture flow for health, safety, security and environment (HSSE) events. A
                worker opens the app, chooses the report type, and is walked through prompts that collect exactly what an
                investigator will later need. Photographs, video and voice notes attach in a few taps. Every report is stamped
                with the time and the GPS location at which it was filed, and none of that depends on having a signal: reports
                captured underground, in a plant room, or on a rural verge are stored on the device and sync the moment
                connectivity returns.
              </p>
              <p>
                On the other side, supervisors are alerted the instant a report lands, and every view, edit, comment and status
                change is written to the report&apos;s audit trail. The result is a defensible chain of evidence from first
                report to final closure, and a dashboard that surfaces the patterns hiding in the data: the crossing where near
                misses keep happening, the shift where manual handling injuries cluster.
              </p>
              <p>
                The workflows are aligned with{' '}
                <a href="https://www.iso.org/standard/63787.html" target="_blank" rel="noopener noreferrer" className={link}>
                  ISO 45001
                </a>
                , the international standard for occupational health and safety management systems, and the records jobsafe
                produces are structured to support{' '}
                <Link href="/insights/riddor-reporting-explained" className={link}>
                  RIDDOR reporting to the HSE
                </Link>
                . jobsafe does not submit RIDDOR reports on your behalf; it gives you the evidence and the deadline discipline to
                submit them yourself, properly and on time.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">What jobsafe does not do</h2>
              <p>It is worth being direct about the boundaries, because a great deal of health and safety software claims to be everything at once.</p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  jobsafe has <strong className="text-ink-1">no inspection or audit checklist module</strong>, and no form
                  builder. It is not a replacement for an inspection regime. If checklists are what you need, jobsafe is not the
                  tool, and we would rather tell you that now.
                </li>
                <li>
                  jobsafe is <strong className="text-ink-1">not a risk assessment tool</strong>. It records what has happened.
                  Assessing what might happen, and controlling it, remains your process.
                </li>
                <li>
                  jobsafe does <strong className="text-ink-1">not file statutory reports for you</strong>. RIDDOR submissions go
                  to the HSE through the HSE&apos;s own channels.
                </li>
              </ul>
              <p>
                What it does, it does properly: capture, escalate, investigate, resolve, and learn. Read more about{' '}
                <Link href="/insights/near-miss-reporting-safety-culture" className={link}>
                  why near miss reporting is the leading indicator that matters
                </Link>
                , or about{' '}
                <Link href="/insights/lone-worker-safety-guide" className={link}>
                  your legal duties towards lone workers
                </Link>
                .
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Other organisations called jobsafe</h2>
              <p>
                &ldquo;jobsafe&rdquo; is not a unique name. Several unrelated organisations use some form of it, and people
                looking for one of them sometimes land here. To be unambiguous: this site belongs to the UK incident reporting
                app made by {LEGAL_NAME} of Wolverhampton. We are not affiliated with, endorsed by, or connected to any of the
                following:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {OTHER_ENTITIES.map(({ name, note }) => (
                  <li key={name}>
                    <strong className="text-ink-1">{name}</strong>, {note}
                  </li>
                ))}
              </ul>
              <p>If you were looking for one of those, we are sorry to have got in the way. If you were looking for a UK incident reporting app, you are in the right place.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">How jobsafe is built</h2>
              <p>
                The mobile app is a native build, Angular 20, Ionic 8 and Capacitor 8, shipped to the App Store and Google Play
                rather than wrapped in a browser tab. That choice matters for one reason above all others: the camera, the GPS
                and the local database have to work when the network does not. A worker at the bottom of a lift shaft or three
                miles down a service road cannot wait for a page to load.
              </p>
              <p>
                So jobsafe is offline-first by construction, not by feature flag. Reports are written to the device, queued, and
                reconciled with the server when a signal returns. Nothing is lost in between, and nothing about the capture flow
                changes depending on whether the worker has bars. The web dashboard supervisors use is a separate surface with a
                separate job: triage, escalation, investigation and the analytics that turn a year of reports into a decision
                about where to put the money.
              </p>
              <p>We are a small team and we would rather do one thing to a standard we can defend than five things adequately. That is why the list above is as blunt as it is.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Where your data lives</h2>
              <p>
                jobsafe software and customer data are hosted in United Kingdom-based Amazon Web Services infrastructure. Data
                is encrypted at rest and in transit, backed up automatically, and processed under the UK GDPR and the Data
                Protection Act 2018. The customer is the data controller; jobsafe is the data processor. A formal data
                processing agreement is available on request. Our{' '}
                <Link href="/privacy-policy" className={link}>
                  privacy policy
                </Link>
                ,{' '}
                <Link href="/cookies" className={link}>
                  cookie notice
                </Link>{' '}
                and{' '}
                <Link href="/terms" className={link}>
                  terms and conditions
                </Link>{' '}
                set out the detail.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Pricing, plainly</h2>
              <p>
                Two licence types, priced per licence per month with every feature included on both. Worker licences start at{' '}
                {ENTRY_PRICE_EX_VAT_LABEL}, falling for larger deployments, with bespoke terms above a thousand users. Admin
                licences are {ADMIN_PRICE_EX_VAT_LABEL}. Annual billing gives you {ANNUAL_TERMS}. Full detail is on the{' '}
                <Link href="/#pricing" className={link}>
                  pricing section of the homepage
                </Link>
                .
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Contact us</h2>
              <p>
                The quickest way to judge whether jobsafe suits your operation is to watch it handle a report from one of your
                own sites.{' '}
                <BookDemoButton placement="about-contact" variant="link">
                  Book a demo
                </BookDemoButton>{' '}
                and we will do exactly that. Otherwise, we are here:
              </p>
              <address className="flex flex-col gap-1 not-italic">
                <p className="font-bold text-ink-1">{LEGAL_NAME}</p>
                <p>{ADDRESS.streetAddress}</p>
                <p>
                  {ADDRESS.addressLocality} {ADDRESS.postalCode}
                </p>
                <p>United Kingdom</p>
                <p className="pt-2">
                  <a href={PHONE_HREF} className={link}>
                    {PHONE_DISPLAY}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${EMAIL_SALES}`} className={link}>
                    {EMAIL_SALES}
                  </a>
                </p>
              </address>
            </section>
          </div>
        </Section>

        <CtaBand
          placement="about-closing"
          title="See it handle a report from one of your own sites"
          copy="A live walkthrough, then the dashboard and the audit trail behind it."
          secondary={{ label: 'Read the insights', href: '/insights' }}
        />
      </main>
      <Footer />
    </>
  )
}
