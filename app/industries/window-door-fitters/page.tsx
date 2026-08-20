import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Pricing from '@/components/sections/Pricing'
import PageFAQ from '@/components/sections/PageFAQ'
import Reveal from '@/components/ui/reveal'
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
  PiCrosshair,
  PiFileArrowDown,
  PiHandshake,
  PiMagnifyingGlass,
  PiScales,
  PiSiren,
  PiTimer,
  PiUsersThree,
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
      'Fix your incident reporting in 24 hours. Evidence-grade incident and near-miss reporting built for UK window, door and glazing installation businesses.',
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

      {/* ── Hero: split text / on-site footage ────────────────────────────── */}
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
                For UK window, door &amp; garage door installers
              </p>
              <h1
                className="font-black leading-[1.05] tracking-tight text-white mb-7 text-balance"
                style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)' }}
              >
                Fix your incident reporting in{' '}
                <em className="not-italic text-brand">24 hours</em>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-9 max-w-xl">
                Glass is heavy, edges are sharp, and half the job happens up a
                ladder. jobsafe gives your fitting and glazing crews a
                sixty-second way to record accidents and near misses —
                photographed, GPS-anchored and timestamped — so when an insurer,
                a client or the HSE asks what happened, you answer in seconds,
                not scrambles.
              </p>
              <div className="flex flex-wrap items-center gap-4">
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
                  Get the free toolkit
                </Link>
              </div>
            </Reveal>

            {/* Right — on-site footage. Greyscale is baked into the encode
                (public/videos, ffmpeg hue=s=0); the red is the soft glow
                behind the frame plus a low-opacity brand wash, so the footage
                sits in the hero's palette rather than beside it. */}
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
                  <video
                    src="/videos/window-fitter-hero.mp4"
                    poster="/videos/window-fitter-hero-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="A fitter installing a window on site"
                    className="w-full h-auto block"
                  />
                  {/* Brand wash + vignette over the greyscale footage */}
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

      {/* ── The point: director liability ─────────────────────────────────
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
              Director liability
              <br />
              is <em className="not-italic text-brand">personal</em>.
            </h2>
            <p className="text-white/80 text-lg md:text-2xl leading-relaxed text-balance max-w-3xl mx-auto">
              Under the Health and Safety at Work etc. Act 1974, what protects
              the people running the business is being able to{' '}
              <span className="font-bold text-white">show</span> that reasonably
              practicable steps were taken. That is an evidence question: a
              dated, geotagged, immutable reporting trail{' '}
              <span className="font-bold text-white">demonstrates</span> your
              system — good intentions only describe it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Pain cards ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-surface-0">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white mb-4">
              Four moments every installer recognises
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Fitting glass and doors for a living means heavy, awkward, sharp
              loads, work at height, and crews spread across sites. When
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
              Pass the audit.
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Installers rarely lose contracts on price alone. They lose them on
              paperwork they couldn&apos;t produce in time.
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
          <p className="text-center mt-10">
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
        intro="Straight answers for installation businesses weighing up jobsafe."
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
                className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-brand hover:bg-brand-hover text-white font-bold text-sm transition active:scale-[0.97]"
              >
                Start your free trial
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-white/20 hover:border-white/40 text-white font-bold text-sm transition active:scale-[0.97]"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
