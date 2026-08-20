import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Pricing from '@/components/sections/Pricing'
import PageFAQ from '@/components/sections/PageFAQ'
import {
  ENTRY_PRICE_LABEL,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_URL,
  TRIAL,
} from '@/lib/brand'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import {
  breadcrumbSchema,
  graph,
  jsonLd,
  softwareApplicationSchema,
  type FaqEntry,
} from '@/lib/schema'
import {
  PiCameraPlus,
  PiChartBar,
  PiClockCountdown,
  PiCrosshair,
  PiFileArrowDown,
  PiFolderOpen,
  PiHandshake,
  PiMagnifyingGlass,
  PiScales,
  PiSiren,
  PiTimer,
  PiUsersThree,
  PiWifiSlash,
} from 'react-icons/pi'

const PAGE_PATH = '/industries/window-door-fitters'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`

export const metadata: Metadata = {
  title: 'Health & Safety Software for Window & Door Fitters',
  description:
    'Incident and near-miss reporting for UK window, door and glazing installers. Photo, GPS and timestamped evidence your insurer can trust. Start free.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Health & Safety Software for Window & Door Fitters | jobsafe',
    description:
      'The paperwork you would want to already have, the day something goes wrong. Incident and near-miss reporting built for UK installation businesses.',
    url: PAGE_URL,
    type: 'website',
  },
}

const pageGraph = jsonLd(
  graph(
    breadcrumbSchema([
      { name: 'Home', item: `${SITE_URL}/` },
      { name: 'Window, Door & Glazing Installers', item: PAGE_URL },
    ]),
    softwareApplicationSchema(PAGE_URL),
  ),
)

// ── Section content ──────────────────────────────────────────────────────────
// Every claim below is a claim the site already makes about the product
// (capture speed, offline mode, media evidence, GPS/timestamps, alerts,
// immutable exportable records, dashboards). Nothing here promises a module
// jobsafe does not have (§0.4, §0.7).

const painCards = [
  {
    icon: PiMagnifyingGlass,
    title: 'Your insurer asks for the incident record. How long does the answer take?',
    body: 'Every report lives in one place — searchable, timestamped and ready in seconds, not "give us a minute" while someone digs through a filing cabinet.',
  },
  {
    icon: PiSiren,
    title: 'A sealed unit slips. A hand is cut open. What happens next?',
    body: 'The fitter logs it at the scene, with photos, location and time attached — while the facts are still facts.',
  },
  {
    icon: PiTimer,
    title: 'The ladder near miss was three weeks ago. The report gets written today.',
    body: 'Reports reconstructed from memory protect nobody. jobsafe captures them on the day, on the spot, in under a minute.',
  },
  {
    icon: PiUsersThree,
    title: 'A subbie crew had a near miss on Friday. You hear about it on Monday.',
    body: 'Real-time alerts notify the office the moment a report is submitted — whoever is on the job, wherever the site is.',
  },
]

const deepDives = [
  {
    n: '01',
    icon: PiClockCountdown,
    eyebrow: 'Incident & near-miss reporting',
    title: 'Report it while it’s still fresh — not from memory.',
    body: 'A sealed unit that slips, a ladder that kicks out, a near miss with the forklift in the yard — your fitters capture what happened in under a minute, from the phone already in their pocket, before they’ve left the scene. Not written up three days later, when it’s become "he said, she said".',
    quote: 'Capture what happened on-site in minutes — not from memory, next week.',
  },
  {
    n: '02',
    icon: PiCameraPlus,
    eyebrow: 'Photo, video & voice evidence',
    title: 'Evidence anchored in time and place.',
    body: 'Photos, video clips and voice notes are attached at the point of capture, and every report is automatically GPS-tagged and timestamped. When a claim lands six months later, you’re not reconstructing events — you’re opening the record.',
    quote: 'Anchored in time and place, the moment it’s captured.',
  },
  {
    n: '03',
    icon: PiWifiSlash,
    eyebrow: 'Offline mode',
    title: 'Works where your crews actually work.',
    body: 'Up scaffolding, in a stairwell, in a plant room with no bars — the app stores the report locally and syncs the moment signal returns. A site with no coverage is never a reason for no record.',
    quote: 'No signal on site is not an excuse for no record.',
  },
  {
    n: '04',
    icon: PiSiren,
    eyebrow: 'Real-time alerts',
    title: 'The office knows the same day. Not at handover. Not on Monday.',
    body: 'The moment a report is submitted, the right people are notified by push and email, with escalation if nobody responds. Whether it’s your own fitters or a subcontracted crew on the other side of the county, you hear about it while there’s still something you can do about it.',
    quote: 'Notified the moment it happens — whoever’s on the job.',
  },
  {
    n: '05',
    icon: PiFolderOpen,
    eyebrow: 'Full audit trail',
    title: 'An audit trail your insurer can lean on.',
    body: 'Every report, and every action taken on it, is held as an immutable, timestamped record — and it’s exportable when someone asks. At renewal, in a tender, or across the table from a loss adjuster, "we take safety seriously" becomes something you can hand over rather than something you say.',
    quote: 'Walk into your renewal with evidence, not promises.',
  },
  {
    n: '06',
    icon: PiChartBar,
    eyebrow: 'Dashboard analytics',
    title: 'Spot the pattern before it becomes an injury.',
    body: 'The dashboard shows where reports cluster — by site, by category, over time. If near misses keep stacking up around upstairs installs or the yard forklift, that’s the risk assessment to revisit next, backed by your own data rather than a hunch.',
    quote: 'Your own reports tell you which risk assessment to revisit next.',
    link: {
      href: '/insights/rams-risk-assessments-method-statements',
      label: 'How incident data keeps RAMS alive',
    },
  },
]

const commercialCards = [
  {
    icon: PiHandshake,
    title: 'Insurance renewals',
    body: 'An active, dated reporting history shows an underwriter a business that manages its risk rather than one that hopes. Walk in with evidence, not assurances.',
  },
  {
    icon: PiCrosshair,
    title: 'Commercial tenders',
    body: 'Housebuilders, local authorities and facilities clients increasingly ask for proof of a working safety management system before you’re even considered. Producing your reporting record quickly is the ticket to bigger contracts.',
  },
  {
    icon: PiScales,
    title: 'The day the HSE asks',
    body: 'If an inspector asks what happened and what you did about it, the answer is already written — timestamped, geotagged and in order. See our plain-English guide to RIDDOR reporting duties.',
  },
]

const faqs: readonly FaqEntry[] = [
  {
    q: 'Does jobsafe replace our risk assessments and method statements?',
    a: 'No — and it shouldn’t. Your RAMS set out how work will be done safely; jobsafe is the reporting layer that tells you whether those controls are actually holding. Every incident and near miss your crews capture is feedback on a specific task, site or piece of kit, so you know which assessment to revisit before the next job, not after an injury.',
  },
  {
    q: 'Can it handle multiple depots and subcontracted crews?',
    a: 'Yes. jobsafe is licensed per user, so employed fitters and subcontracted crews report through the same app, and every report automatically carries who, where and when. The dashboard breaks reports down by site, so a multi-depot business sees each location — and the whole picture — in one place.',
  },
  {
    q: 'Does it help with RIDDOR reporting?',
    a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened, with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when deciding whether something is reportable and by when. Submitting to the HSE remains your decision — our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
  },
  {
    q: 'What happens when there’s no signal on site?',
    a: 'The mobile app stores reports locally and syncs to the cloud as soon as connectivity returns. Fitters can capture incidents in basements, stairwells and new-build plots with no coverage without losing a single record.',
  },
  {
    q: 'Can we export evidence for an insurer, a client or an auditor?',
    a: 'Yes. Every report is timestamped, immutable and exportable, with its photos, video and voice notes permanently linked to the record — so you can hand over an evidenced account rather than a reconstruction.',
  },
  {
    q: 'Can fitters attach photos and video from the job?',
    a: 'Yes. Photos, short video clips and voice notes are attached directly within the report, automatically timestamped and geotagged at the point of capture, and permanently linked to the incident record.',
  },
  {
    q: 'How long does it take to get set up?',
    a: 'Most teams are live within 30 minutes. There’s no installation, no hardware and no IT involvement: create an account, invite your fitters by email, and you’re reporting. Onboarding guides and short video lessons in the academy get crews confident from day one.',
  },
  {
    q: 'What does the free trial include?',
    a: `The full product, free for ${TRIAL.days} days, with no credit card required. Set it up on your own sites and crews, capture some real reports, and see exactly what jobsafe would show an insurer or a client about your business before you pay a penny.`,
  },
]

const trustFacts = [
  'Built for UK installation businesses',
  'Works offline on site',
  TRIAL.label,
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WindowDoorFittersPage() {
  return (
    <main className="bg-surface-0 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageGraph }}
      />
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
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
            <div className="flex flex-col w-full lg:w-[55%]">
              <p className="text-xs font-bold tracking-widest text-brand uppercase mb-6">
                For UK window, door &amp; garage door installers
              </p>
              <h1
                className="font-black leading-[1.05] tracking-tight text-white mb-7 text-balance"
                style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)' }}
              >
                The paperwork you&apos;d want to{' '}
                <em className="not-italic text-brand">already have</em>, the day
                something goes wrong.
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-9 max-w-xl">
                Glass is heavy, edges are sharp, and half the job happens up a
                ladder. jobsafe gives your fitting and glazing crews a
                sixty-second way to record accidents and near misses —
                photographed, GPS-anchored and timestamped — so when an insurer,
                a client or the HSE asks what happened, you answer in seconds,
                not scrambles.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  href={SIGNUP_TRIAL_URL}
                  className="bg-brand hover:bg-brand-hover text-white font-bold text-sm px-8 py-4 rounded-md transition active:scale-[0.97]"
                >
                  Start your free trial
                </a>
                <Link
                  href="/toolkit"
                  className="border border-white/20 hover:border-white/40 text-white font-bold text-sm px-8 py-4 rounded-md transition active:scale-[0.97]"
                >
                  Get the free reporting toolkit
                </Link>
              </div>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {trustFacts.map((fact) => (
                  <li
                    key={fact}
                    className="text-xs text-white/60 uppercase tracking-widest flex items-center gap-2"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — real product shot */}
            <div className="w-full lg:w-[45%] flex justify-center">
              <img
                src="/images/jobsafe-hero-duo.png"
                alt="Two smartphones showing the jobsafe app — the incident report menu, and the analytics dashboard with reports by category, site breakdown and 12-week trend"
                width={793}
                height={773}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-w-full max-h-[60vh] lg:max-h-[640px] object-contain mx-auto"
                style={{
                  filter:
                    'drop-shadow(0 0 18px rgb(var(--brand-rgb) / 0.5)) drop-shadow(0 0 48px rgb(var(--brand-rgb) / 0.28)) drop-shadow(0 14px 30px rgb(0 0 0 / 0.55))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Liability note ────────────────────────────────────────────────── */}
      <section className="bg-surface-0 border-y border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="shrink-0 w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center">
              <PiScales className="size-5 text-brand" strokeWidth={1.75} />
            </div>
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              <span className="font-bold text-white">
                Director liability is personal —
              </span>{' '}
              under the Health and Safety at Work etc. Act 1974, what protects
              the people running the business is being able to{' '}
              <span className="font-bold text-brand">show</span> that reasonably
              practicable steps were taken. That is an evidence question: a
              dated, geotagged, immutable reporting trail demonstrates your
              system; good intentions only describe it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pain cards ────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 bg-surface-0">
        <div className="text-center mb-14 px-4">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-4">
            Sound familiar?
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white">
            Four moments every installer
            <br />
            recognises
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Fitting glass and doors for a living means heavy, awkward, sharp
            loads, work at height, and crews spread across sites. When something
            goes wrong, the record you kept is the difference.
          </p>
        </div>
        <div className="mx-auto max-w-5xl px-6 grid gap-4 md:grid-cols-2">
          {painCards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors duration-200"
            >
              <Icon className="size-6 text-brand mb-4" strokeWidth={1.5} />
              <h3 className="text-white font-bold text-base leading-snug mb-3">
                {title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature deep-dives ────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 bg-surface-0">
        <div className="text-center mb-16 px-4">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-4">
            How jobsafe covers you
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white">
            From the scene
            <br />
            to the record
          </h2>
        </div>
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-6 md:gap-10">
          {deepDives.map(({ n, icon: Icon, eyebrow, title, body, quote, link }, i) => (
            <div
              key={n}
              className="grid md:grid-cols-2 gap-6 md:gap-12 items-center rounded-2xl border border-white/10 bg-surface-1 p-8 md:p-12 overflow-hidden"
            >
              <div className={i % 2 === 1 ? 'md:order-2' : undefined}>
                <p className="text-xs font-bold tracking-widest text-brand uppercase mb-3">
                  {n} — {eyebrow}
                </p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight mb-4 text-balance">
                  {title}
                </h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed">
                  {body}
                </p>
                {link && (
                  <Link
                    href={link.href}
                    className="inline-block mt-4 text-sm font-semibold text-brand hover:underline"
                  >
                    {link.label} →
                  </Link>
                )}
              </div>
              <div
                className={`relative rounded-xl border border-white/10 p-8 md:p-10 min-h-[180px] flex flex-col justify-center ${
                  i % 2 === 1 ? 'md:order-1' : ''
                }`}
                style={{
                  background:
                    'radial-gradient(circle at 30% 20%, rgb(var(--brand-rgb) / 0.14) 0%, rgb(17 17 17) 70%)',
                }}
              >
                <Icon className="size-8 text-brand mb-5" strokeWidth={1.5} />
                <p className="text-lg md:text-xl font-bold text-white leading-snug text-balance">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Commercial payoff ─────────────────────────────────────────────── */}
      <section className="py-14 md:py-16 bg-surface-0 border-t border-white/10">
        <div className="text-center mb-14 px-4">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-4">
            Beyond compliance
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white">
            Win the work. Keep the cover.
            <br />
            Pass the audit.
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Installers rarely lose contracts on price alone. They lose them on
            paperwork they couldn&apos;t produce in time.
          </p>
        </div>
        <div className="mx-auto max-w-5xl px-6 grid gap-4 md:grid-cols-3">
          {commercialCards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <Icon className="size-6 text-brand mb-4" strokeWidth={1.5} />
              <h3 className="text-white font-bold text-base mb-3">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 px-6">
          <Link
            href="/insights/riddor-reporting-explained"
            className="text-sm font-semibold text-brand hover:underline"
          >
            RIDDOR reporting, explained in plain English →
          </Link>
        </p>
      </section>

      {/* ── Lower-commitment offer: the free toolkit ──────────────────────── */}
      <section className="relative py-14 md:py-16 bg-surface-0 border-t border-white/10 overflow-hidden">
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px]"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--brand-rgb) / 0.14) 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mb-6">
            <PiFileArrowDown className="size-6 text-brand" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-balance text-white mb-4">
            Not sure where your gaps are? Start free.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            The jobsafe site reporting toolkit is free for UK trades: a
            ready-to-use incident and near-miss report template, the RIDDOR
            decision flowchart, and near-miss triage — no obligation, no jargon.
          </p>
          <Link
            href="/toolkit"
            className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-white hover:bg-white/90 text-black font-bold text-sm transition active:scale-[0.97]"
          >
            Get the free toolkit
          </Link>
        </div>
      </section>

      {/* ── Pricing (shared, from lib/brand.ts) ───────────────────────────── */}
      <Pricing />

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <PageFAQ
        faqs={faqs}
        intro="Straight answers for installation businesses weighing up jobsafe."
      />

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative py-16 bg-surface-0 overflow-hidden border-t border-white/10">
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[600px]"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--brand-rgb) / 0.18) 0%, transparent 70%)',
            transform: 'translate(30%, 30%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white leading-tight mb-6">
            Be ready before you&apos;re asked.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-4">
            Start your free trial and see exactly what jobsafe would show an
            insurer, a client or the HSE about your business today.
          </p>
          <p className="text-white/40 text-sm mb-10">
            From {ENTRY_PRICE_LABEL} per licence per month. {TRIAL.label}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={SIGNUP_TRIAL_URL}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand hover:bg-brand-hover text-white font-semibold text-sm tracking-wide transition active:scale-[0.97]"
            >
              Start your free trial
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-sm tracking-wide transition active:scale-[0.97]"
            >
              Talk it through — {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
