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
  PiCrosshair,
  PiFileArrowDown,
  PiHandshake,
  PiMagnifyingGlass,
  PiScales,
  PiSiren,
  PiTimer,
  PiWifiSlash,
} from 'react-icons/pi'

const PAGE_PATH = '/industries/field-services'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`

export const metadata: Metadata = {
  title: 'Health & Safety Software for Field Service Teams',
  description:
    'Incident and near-miss reporting for UK field service and mobile engineering teams. Works with no signal — photo, GPS and timestamped evidence. Start free.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Health & Safety Software for Field Service Teams | jobsafe',
    description:
      'Reporting that travels with your engineers. Evidence-grade incident and near-miss capture for UK field service, maintenance and mobile engineering teams.',
    url: PAGE_URL,
    type: 'website',
  },
}

const pageGraph = jsonLd(
  graph(
    breadcrumbSchema([
      { name: 'Home', item: `${SITE_URL}/` },
      { name: 'Field Service & Mobile Engineering', item: PAGE_URL },
    ]),
    softwareApplicationSchema(PAGE_URL),
  ),
)

// ── Section content ──────────────────────────────────────────────────────────
// Every claim below is a claim the site already makes about the product
// (capture speed, offline mode, media evidence, GPS/timestamps, alerts,
// immutable exportable records, dashboards). Nothing here promises a module
// jobsafe does not have (§0.4, §0.7) — in particular this page states plainly
// that jobsafe is not a man-down or panic-alarm service, because a field
// service buyer searching for lone worker cover will otherwise assume it is.

const painCards = [
  {
    icon: PiMagnifyingGlass,
    title: 'Your client asks for the report on an incident that happened at their site. How long does that take?',
    body: 'Every report lives in one place — searchable, timestamped and ready in seconds, rather than a call round the team to work out who was on that job and what they remember.',
  },
  {
    icon: PiSiren,
    title: 'An engineer puts a foot through a ceiling in an empty loft. Nobody saw it.',
    body: 'The engineer logs it where it happened, with photos, location and time attached. On a lone visit that account is the only evidence there will ever be — so it needs to be captured while it is still accurate.',
  },
  {
    icon: PiWifiSlash,
    title: 'The near miss happened in a basement plant room with no bars on the phone.',
    body: 'The app stores the report on the device and syncs the moment a connection returns. No signal is not a reason for a missing record, and your engineers stop deciding which incidents are worth the hassle.',
  },
  {
    icon: PiTimer,
    title: 'Friday’s near miss gets written up when the paperwork gets done. Which is Tuesday.',
    body: 'A report reconstructed from a four-day-old memory in a van at the end of a shift protects nobody. jobsafe captures it on the job in under a minute, and alerts the office the moment it is submitted.',
  },
]

const commercialCards = [
  {
    icon: PiHandshake,
    title: 'Insurance renewals',
    body: 'You work on premises you do not control, so public liability sits alongside employers’ liability at every renewal. An active, dated reporting history shows an underwriter a contractor that manages its risk rather than one that hopes.',
  },
  {
    icon: PiCrosshair,
    title: 'PQQs and approval schemes',
    body: 'CHAS, SafeContractor, Constructionline and most client pre-qualification questionnaires ask for your accident and incident record. Producing it quickly is the difference between staying on the approved list and quietly dropping off it.',
  },
  {
    icon: PiScales,
    title: 'The day the HSE asks',
    body: 'If an inspector asks what happened and what you did about it, the answer is already written — timestamped, geotagged and in order. See our plain-English guide to RIDDOR reporting duties.',
  },
]

const faqs: readonly FaqEntry[] = [
  {
    q: 'Is jobsafe a lone worker alarm?',
    a: 'No. jobsafe is not a man-down device or a monitored panic-alarm service, and it does not replace one where your risk assessment calls for it. What it does is close the distance after something happens: a report submitted from site carries GPS and a timestamp automatically and reaches the office in real time, so an incident involving an engineer working alone is known about in minutes rather than at the end of a shift. Our lone worker safety guide sets out where each control fits.',
  },
  {
    q: 'We can’t risk-assess every site we visit. Does jobsafe help with that?',
    a: 'That is precisely the gap it fills. You cannot pre-assess a customer’s plant room you have never seen, so what protects you is what the engineer recorded when they got there. Every near miss captured on a real visit is feedback on a specific site, task or piece of kit, and the dashboard shows you which of them keep coming back — so your generic assessments and toolbox talks get updated from evidence rather than guesswork.',
  },
  {
    q: 'What happens when there’s no signal on site?',
    a: 'The mobile app stores reports locally and syncs to the cloud as soon as connectivity returns. Engineers can capture incidents in basements, plant rooms, lift shafts, substations and rural sites with no coverage at all, without losing a single record.',
  },
  {
    q: 'Can it handle engineers across several regions, plus subcontractors?',
    a: 'Yes. jobsafe is licensed per user, so employed engineers and subcontracted ones report through the same app, and every report automatically carries who, where and when. The dashboard breaks reports down by site, so a business with no shared depot still sees each location — and the whole picture — in one place.',
  },
  {
    q: 'An incident happened on a client’s premises. Whose record is it?',
    a: 'Yours, and you keep it. The report belongs to your account, is immutable once submitted, and is exportable with its photos, video and voice notes attached — so you can hand the client, their principal contractor or your insurer an evidenced account of what your engineer found and did, without giving up your own record of it.',
  },
  {
    q: 'Does it help with RIDDOR reporting?',
    a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened, with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when you are deciding whether something is reportable and by when. Submitting to the HSE remains your decision — our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
  },
  {
    q: 'Can engineers attach photos and video from the job?',
    a: 'Yes. Photos, short video clips and voice notes are attached directly within the report, automatically timestamped and geotagged at the point of capture, and permanently linked to the incident record. A voice note matters more than it sounds in this trade: an engineer in gloves on a cold roof will talk when they will not type.',
  },
  {
    q: 'How long does it take to get set up?',
    a: 'Most teams are live within 30 minutes. There’s no installation, no hardware and no IT involvement: create an account, invite your engineers by email, and you’re reporting. Onboarding guides and short video lessons in the academy get crews confident from day one.',
  },
  {
    q: 'What does the free trial include?',
    a: `The full product, free for ${TRIAL.days} days, with no credit card required. Put it on a few vans, capture some real reports from real visits, and see exactly what jobsafe would show a client, an insurer or the HSE about your business before you pay a penny.`,
  },
]

const trustFacts = [
  'Built for UK mobile engineering teams',
  'Works with no signal at all',
  TRIAL.label,
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FieldServicesPage() {
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
                For UK field service, maintenance &amp; mobile engineering teams
              </p>
              <h1
                className="font-black leading-[1.05] tracking-tight text-white mb-7 text-balance"
                style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)' }}
              >
                Reporting that{' '}
                <em className="not-italic text-brand">travels</em> with your
                engineers
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-9 max-w-xl">
                Plant rooms with no bars on the phone. Roofs, lofts,
                substations, and customer sites nobody from your office has ever
                walked. jobsafe gives lone and mobile engineers a sixty-second
                way to record accidents and near misses — photographed,
                GPS-anchored, timestamped, and stored on the device until
                there&apos;s a signal — so when a client, an insurer or the HSE
                asks what happened, you answer in seconds rather than scrambles.
              </p>
              {/* Same weighting as the homepage hero: demo takes the fill,
                  trial takes the border, the lead magnet steps down to a link
                  so the row reads as two choices rather than three. */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <BookDemoButton placement="industry-field-services-hero" />
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

            {/* Right — on-site still, in the same frame the fitters and
                healthcare heroes use for footage: greyscale baked into the
                asset, red blur behind, brand wash and vignette over the top.
                A still rather than video because there is no field service
                footage yet; swapping in a <video> later is a like-for-like
                replacement of this <Image>, nothing around it changes. The
                colour original is the homepage industries card, so the two
                read as the same photograph graded for two jobs. */}
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
                    src="/images/industries/field-services-hero.jpg"
                    alt="A field engineer inspecting a wind turbine alone at a remote hillside site"
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

      {/* ── The point: the duty travels with the engineer ─────────────────
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
              <PiScales className="size-6 text-brand" strokeWidth={1.75} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-balance text-white leading-[1.05] mb-8">
              You don&apos;t own the site.
              <br />
              You still own the{' '}
              <em className="not-italic text-brand">duty</em>.
            </h2>
            <p className="text-white/80 text-lg md:text-2xl leading-relaxed text-balance max-w-3xl mx-auto">
              Section 2 of the Health and Safety at Work etc. Act 1974 follows
              your engineer onto premises you have never seen, and section 3
              extends it to everyone else your work affects. You cannot
              pre-assess every site — which makes what your engineer{' '}
              <span className="font-bold text-white">recorded</span> when they
              got there the thing that stands up later. A dated, geotagged,
              immutable trail{' '}
              <span className="font-bold text-white">demonstrates</span> your
              system; good intentions only describe it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Pain cards ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-surface-0">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white mb-4">
              Four moments every engineer recognises
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Field work means unfamiliar sites, no supervisor in sight, patchy
              coverage and paperwork that waits until the van is parked up. When
              something goes wrong, the record you kept is the difference.
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
              Win the work. Keep the cover.
              <br />
              Stay on the list.
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Contractors rarely lose an account on price alone. They lose it on
              evidence they couldn&apos;t produce in time.
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
              href="/insights/lone-worker-safety-guide"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Lone worker safety, in practice →
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
                    The jobsafe site reporting toolkit is free for UK trades: a
                    ready-to-use incident and near-miss report template, the
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
        intro="Straight answers for field service businesses weighing up jobsafe."
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
              Your engineers are already out there.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-4">
              Book {DEMO_DURATION_LABEL} and we will show you exactly what
              jobsafe would put in front of a client, an insurer or the HSE
              about your business today.
            </p>
            <p className="text-white/40 text-sm mb-10">
              From {ENTRY_PRICE_LABEL} per licence per month. {TRIAL.label}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BookDemoButton placement="industry-field-services-closing" />
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
