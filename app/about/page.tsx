import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import BookDemoButton from '@/components/ui/book-demo-button'
import {
  ADDRESS,
  EMAIL_SALES,
  ENTRY_PRICE_LABEL,
  LEGAL_NAME,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_URL,
} from '@/lib/brand'
import {
  breadcrumbSchema,
  graph,
  jsonLd,
  organizationSchema,
  softwareApplicationSchema,
} from '@/lib/schema'

// This page deliberately names the competing "jobsafe" entities in their own
// casing, and deliberately states that jobsafe has NO checklists module. Both
// are required by the SEO Operating Instructions (§5.6 and §4). The audit is
// told to expect them here, and only here.
//
// seo-audit-ignore: brand-casing
// seo-audit-ignore: no-checklists

const URL = `${SITE_URL}/about`

export const metadata: Metadata = {
  // Renders as "About jobsafe | jobsafe" — 30 chars, well inside the 60 limit.
  title: 'About jobsafe',
  description:
    'jobsafe is a UK workplace incident reporting app built by Jobmate Ltd in Wolverhampton. Who we are, what the app does, and what it deliberately does not do.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'About jobsafe',
    description:
      'A UK workplace incident reporting app, built by Jobmate Ltd in Wolverhampton.',
    url: URL,
    type: 'website',
  },
}

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
 * seo-audit-ignore: brand-casing
 */
const OTHER_ENTITIES = [
  {
    name: 'jobSAFE (New Zealand)',
    note: 'a long-established health and safety platform serving New Zealand and Australia.',
  },
  {
    name: 'JobSafe Pro',
    note: 'a separate product, unconnected to us.',
  },
  {
    name: 'Jobsafe (Sweden)',
    note: 'a Swedish service operating under a similar name.',
  },
  {
    name: 'JobSafe safety gloves',
    note: 'a personal protective equipment brand sold in Poland and elsewhere in Europe.',
  },
] as const

export default function About() {
  return (
    <main className="bg-surface-0 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageGraph }}
      />
      <Navbar />

      <article className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-white/60">About</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white text-balance mb-8">
          About jobsafe — UK workplace incident reporting
        </h1>

        {/* Above-the-fold answer. The first 60 words state the entity plainly,
            because this is the passage AI Overviews and knowledge panels lift. */}
        <p className="text-lg text-white/70 leading-relaxed mb-10">
          jobsafe is a workplace incident reporting app for United Kingdom field,
          construction, manufacturing and transport teams. It is built and
          operated by {LEGAL_NAME}, a software company registered in England and
          Wales and based in Wolverhampton. Workers report incidents, near misses
          and hazards from a phone — offline if they have to — and supervisors
          resolve them from a single dashboard.
        </p>

        <div className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed space-y-6">
          <section>
            <h2 className="text-white font-bold text-xl mb-3">Who builds jobsafe</h2>
            <p>
              jobsafe is a product of {LEGAL_NAME}, the company behind the{' '}
              <a
                href="https://jobmate.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Jobmate
              </a>{' '}
              field operations platform. Jobmate serves organisations that send
              people out to do physical work — engineers, fitters, drivers,
              maintenance crews — and jobsafe grew directly out of what those
              customers kept asking for: a way to capture what goes wrong at the
              moment it goes wrong, rather than on a paper form that reaches the
              office three days later, if at all.
            </p>
            <p>
              jobsafe runs as a standalone product with its own subscription, its
              own app, and its own sign-up. You do not need to be a Jobmate
              customer to use it. The two share a company, an engineering team,
              and a view of how field software ought to behave.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">What jobsafe does</h2>
            <p>
              jobsafe is a single, structured capture flow for health, safety,
              security and environment (HSSE) events. A worker opens the app,
              chooses the report type, and is walked through prompts that collect
              exactly what an investigator will later need. Photographs, video and
              voice notes attach in seconds. Every report is stamped with the time
              and the GPS location at which it was filed, and none of that depends
              on having a signal — reports captured underground, in a plant room,
              or on a rural verge are stored on the device and sync the moment
              connectivity returns.
            </p>
            <p>
              On the other side, supervisors are alerted the instant a report
              lands, and every view, edit, comment and status change is written to
              an immutable audit trail. The result is a defensible chain of
              evidence from first report to final closure, and a dashboard that
              surfaces the patterns hiding in the data — the crossing where near
              misses keep happening, the shift where manual handling injuries
              cluster.
            </p>
            <p>
              The workflows are aligned with{' '}
              <a
                href="https://www.iso.org/standard/63787.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                ISO 45001
              </a>
              , the international standard for occupational health and safety
              management systems, and the records jobsafe produces are structured
              to support{' '}
              <Link href="/insights/riddor-reporting-explained" className="text-brand hover:underline">
                RIDDOR reporting to the HSE
              </Link>
              . jobsafe does not submit RIDDOR reports on your behalf; it gives
              you the evidence and the deadline discipline to submit them
              yourself, properly and on time.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">What jobsafe does not do</h2>
            <p>
              It is worth being direct about the boundaries, because a great deal
              of health and safety software claims to be everything at once.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                jobsafe has <strong className="text-white/80">no inspection or audit checklist module</strong>, and no
                form builder. It is not a replacement for an inspection regime.
                If checklists are what you need, jobsafe is not the tool, and we
                would rather tell you that now.
              </li>
              <li>
                jobsafe is <strong className="text-white/80">not a risk assessment tool</strong>. It records what has
                happened. Assessing what might happen, and controlling it, remains
                your process.
              </li>
              <li>
                jobsafe does <strong className="text-white/80">not file statutory reports for you</strong>. RIDDOR
                submissions go to the HSE through the HSE&apos;s own channels.
              </li>
            </ul>
            <p>
              What it does, it does properly: capture, escalate, investigate,
              resolve, and learn. Read more about{' '}
              <Link href="/insights/near-miss-reporting-safety-culture" className="text-brand hover:underline">
                why near miss reporting is the leading indicator that matters
              </Link>
              , or about{' '}
              <Link href="/insights/lone-worker-safety-guide" className="text-brand hover:underline">
                your legal duties towards lone workers
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">
              Other organisations called jobsafe
            </h2>
            <p>
              &ldquo;jobsafe&rdquo; is not a unique name. Several unrelated
              organisations use some form of it, and people looking for one of
              them sometimes land here. To be unambiguous: this site belongs to
              the UK incident reporting app built by {LEGAL_NAME} of
              Wolverhampton. We are not affiliated with, endorsed by, or
              connected to any of the following:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {OTHER_ENTITIES.map(({ name, note }) => (
                <li key={name}>
                  <strong className="text-white/80">{name}</strong> — {note}
                </li>
              ))}
            </ul>
            <p>
              If you were looking for one of those, we are sorry to have got in
              the way. If you were looking for a UK incident reporting app, you
              are in the right place.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">How jobsafe is built</h2>
            <p>
              The mobile app is a native build — Angular 20, Ionic 8 and
              Capacitor 8 — shipped to the App Store and Google Play rather than
              wrapped in a browser tab. That choice matters for one reason above
              all others: the camera, the GPS and the local database have to work
              when the network does not. A worker at the bottom of a lift shaft
              or three miles down a service road cannot wait for a page to load.
            </p>
            <p>
              So jobsafe is offline-first by construction, not by feature flag.
              Reports are written to the device, queued, and reconciled with the
              server when a signal returns. Nothing is lost in between, and
              nothing about the capture flow changes depending on whether the
              worker has bars. The web dashboard supervisors use is a separate
              surface with a separate job: triage, escalation, investigation and
              the analytics that turn a year of reports into a decision about
              where to put the money.
            </p>
            <p>
              We are a small team and we would rather do one thing to a standard
              we can defend than five things adequately. That is why the list in
              the previous section is as blunt as it is.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">
              Where your data lives
            </h2>
            <p>
              jobsafe software and customer data are hosted in United
              Kingdom-based Amazon Web Services infrastructure. Data is encrypted
              at rest and in transit, backed up automatically, and processed under
              the UK GDPR and the Data Protection Act 2018. The customer is the
              data controller; jobsafe is the data processor. A formal data
              processing agreement is available on request, and is included as
              standard on Enterprise plans. Our{' '}
              <Link href="/privacy-policy" className="text-brand hover:underline">
                privacy policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-brand hover:underline">
                terms and conditions
              </Link>{' '}
              set out the detail.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">
              Pricing, plainly
            </h2>
            <p>
              One price per licence, per month, with every feature included on
              every plan. There are no feature tiers to climb and nothing held
              back for an upsell. Licences start at {ENTRY_PRICE_LABEL} per
              licence per month, falling for larger deployments, with bespoke
              terms above a thousand users. Full detail is on the{' '}
              <Link href="/#pricing" className="text-brand hover:underline">
                pricing section of the homepage
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-xl mb-3">Contact us</h2>
            <p className="mb-5">
              The quickest way to judge whether jobsafe suits your operation is
              to watch it handle a report from one of your own sites.{' '}
              <BookDemoButton placement="about-contact" variant="quiet" className="text-brand hover:text-brand decoration-brand/40 hover:decoration-brand">
                Book a demo
              </BookDemoButton>{' '}
              and we will do exactly that. Otherwise, we are here:
            </p>
            <address className="not-italic space-y-1">
              <p className="text-white/80 font-semibold">{LEGAL_NAME}</p>
              <p>{ADDRESS.streetAddress}</p>
              <p>
                {ADDRESS.addressLocality} {ADDRESS.postalCode}
              </p>
              <p>United Kingdom</p>
              <p className="pt-2">
                <a href={PHONE_HREF} className="text-brand hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <a href={`mailto:${EMAIL_SALES}`} className="text-brand hover:underline">
                  {EMAIL_SALES}
                </a>
              </p>
            </address>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
