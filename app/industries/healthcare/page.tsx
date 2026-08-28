import type { Metadata } from 'next'
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
  PiMoonStars,
  PiScales,
  PiSiren,
  PiUsersThree,
} from 'react-icons/pi'

const PAGE_PATH = '/industries/healthcare'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`

export const metadata: Metadata = {
  title: 'Health & Safety Software for Healthcare & Care Homes',
  description:
    'Incident and near-miss reporting for UK care homes, home care and clinical teams. Photo, GPS and timestamped evidence an inspector can trust. Start free.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Health & Safety Software for Healthcare & Care Homes | jobsafe',
    description:
      'Every incident logged is a patient protected. Evidence-grade incident and near-miss reporting built for UK care homes, home care and clinical teams.',
    url: PAGE_URL,
    type: 'website',
  },
}

const pageGraph = jsonLd(
  graph(
    breadcrumbSchema([
      { name: 'Home', item: `${SITE_URL}/` },
      { name: 'Care Homes, Home Care & Healthcare', item: PAGE_URL },
    ]),
    softwareApplicationSchema(PAGE_URL),
  ),
)

// ── Section content ──────────────────────────────────────────────────────────
// Every claim below is a claim the site already makes about the product
// (capture speed, offline mode, media evidence, GPS/timestamps, alerts,
// immutable exportable records, dashboards). Nothing here promises a module
// jobsafe does not have (§0.4, §0.7) — in particular, this page is explicit
// that jobsafe is workplace HSSE reporting and not a clinical patient-safety
// system, because in healthcare the two are routinely confused.

const painCards = [
  {
    icon: PiMagnifyingGlass,
    title: 'An inspector asks for six months of incidents. How long does the answer take?',
    body: 'Every report lives in one place — searchable, timestamped and ready in seconds, not “bear with us” while somebody hunts for the accident book in the office drawer.',
  },
  {
    icon: PiSiren,
    title: 'A transfer goes wrong and a carer’s back goes with it. What happens next?',
    body: 'The carer logs it where it happened, with photos, location and time attached — while the facts are still facts and not a memory of a busy shift.',
  },
  {
    icon: PiMoonStars,
    title: 'The fall happened on nights. The write-up happens when someone gets a minute.',
    body: 'A report reconstructed three days later from a handover note protects nobody. jobsafe captures it on the shift, on the spot, in under a minute.',
  },
  {
    icon: PiUsersThree,
    title: 'An agency carer had a near miss on a Friday visit. You hear about it on Monday.',
    body: 'Real-time alerts notify the office the moment a report is submitted — employed, bank or agency, whichever home or postcode they are working in.',
  },
]

const commercialCards = [
  {
    icon: PiHandshake,
    title: 'Insurance renewals',
    body: 'An active, dated reporting history shows an employers’ liability underwriter a provider that manages its risk rather than one that hopes. Walk in with evidence, not assurances.',
  },
  {
    icon: PiCrosshair,
    title: 'Commissioners and frameworks',
    body: 'Local authorities, integrated care boards and private clients increasingly ask for proof of a working safety management system before a provider joins the list. Producing your reporting record quickly is the ticket to bigger contracts.',
  },
  {
    icon: PiScales,
    title: 'The day the inspector asks',
    body: 'If a CQC inspector or an HSE officer asks what happened and what you did about it, the answer is already written — timestamped, geotagged and in order. See our plain-English guide to RIDDOR reporting duties.',
  },
]

const faqs: readonly FaqEntry[] = [
  {
    q: 'Is jobsafe a clinical patient-safety system?',
    a: 'No, and it does not pretend to be. jobsafe is workplace health and safety reporting: accidents, near misses and hazards affecting the people doing the work and the people around them. It sits alongside your clinical governance and patient-safety arrangements rather than replacing them, and it does not submit to national patient-safety services on your behalf. What it does is give you a fast, evidenced, timestamped record of what actually happened on site.',
  },
  {
    q: 'Does jobsafe replace our risk assessments and care plans?',
    a: 'No — and it shouldn’t. Your risk assessments and care plans set out how work should be done safely; jobsafe is the reporting layer that tells you whether those controls are actually holding. Every incident and near miss your staff capture is feedback on a specific task, building, round or piece of equipment, so you know which assessment to revisit before the next shift rather than after an injury.',
  },
  {
    q: 'Can it handle multiple homes, branches and agency staff?',
    a: 'Yes. jobsafe is licensed per user, so employed, bank and agency staff all report through the same app, and every report automatically carries who, where and when. The dashboard breaks reports down by site, so a provider running several homes or branches sees each location — and the whole picture — in one place.',
  },
  {
    q: 'Does it help with RIDDOR reporting?',
    a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened, with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when you are deciding whether something is reportable and by when. Submitting to the HSE remains your decision — our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
  },
  {
    q: 'What happens when there’s no signal — in a service user’s home, a lift or a plant room?',
    a: 'The mobile app stores reports locally and syncs to the cloud as soon as connectivity returns. Community and domiciliary staff can capture incidents in flats, lifts, rural properties and basements with no coverage at all, without losing a single record.',
  },
  {
    q: 'Is it safe to attach photos in a care setting?',
    a: 'Media is stored under UK GDPR — encrypted in transit and at rest on AWS, with a data processing agreement available on request. What goes into a report remains your call and your policy: for most incidents the evidence that matters is the hazard rather than the person — the wet floor, the failed hoist sling, the damaged bed rail — and your staff should be told to record it that way.',
  },
  {
    q: 'Can we export evidence for an inspector, a commissioner or an insurer?',
    a: 'Yes. Every report is timestamped, immutable and exportable, with its photos, video and voice notes permanently linked to the record — so you hand over an evidenced account rather than a reconstruction.',
  },
  {
    q: 'How long does it take to get set up?',
    a: 'Most teams are live within 30 minutes. There’s no installation, no hardware and no IT involvement: create an account, invite your staff by email, and you’re reporting. Onboarding guides and short video lessons in the academy get carers, nurses and support workers confident from day one.',
  },
  {
    q: 'What does the free trial include?',
    a: `The full product, free for ${TRIAL.days} days, with no credit card required. Set it up across one home or one community round, capture some real reports, and see exactly what jobsafe would show an inspector, a commissioner or an insurer about your service before you pay a penny.`,
  },
]

const trustFacts = [
  'Built for UK care and clinical teams',
  'Works offline on home visits',
  TRIAL.label,
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HealthcarePage() {
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
                For UK care homes, home care &amp; healthcare providers
              </p>
              <h1
                className="font-black leading-[1.05] tracking-tight text-white mb-7 text-balance"
                style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)' }}
              >
                Every incident logged is a patient{' '}
                <em className="not-italic text-brand">protected</em>.
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-9 max-w-xl">
                Hoists and transfers, sharps, wet floors, aggression, and staff
                working alone in other people&apos;s homes at seven in the
                morning. jobsafe gives carers, nurses and support workers a
                sixty-second way to record accidents and near misses —
                photographed, GPS-anchored and timestamped — so when an
                inspector, a commissioner or an insurer asks what happened, you
                answer in seconds rather than scrambles.
              </p>
              {/* Same weighting as the homepage hero: demo takes the fill,
                  trial takes the border, the lead magnet steps down to a link
                  so the row reads as two choices rather than three. */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <BookDemoButton placement="industry-healthcare-hero" />
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
                    src="/videos/healthcare-hero.mp4"
                    poster="/videos/healthcare-hero-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="A carer supporting an older resident in a care home lounge"
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

      {/* ── The point: good governance is an evidence test ────────────────
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
              Good governance is
              <br />
              an <em className="not-italic text-brand">evidence</em> test.
            </h2>
            <p className="text-white/80 text-lg md:text-2xl leading-relaxed text-balance max-w-3xl mx-auto">
              Regulation 17 of the Health and Social Care Act 2008 (Regulated
              Activities) Regulations 2014 requires providers to keep accurate,
              complete and contemporaneous records, and to assess, monitor and
              mitigate risks to health and safety. The Health and Safety at Work
              etc. Act 1974 asks the same of you for your staff. Both are
              evidence questions: a dated, geotagged, immutable reporting trail{' '}
              <span className="font-bold text-white">demonstrates</span> your
              system — good intentions only{' '}
              <span className="font-bold text-white">describe</span> it.
            </p>
            <p className="text-white/40 text-sm leading-relaxed max-w-2xl mx-auto mt-8">
              Regulation 17 is the England wording. The Care Inspectorate, Care
              Inspectorate Wales and RQIA ask the same question in their own.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Pain cards ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-surface-0">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white mb-4">
              Four moments every provider recognises
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Care work is physical, unpredictable and often done alone or at
              three in the morning, by people who move between homes, rounds and
              rotas. When something goes wrong, the record you kept is the
              difference.
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
              Win the contract. Keep the cover.
              <br />
              Pass the inspection.
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Providers rarely lose a framework place on price alone. They lose
              it on evidence they couldn&apos;t produce in time.
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
              href="/insights/riddor-reporting-explained"
              className="text-sm font-semibold text-brand hover:underline"
            >
              RIDDOR reporting, explained in plain English →
            </Link>
            <Link
              href="/insights/lone-worker-safety-guide"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Lone worker safety, for staff on community rounds →
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
                    The jobsafe site reporting toolkit is free for UK employers:
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
        intro="Straight answers for care and healthcare providers weighing up jobsafe."
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
              Evidence, not recollection.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-4">
              Book {DEMO_DURATION_LABEL} and we will show you exactly what
              jobsafe would put in front of an inspector, a commissioner or an
              insurer about your service today.
            </p>
            <p className="text-white/40 text-sm mb-10">
              From {ENTRY_PRICE_LABEL} per licence per month. {TRIAL.label}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BookDemoButton placement="industry-healthcare-closing" />
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
