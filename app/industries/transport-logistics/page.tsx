import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Pricing from '@/components/sections/Pricing'
import PageFAQ from '@/components/sections/PageFAQ'
import Reveal from '@/components/ui/reveal'
import {
  DEMO_DURATION_LABEL,
  ENTRY_PRICE_LABEL,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_URL,
  TRIAL,
} from '@/lib/brand'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import BookDemoButton from '@/components/ui/book-demo-button'
import {
  breadcrumbSchema,
  graph,
  jsonLd,
  softwareApplicationSchema,
  type FaqEntry,
} from '@/lib/schema'
import {
  PiChartBar,
  PiCrosshair,
  PiEye,
  PiFileArrowDown,
  PiFolders,
  PiHandshake,
  PiScales,
  PiUsersThree,
  PiWarningDiamond,
} from 'react-icons/pi'

const PAGE_PATH = '/industries/transport-logistics'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`

export const metadata: Metadata = {
  title: 'Health & Safety Software for Transport & Logistics',
  description:
    'Incident and near-miss reporting for UK transport, logistics and warehousing operators. Evidence for PQQs, customer audits and the HSE. Start free.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Health & Safety Software for Transport & Logistics | jobsafe',
    description:
      'Contracts in this sector are won and lost on HSE performance. Evidence-grade incident and near-miss reporting across every depot, yard and cab.',
    url: PAGE_URL,
    type: 'website',
  },
}

const pageGraph = jsonLd(
  graph(
    breadcrumbSchema([
      { name: 'Home', item: `${SITE_URL}/` },
      { name: 'Transport, Logistics & Warehousing', item: PAGE_URL },
    ]),
    softwareApplicationSchema(PAGE_URL),
  ),
)

// ── Section content ──────────────────────────────────────────────────────────
// This page is written for operations and HSEQ management, not for the people
// doing the work, and it leans on enforcement facts. Every legal claim below is
// checkable and stated without a number we cannot stand behind (§0.7 — never
// fabricate statistics):
//
//   • Sentencing Council Definitive Guideline for Health and Safety Offences,
//     in force 01/02/2016. Fines are assessed against TURNOVER, and against the
//     harm RISKED as well as the harm caused. Large organisation (£50m+
//     turnover): health and safety range reaches £10m; corporate manslaughter
//     reaches £20m. Those are the published range ceilings.
//   • HSWA 1974 s.37 — personal liability for a director or manager where the
//     offence is committed with their consent or connivance, or attributable to
//     their neglect. Disqualification is available to the court under CDDA 1986.
//   • HSE's public register of convictions and enforcement notices is
//     searchable by company name at hse.gov.uk.
//
// Deliberately NOT stated: the Fee for Intervention hourly rate (it is revised
// and we will not put an unverified figure on a live page), and any injury or
// fatality count. Workplace transport is described qualitatively for the same
// reason. Nothing here promises a module jobsafe does not have (§0.4) — the
// first FAQ states plainly that this is not telematics.

const painCards = [
  {
    icon: PiChartBar,
    title: 'A customer’s PQQ asks for your accident frequency rate over three years. Can you produce one?',
    body: 'An accident frequency rate is arithmetic performed on data you either captured or you didn’t. jobsafe gives you the half that is hard to reconstruct: every incident, dated, categorised and attributable to a site — so the answer is a report rather than an estimate.',
  },
  {
    icon: PiWarningDiamond,
    title: 'Your near-miss numbers are suspiciously low. An auditor knows what that means.',
    body: 'A near-zero near-miss count does not read as a safe operation. It reads as a reporting failure — and a sudden spike reads as a system that has only just started working. Capture that takes under a minute is how you get a number that means something.',
  },
  {
    icon: PiUsersThree,
    title: 'The shift manager knew on Tuesday. You found out at the monthly review.',
    body: 'Real-time alerts put the report in front of the office the moment it is submitted, and the dashboard breaks reports down by site — so a pattern at one depot is visible while it is still one depot’s problem.',
  },
  {
    icon: PiFolders,
    title: 'An inspector asks for three years of records. Where are they, exactly?',
    body: 'Every report is timestamped, immutable and exportable, held in one place across every depot, yard and vehicle — rather than across three ring binders, a shared drive and a supervisor’s phone.',
  },
]

const commercialCards = [
  {
    icon: PiCrosshair,
    title: 'Tenders are scored on it',
    body: 'Retailers, manufacturers and public bodies score HSE performance directly: RIDDOR counts, accident frequency rate, enforcement notices and prosecutions over the last three to five years. FORS and CLOCS put the same questions in writing. A bid that cannot evidence its record loses to one that can.',
  },
  {
    icon: PiScales,
    title: 'How the fine is actually calculated',
    body: 'Since 2016 the sentencing guideline has set health and safety fines against turnover rather than profit, and against the harm risked rather than only the harm caused. For a large organisation the range reaches £10m, and £20m for corporate manslaughter. On logistics margins, a turnover-based fine is a different kind of number.',
  },
  {
    icon: PiHandshake,
    title: 'Cover, and the person who signs',
    body: 'Employers’ liability and motor fleet renewals turn on claims history and on whether you can show the risk is managed. And under section 37 of the Health and Safety at Work etc. Act 1974, where an offence is attributable to the neglect of a director or manager, that individual is personally liable — with disqualification available to the court.',
  },
]

const faqs: readonly FaqEntry[] = [
  {
    q: 'Is this telematics or a driver-behaviour system?',
    a: 'No. jobsafe does not track vehicles, score driving, or replace your tachograph, telematics or camera platform, and it will not tell you who braked hard on the A14. It is the incident and near-miss reporting layer that sits alongside those systems: what happened, where, when, with the evidence attached and an auditable trail from raised to closed. Operators generally have plenty of vehicle data and very little on the near miss in the yard that nobody wrote down.',
  },
  {
    q: 'We already keep an accident book. What does this change?',
    a: 'An accident book is a legal minimum and a record of injuries that have already happened. It tells you nothing about the near misses that preceded them, carries no photographs, no location and no timeline, and cannot be analysed. jobsafe captures the incidents and the near misses with evidence attached at the point of capture, routes them to the right person immediately, and gives you the trend across sites — which is what an auditor, an underwriter and a customer are actually asking to see.',
  },
  {
    q: 'Can we produce an accident frequency rate from it?',
    a: 'jobsafe gives you the half of that calculation that is hard to get right: a complete, dated, categorised incident count you can filter by site and period, and export. The hours-worked figure you divide it by comes from your payroll or workforce system, so the rate itself is assembled by you rather than published by us — but you will no longer be reconstructing the numerator from memory and a spreadsheet.',
  },
  {
    q: 'Can we report by depot, and still see the group picture?',
    a: 'Yes. The dashboard breaks reports down by site, so each depot, yard or contract can be looked at on its own and against the others. jobsafe is licensed per user, so employed, agency and subcontracted staff report through the same app, and every report automatically carries who, where and when — which matters most for the people who are not on your payroll.',
  },
  {
    q: 'Our drivers and yard staff won’t use it.',
    a: 'That is the objection worth taking seriously, because a reporting system nobody uses produces exactly the near-zero numbers an auditor distrusts. A report takes under a minute, on the phone already in their pocket, with photographs and voice notes instead of typing — a driver in gloves at a loading bay will talk when they will not fill in a form. The friction you remove is the reporting rate you get.',
  },
  {
    q: 'What happens with no signal — in a yard, a trailer or a cold store?',
    a: 'The mobile app stores reports on the device and syncs to the cloud as soon as connectivity returns. Steel-clad warehouses, cold stores, underground service yards and rural laybys are exactly where coverage fails and exactly where incidents go unrecorded, so this is not an edge case in this sector — it is the normal case.',
  },
  {
    q: 'Does it help with RIDDOR reporting?',
    a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when you are deciding whether something is reportable and by when. Submitting to the HSE remains your decision — our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
  },
  {
    q: 'Can we export evidence for a customer audit or an insurer?',
    a: 'Yes. Every report is timestamped, immutable and exportable, with its photographs, video and voice notes permanently linked to the record. That is the difference between handing a customer’s auditor an evidenced account and handing them a reconstruction written the week they asked for it.',
  },
  {
    q: 'How long does it take to roll out across several sites?',
    a: `Most teams are live within 30 minutes, and a multi-site rollout is a matter of inviting people rather than installing anything: no hardware, no integration work, no IT project. Onboarding guides and short video lessons in the academy cover the crews. The full product is free for ${TRIAL.days} days with no credit card, which is long enough to run one depot properly and see what the reporting rate actually looks like before you commit.`,
  },
]

const trustFacts = [
  'Built for UK multi-site operators',
  'Evidence for PQQs and audits',
  TRIAL.label,
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TransportLogisticsPage() {
  return (
    <main className="bg-surface-0 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageGraph }}
      />
      <Navbar />

      {/* ── Hero: split text / on-site still ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-black">
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle at top right, rgb(var(--brand-rgb) / 0.18) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-20 md:pb-16 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left — text */}
            <Reveal className="flex flex-col w-full lg:w-[55%]">
              <p className="text-xs font-bold tracking-widest text-brand uppercase mb-6">
                For UK transport, logistics &amp; warehousing operators
              </p>
              <h1
                className="font-black leading-[1.05] tracking-tight text-white mb-7 text-balance"
                style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)' }}
              >
                The fine is set by what{' '}
                <em className="not-italic text-brand">could</em> have happened
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-9 max-w-xl">
                Since 2016 the sentencing guideline has weighed the harm an
                operation <span className="text-white/80">risked</span>, not
                only the harm it caused — and set the fine against turnover.
                Which makes the forklift near miss nobody logged the most
                expensive record you don&apos;t have. jobsafe gives every depot,
                yard and cab an evidenced, timestamped incident and near-miss
                trail: the thing your customer&apos;s bid team, your underwriter
                and an HSE inspector all ask to see.
              </p>
              {/* Same weighting as the homepage hero: demo takes the fill,
                  trial takes the border, the lead magnet steps down to a link
                  so the row reads as two choices rather than three. */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <BookDemoButton placement="industry-logistics-hero" />
                <a
                  href={SIGNUP_TRIAL_URL}
                  className="rounded-md border border-white/20 px-8 py-4 text-sm font-bold text-white transition duration-200 hover:-translate-y-px hover:border-white/40 active:translate-y-0 active:scale-[0.97] motion-reduce:hover:translate-y-0"
                >
                  Start your free trial
                </a>
                <Link
                  href="/toolkit"
                  className="px-2 py-4 text-sm font-bold text-white/60 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-brand"
                >
                  Get the free toolkit
                </Link>
              </div>
            </Reveal>

            {/* Right — on-site still, in the same frame the other industry
                heroes use: greyscale baked into the asset, red blur behind,
                brand wash and vignette over the top. The colour original is the
                homepage industries card, so the two read as one photograph
                graded for two jobs. Swapping in footage later is an in-place
                replacement of this <Image>. */}
            <Reveal index={1} className="w-full lg:w-[45%] flex justify-center">
              <div className="relative w-full max-w-xl">
                {/* Red blur behind the frame */}
                <div
                  aria-hidden
                  className="absolute -inset-10 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 60% 40%, rgb(var(--brand-rgb) / 0.35) 0%, transparent 65%)',
                    filter: 'blur(40px)',
                  }}
                />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_14px_40px_rgb(0_0_0/0.6)]">
                  <Image
                    src="/images/industries/transport-logistics-hero.jpg"
                    alt="A forklift truck working an aisle between loaded pallet racking in a distribution warehouse"
                    width={1280}
                    height={720}
                    priority
                    className="w-full h-auto block"
                  />
                  {/* Brand wash + vignette over the greyscale still */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 85% 15%, rgb(var(--brand-rgb) / 0.22) 0%, transparent 55%), linear-gradient(to top, rgb(0 0 0 / 0.35) 0%, transparent 40%)',
                    }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────────────────────── */}
      <section className="bg-surface-0 border-t border-white/10">
        <ul className="mx-auto max-w-5xl px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 sm:divide-x sm:divide-white/10">
          {trustFacts.map((fact) => (
            <li
              key={fact}
              className="text-xs text-white/60 uppercase tracking-widest flex items-center gap-2 sm:px-8"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* ── The point: the record is public ───────────────────────────────
          The selling point of the page — full editorial statement, not a
          footnote band. Sits directly under the hero, before any feature
          copy. */}
      <section className="relative bg-surface-0 border-y border-white/10 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none w-[900px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at top, rgb(var(--brand-rgb) / 0.14) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
          <Reveal>
            <div className="mx-auto w-12 h-12 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mb-8">
              <PiEye className="size-6 text-brand" strokeWidth={1.75} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-balance text-white leading-[1.05] mb-8">
              Your safety record
              <br />
              is <em className="not-italic text-brand">public</em>.
            </h2>
            <p className="text-white/80 text-lg md:text-2xl leading-relaxed text-balance max-w-3xl mx-auto">
              The HSE publishes convictions and enforcement notices on a
              register anyone can search by company name. Your customers&apos;
              procurement teams can read it — and in a sector where contracts
              turn on HSE performance, they{' '}
              <span className="font-bold text-white">do</span>. Alongside the
              accident frequency rate and RIDDOR history your tender documents
              already ask for, the record you keep is either a commercial asset
              or a commercial problem. You do not get to decide which after the
              fact.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Pain cards ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-surface-0">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white mb-4">
              Four questions with only one good answer
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              None of these are asked by the people driving the trucks. They are
              asked by auditors, underwriters, customers and inspectors — and
              they are all asked of you.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {painCards.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} index={i}>
                <div className="h-full rounded-xl border border-white/10 bg-surface-1 p-7 transition-colors duration-200 hover:border-brand/40">
                  <div className="w-10 h-10 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center mb-5">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-base leading-snug mb-3">
                    {title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commercial payoff: hairline-divided columns ───────────────────── */}
      <section className="py-16 md:py-20 bg-surface-0 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white mb-4">
              Win the tender. Keep the cover.
              <br />
              Survive the audit.
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Operators rarely lose a contract on rate alone. They lose it on a
              safety record they couldn&apos;t evidence when the bid was due.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-y border-white/10">
            {commercialCards.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} index={i}>
                <div className="h-full px-2 py-10 md:px-10">
                  <Icon className="size-6 text-brand mb-5" strokeWidth={1.5} />
                  <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <Link
              href="/insights/near-miss-reporting-safety-culture"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Why near-miss reporting is the number auditors read →
            </Link>
            <Link
              href="/insights/riddor-reporting-explained"
              className="text-sm font-semibold text-brand hover:underline"
            >
              RIDDOR reporting, explained in plain English →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Lower-commitment offer: the free toolkit ──────────────────────── */}
      <section className="py-16 md:py-20 bg-surface-0">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-1">
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at right center, rgb(var(--brand-rgb) / 0.16) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10 grid md:grid-cols-[1fr_auto] items-center gap-8 p-8 md:p-12">
                <div>
                  <div className="w-10 h-10 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center mb-5">
                    <PiFileArrowDown className="size-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-balance text-white mb-4">
                    Not sure where your gaps are? Start free.
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed max-w-xl">
                    The jobsafe site reporting toolkit is free for UK operators:
                    a ready-to-use incident and near-miss report template, the
                    RIDDOR decision flowchart, and near-miss triage — no
                    obligation, no jargon.
                  </p>
                </div>
                <Link
                  href="/toolkit"
                  className="inline-flex items-center justify-center whitespace-nowrap px-8 py-4 rounded-md bg-white hover:bg-white/90 text-black font-bold text-sm transition active:scale-[0.97]"
                >
                  Get the free toolkit
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing (shared, from lib/brand.ts) ───────────────────────────── */}
      <Pricing />

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <PageFAQ
        faqs={faqs}
        intro="Straight answers for the people who sign the tender and carry the liability."
      />

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 bg-surface-0 overflow-hidden border-t border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[600px]"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--brand-rgb) / 0.18) 0%, transparent 70%)',
            transform: 'translate(30%, 30%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white leading-tight mb-6">
              Three years of evidence starts today.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-4">
              Book {DEMO_DURATION_LABEL} and we will show you exactly what
              jobsafe would put in front of a customer&apos;s auditor, an
              underwriter or the HSE about your operation today.
            </p>
            <p className="text-white/40 text-sm mb-10">
              From {ENTRY_PRICE_LABEL} per licence per month. {TRIAL.label}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BookDemoButton placement="industry-logistics-closing" />
              <a
                href={SIGNUP_TRIAL_URL}
                className="inline-flex items-center justify-center rounded-md border border-white/25 px-8 py-4 text-sm font-bold whitespace-nowrap text-white transition duration-200 hover:-translate-y-px hover:border-white/50 hover:bg-white/[0.04] active:translate-y-0 active:scale-[0.97] motion-reduce:hover:translate-y-0"
              >
                Start your free trial
              </a>
            </div>
            <p className="mt-6 text-sm text-white/40">
              Or call{' '}
              <a
                href={PHONE_HREF}
                className="font-semibold text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-brand"
              >
                {PHONE_DISPLAY}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
