import Link from 'next/link'
import { ADDRESS, EMAIL_SALES, HOSTING_DETAIL, HOSTING_LINE, LEGAL_NAME, MAKER_LINE, PARENT_ORG_URL, PHONE_DISPLAY, PHONE_HREF, canonicalFor } from '@/lib/brand'
import { h1For } from '@/lib/seo'
import { breadcrumbSchema, breadcrumbsFromTrail, graph, jsonLd, organizationSchema, platformApplicationSchema } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { CtaBand } from '@/components/ui/cta-band'

// This page deliberately names the competing "jobsafe" entities in their own
// casing — that is the point of the disambiguation section.
//
// seo-audit-ignore: brand-casing

const PATH = '/about'
const CRUMBS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: PATH },
]

const OTHER_ENTITIES = [
  { name: 'jobSAFE (New Zealand)', note: 'a long-established health and safety platform serving New Zealand and Australia.' },
  { name: 'JobSafe Pro', note: 'a separate product, unconnected to us.' },
  { name: 'Jobsafe (Sweden)', note: 'a Swedish service operating under a similar name.' },
  { name: 'JobSafe safety gloves', note: 'a personal protective equipment brand sold in Poland and elsewhere in Europe.' },
] as const

const link = 'font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 hover:decoration-brand-strong'

/**
 * AboutPlatform — /about once the platform has launched: the story from
 * incident reporting to a platform, what it does not do (the true list), who
 * else is called jobsafe, the maker line and the hosting line.
 */
export function AboutPlatform() {
  const schema = jsonLd(graph(organizationSchema(), platformApplicationSchema(canonicalFor(PATH)), breadcrumbSchema(breadcrumbsFromTrail(CRUMBS))))
  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <PageHero
          container="narrow"
          breadcrumbs={<Breadcrumbs items={CRUMBS} />}
          eyebrow="About"
          title={h1For(PATH)}
          lead={`${MAKER_LINE} A UK health and safety platform for operators whose work happens in yards, sites, depots and vans. ${HOSTING_LINE}.`}
        />
        <Section container="prose" as="article">
          <div className="flex flex-col gap-12 type-body text-ink-2">
            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">From incident reporting to a platform</h2>
              <p>
                jobsafe started as one thing done properly: a way for a worker to record an incident or a near miss at the moment it happened, from a phone, with the photo and the location attached, whether or not there was signal. Customers in transport, construction, care and field service used it for exactly that.
              </p>
              <p>
                What they asked for next was always the same. The incident needed an investigation. The investigation raised actions. The actions pointed at a risk assessment that needed re-scoring, a permit that should not have been issued, a vehicle that was overdue, a driver whose training had lapsed. Every one of those lived in a different spreadsheet, a different folder or a different supplier.
              </p>
              <p>
                So we built the rest around the same record. Today jobsafe is incidents and RIDDOR, investigations and corrective actions, permits to work and contractors, risk assessments with bowtie analysis, checklists, fleet and plant, training and competence, document control and dashboards. All of it saves to the phone first and syncs itself, and all of it is hosted in London. The <Link href="/platform" className={link}>platform overview</Link> shows how the modules feed one another.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">What jobsafe does not do</h2>
              <p>It is worth being direct, because a great deal of health and safety software claims to be everything at once.</p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  It does <strong className="text-ink-1">not submit RIDDOR reports to HSE for you</strong>. It tells you whether an incident is reportable and by when, and keeps the record and the reference; you make the submission. See <Link href="/platform/riddor" className={link}>RIDDOR reporting</Link>.
                </li>
                <li>
                  It is <strong className="text-ink-1">not a lone-worker alarm</strong>: not a man-down device and not a monitored panic service. Where your risk assessment calls for one, you still need one.
                </li>
                <li>
                  It is <strong className="text-ink-1">not telematics</strong>. It does not track vehicles, score driving or read the tachograph. It keeps the dates, the checks and the incidents on each vehicle.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Who builds it</h2>
              <p>
                {MAKER_LINE} {LEGAL_NAME} is based at {ADDRESS.streetAddress}, {ADDRESS.addressLocality} {ADDRESS.postalCode}, and also makes the{' '}
                <a href={PARENT_ORG_URL} target="_blank" rel="noopener noreferrer" className={link}>
                  Jobmate
                </a>{' '}
                field operations platform for organisations that send people out to do physical work. jobsafe is a standalone product with its own subscription; you do not need to be a Jobmate customer to use it. The two share a company, an engineering team and a view of how software for people in vans ought to behave.
              </p>
              <p>
                We are a small team and we would rather do the record properly than bolt on a feature we cannot stand behind. That is why the list above is as short as it is, and why the <Link href="/pricing" className={link}>pricing</Link> is in pounds with VAT shown.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Where your data lives</h2>
              <p>
                {HOSTING_LINE}: the {HOSTING_DETAIL}. Each organisation is walled off by row-level security with its own private file storage, and every register exports to CSV. The detail, including roles and what you can ask for, is on the{' '}
                <Link href="/security" className={link}>
                  security page
                </Link>
                .
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Other organisations called jobsafe</h2>
              <p>
                &ldquo;jobsafe&rdquo; is not a unique name. Several unrelated organisations use some form of it, and people looking for one of them sometimes land here. To be unambiguous: this site belongs to the UK health and safety platform made by {LEGAL_NAME} of Wolverhampton. We are not affiliated with, endorsed by, or connected to any of the following:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {OTHER_ENTITIES.map(({ name, note }) => (
                  <li key={name}>
                    <strong className="text-ink-1">{name}</strong>, {note}
                  </li>
                ))}
              </ul>
              <p>If you were looking for one of those, we are sorry to have got in the way. If you were looking for a UK health and safety platform, you are in the right place.</p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="type-h3 text-ink-1">Contact us</h2>
              <p>
                Sales:{' '}
                <a href={`mailto:${EMAIL_SALES}`} className={link}>
                  {EMAIL_SALES}
                </a>
                . Phone:{' '}
                <a href={PHONE_HREF} className={link}>
                  {PHONE_DISPLAY}
                </a>
                . Everything else is on the{' '}
                <Link href="/contact" className={link}>
                  contact page
                </Link>
                , or <Link href="/demo" className={link}>book a 30-minute walkthrough</Link>.
              </p>
            </section>
          </div>
        </Section>
        <CtaBand tone="grey" placement="about-closing" title="See the platform on a real setup." copy="Thirty minutes, on a UK haulier’s data, with someone who knows the product." secondary={{ label: 'How the demo works', href: '/demo' }} />
      </main>
      <Footer />
    </>
  )
}

export default AboutPlatform
