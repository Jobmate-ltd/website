import type { Metadata } from 'next'
import { Crosshair, FileSearch, Handshake, Scale, Siren, Timer, WifiOff } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { trialSentence } from '@/lib/brand'
import { IndustryPage, type IndustryContent } from '@/components/site/industry-page'

const PATH = '/industries/field-services'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Health and safety software for field service teams',
  description:
    'Incident and near-miss reporting for UK field service and mobile engineering teams. Works with no signal, with photo, GPS and timestamped evidence. Start your free trial.',
  ogTitle: 'Reporting that travels with your engineers | jobsafe',
})

// Every claim below is a claim the site already makes about the product. This
// page states plainly that jobsafe is not a man-down or panic-alarm service,
// because a field service buyer searching for lone worker cover will otherwise
// assume it is.

const content: IndustryContent = {
  path: PATH,
  breadcrumb: 'Field service and mobile engineering',
  placement: 'industry-field-services',
  hero: {
    eyebrow: 'For UK field service, maintenance and mobile engineering teams',
    title: (
      <>
        Reporting that <span className="text-brand">travels</span> with your engineers
      </>
    ),
    lead:
      'Plant rooms with no bars on the phone. Roofs, lofts, substations, and customer sites nobody from your office has ever walked. jobsafe gives lone and mobile engineers a fast way to record accidents and near misses, photographed, GPS-anchored, timestamped, and stored on the device until there is a signal, so when a client, an insurer or the HSE asks what happened, you answer in seconds rather than scrambles.',
    media: {
      kind: 'image',
      src: '/images/industries/field-services-hero.jpg',
      alt: 'A field engineer inspecting a wind turbine alone at a remote hillside site',
    },
  },
  trustFacts: ['Built for UK mobile engineering teams', 'Works with no signal at all', 'Evidence for clients and PQQs'],
  point: {
    icon: <Scale />,
    title: (
      <>
        You don&apos;t own the site.
        <br />
        You still own the <span className="text-brand">duty</span>.
      </>
    ),
    body: (
      <>
        Section 2 of the Health and Safety at Work etc. Act 1974 follows your engineer onto premises you have never seen, and section 3 extends it to everyone else your work affects. You cannot pre-assess every site, which makes what your engineer <strong className="text-ink-1">recorded</strong> when they got there the thing that stands up later. A dated, geotagged trail <strong className="text-ink-1">demonstrates</strong> your system; good intentions only describe it.
      </>
    ),
  },
  pains: {
    title: 'Four moments every engineer recognises',
    lead: 'Field work means unfamiliar sites, no supervisor in sight, patchy coverage and paperwork that waits until the van is parked up. When something goes wrong, the record you kept is the difference.',
    cards: [
      {
        icon: <FileSearch />,
        title: 'Your client asks for the report on an incident at their site. How long does that take?',
        body: 'Every report lives in one place, searchable, timestamped and ready in seconds, rather than a call round the team to work out who was on that job and what they remember.',
      },
      {
        icon: <Siren />,
        title: 'An engineer puts a foot through a ceiling in an empty loft. Nobody saw it.',
        body: 'The engineer logs it where it happened, with photos, location and time attached. On a lone visit that account is the only evidence there will ever be, so it needs to be captured while it is still accurate.',
      },
      {
        icon: <WifiOff />,
        title: 'The near miss happened in a basement plant room with no bars on the phone.',
        body: 'The app stores the report on the device and syncs the moment a connection returns. No signal is not a reason for a missing record, and your engineers stop deciding which incidents are worth the hassle.',
      },
      {
        icon: <Timer />,
        title: 'Friday’s near miss gets written up when the paperwork gets done. Which is Tuesday.',
        body: 'A report reconstructed from a four-day-old memory in a van at the end of a shift protects nobody. jobsafe captures it on the job, and alerts the office the moment it is submitted.',
      },
    ],
  },
  commercial: {
    title: (
      <>
        Win the work. Keep the cover.
        <br />
        Stay on the list.
      </>
    ),
    lead: 'Contractors rarely lose an account on price alone. They lose it on evidence they could not produce in time.',
    cards: [
      {
        icon: <Handshake />,
        title: 'Insurance renewals',
        body: 'You work on premises you do not control, so public liability sits alongside employers’ liability at every renewal. An active, dated reporting history shows an underwriter a contractor that manages its risk rather than one that hopes.',
      },
      {
        icon: <Crosshair />,
        title: 'PQQs and approval schemes',
        body: 'CHAS, SafeContractor, Constructionline and most client pre-qualification questionnaires ask for your accident and incident record. Producing it quickly is the difference between staying on the approved list and quietly dropping off it.',
      },
      {
        icon: <Scale />,
        title: 'The day the HSE asks',
        body: 'If an inspector asks what happened and what you did about it, the answer is already written: timestamped, geotagged and in order.',
      },
    ],
    links: [
      { label: 'Lone worker safety, in practice', href: '/insights/lone-worker-safety-guide' },
      { label: 'RIDDOR reporting, explained in plain English', href: '/insights/riddor-reporting-explained' },
    ],
  },
  toolkit: { audience: 'UK trades' },
  faqs: [
    {
      q: 'Is jobsafe a lone worker alarm?',
      a: 'No. jobsafe is not a man-down device or a monitored panic-alarm service, and it does not replace one where your risk assessment calls for it. What it does is close the distance after something happens: a report submitted from site carries GPS and a timestamp automatically and reaches the office in real time, so an incident involving an engineer working alone is known about promptly rather than at the end of a shift. Our lone worker safety guide sets out where each control fits.',
    },
    {
      q: 'We can’t risk-assess every site we visit. Does jobsafe help with that?',
      a: 'That is precisely the gap it fills. You cannot pre-assess a customer’s plant room you have never seen, so what protects you is what the engineer recorded when they got there. Every near miss captured on a real visit is feedback on a specific site, task or piece of kit, and the dashboard shows you which of them keep coming back, so your generic assessments and toolbox talks get updated from evidence rather than guesswork.',
    },
    {
      q: 'What happens when there is no signal on site?',
      a: 'The mobile app stores reports locally and syncs to the cloud as soon as connectivity returns. Engineers can capture incidents in basements, plant rooms, lift shafts, substations and rural sites with no coverage at all, without losing a single record.',
    },
    {
      q: 'Can it handle engineers across several regions, plus subcontractors?',
      a: 'Yes. jobsafe is licensed per user, so employed engineers and subcontracted ones report through the same app, and every report automatically carries who, where and when. The dashboard breaks reports down by site, so a business with no shared depot still sees each location, and the whole picture, in one place.',
    },
    {
      q: 'An incident happened on a client’s premises. Whose record is it?',
      a: 'Yours, and you keep it. The report belongs to your account and is exportable with its photos, video and voice notes attached, so you can hand the client, their principal contractor or your insurer an evidenced account of what your engineer found and did, without giving up your own record of it.',
    },
    {
      q: 'Does it help with RIDDOR reporting?',
      a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened, with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when you are deciding whether something is reportable and by when. Submitting to the HSE remains your decision; our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
    },
    {
      q: 'Can engineers attach photos and video from the job?',
      a: 'Yes. Photos, short video clips and voice notes are attached directly within the report, automatically timestamped and geotagged at the point of capture, and permanently linked to the incident record. A voice note matters more than it sounds in this trade: an engineer in gloves on a cold roof will talk when they will not type.',
    },
    {
      q: 'How long does it take to get set up?',
      a: 'There is no installation, no hardware and no IT involvement: create an account, invite your engineers by email, and you are reporting. Onboarding guides and short video lessons in the academy get crews confident from day one.',
    },
    {
      q: 'What does the free trial include?',
      a: `The full product. ${trialSentence()} Put it on a few vans, capture some real reports from real visits, and see exactly what jobsafe would show a client, an insurer or the HSE about your business.`,
    },
  ],
  faqIntro: 'Straight answers for field service businesses weighing up jobsafe.',
  closing: {
    title: 'Your engineers are already out there.',
    copy: 'jobsafe would put in front of a client, an insurer or the HSE about your business today.',
  },
}

export default function FieldServicesPage() {
  return <IndustryPage content={content} />
}
