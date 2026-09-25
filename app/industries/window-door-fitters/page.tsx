import type { Metadata } from 'next'
import { Crosshair, FileSearch, Handshake, Scale, Siren, Timer, Users } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { trialSentence } from '@/lib/brand'
import { IndustryPage, type IndustryContent } from '@/components/site/industry-page'

const PATH = '/industries/window-door-fitters'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Health and safety software for window and door fitters',
  description:
    'Incident and near-miss reporting for UK window, door and glazing installers. Photo, GPS and timestamped evidence your insurer can trust. Start your free trial.',
  ogTitle: 'Incident reporting for window and door fitters | jobsafe',
})

// Every claim below is a claim the site already makes about the product
// (offline mode, media evidence, GPS/timestamps, alerts, exportable records,
// dashboards). Nothing here promises a module jobsafe does not have.

const content: IndustryContent = {
  path: PATH,
  breadcrumb: 'Window, door and glazing installers',
  placement: 'industry-fitters',
  hero: {
    eyebrow: 'For UK window, door and garage door installers',
    title: (
      <>
        Fix your incident reporting before the <span className="text-brand">next job</span>.
      </>
    ),
    lead:
      'Glass is heavy, edges are sharp, and half the job happens up a ladder. jobsafe gives your fitting and glazing crews a fast way to record accidents and near misses, photographed, GPS-anchored and timestamped, so when an insurer, a client or the HSE asks what happened, you answer in seconds, not scrambles.',
    media: {
      kind: 'video',
      src: '/videos/window-fitter-hero.mp4',
      poster: '/videos/window-fitter-hero-poster.jpg',
      alt: 'A fitter installing a window on site',
    },
  },
  trustFacts: ['Built for UK installation businesses', 'Works offline on site', 'Evidence for insurers and clients'],
  point: {
    icon: <Scale />,
    title: (
      <>
        Director liability is <span className="text-brand">personal</span>.
      </>
    ),
    body: (
      <>
        Under the Health and Safety at Work etc. Act 1974, what protects the people running the business is being able to <strong className="text-ink-1">show</strong> that reasonably practicable steps were taken. That is an evidence question: a dated, geotagged reporting trail <strong className="text-ink-1">demonstrates</strong> your system; good intentions only describe it.
      </>
    ),
  },
  pains: {
    title: 'Four moments every installer recognises',
    lead: 'Fitting glass and doors for a living means heavy, awkward, sharp loads, work at height, and crews spread across sites. When something goes wrong, the record you kept is the difference.',
    cards: [
      {
        icon: <FileSearch />,
        title: 'Your insurer asks for the incident record. How long does the answer take?',
        body: 'Every report lives in one place, searchable, timestamped and ready in seconds, not “give us a minute” while someone digs through a filing cabinet.',
      },
      {
        icon: <Siren />,
        title: 'A sealed unit slips. A hand is cut open. What happens next?',
        body: 'The fitter logs it at the scene, with photos, location and time attached, while the facts are still facts.',
      },
      {
        icon: <Timer />,
        title: 'The ladder near miss was three weeks ago. The report gets written today.',
        body: 'Reports reconstructed from memory protect nobody. jobsafe captures them on the day, on the spot.',
      },
      {
        icon: <Users />,
        title: 'A subbie crew had a near miss on Friday. You hear about it on Monday.',
        body: 'Real-time alerts notify the office the moment a report is submitted, whoever is on the job, wherever the site is.',
      },
    ],
  },
  commercial: {
    title: (
      <>
        Win the work. Keep the cover.
        <br />
        Pass the audit.
      </>
    ),
    lead: 'Installers rarely lose contracts on price alone. They lose them on paperwork they could not produce in time.',
    cards: [
      {
        icon: <Handshake />,
        title: 'Insurance renewals',
        body: 'An active, dated reporting history shows an underwriter a business that manages its risk rather than one that hopes. Walk in with evidence, not assurances.',
      },
      {
        icon: <Crosshair />,
        title: 'Commercial tenders',
        body: 'Housebuilders, local authorities and facilities clients increasingly ask for proof of a working safety management system before you are even considered. Producing your reporting record quickly is the ticket to bigger contracts.',
      },
      {
        icon: <Scale />,
        title: 'The day the HSE asks',
        body: 'If an inspector asks what happened and what you did about it, the answer is already written: timestamped, geotagged and in order.',
      },
    ],
    links: [{ label: 'RIDDOR reporting, explained in plain English', href: '/insights/riddor-reporting-explained' }],
  },
  toolkit: { audience: 'UK trades' },
  faqs: [
    {
      q: 'Does jobsafe replace our risk assessments and method statements?',
      a: 'No, and it should not. Your RAMS set out how work will be done safely; jobsafe is the reporting layer that tells you whether those controls are actually holding. Every incident and near miss your crews capture is feedback on a specific task, site or piece of kit, so you know which assessment to revisit before the next job, not after an injury.',
    },
    {
      q: 'Can it handle multiple depots and subcontracted crews?',
      a: 'Yes. jobsafe is licensed per user, so employed fitters and subcontracted crews report through the same app, and every report automatically carries who, where and when. The dashboard breaks reports down by site, so a multi-depot business sees each location, and the whole picture, in one place.',
    },
    {
      q: 'Does it help with RIDDOR reporting?',
      a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened, with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when deciding whether something is reportable and by when. Submitting to the HSE remains your decision; our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
    },
    {
      q: 'What happens when there is no signal on site?',
      a: 'The mobile app stores reports locally and syncs to the cloud as soon as connectivity returns. Fitters can capture incidents in basements, stairwells and new-build plots with no coverage without losing a single record.',
    },
    {
      q: 'Can we export evidence for an insurer, a client or an auditor?',
      a: 'Yes. Every report is timestamped and exportable, with its photos, video and voice notes permanently linked to the record, so you can hand over an evidenced account rather than a reconstruction.',
    },
    {
      q: 'Can fitters attach photos and video from the job?',
      a: 'Yes. Photos, short video clips and voice notes are attached directly within the report, automatically timestamped and geotagged at the point of capture, and permanently linked to the incident record.',
    },
    {
      q: 'How long does it take to get set up?',
      a: 'There is no installation, no hardware and no IT involvement: create an account, invite your fitters by email, and you are reporting. Onboarding guides and short video lessons in the academy get crews confident from day one.',
    },
    {
      q: 'What does the free trial include?',
      a: `The full product. ${trialSentence()} Set it up on your own sites and crews, capture some real reports, and see exactly what jobsafe would show an insurer or a client about your business.`,
    },
  ],
  faqIntro: 'Straight answers for installation businesses weighing up jobsafe.',
  launch: {
    faqs: {
      "Can we export evidence for an insurer, a client or an auditor?": "Yes. Every report is timestamped and exportable, with its photos, video and documents linked to the record, so you can hand over an evidenced account rather than a reconstruction.",
      "Can fitters attach photos and video from the job?": "Yes. Photos, short video clips and PDF documents are attached directly within the report, timestamped and geotagged at the point of capture, and linked to the incident record.",
      "Does jobsafe replace our risk assessments and method statements?": "Risk assessments are now a jobsafe module: scored 5×5 with hierarchy of control, six types including work at height, approved before they go live, and required before a permit issues. Method statements stay yours; the RAMS a principal contractor asks for is a document you attach and a risk assessment jobsafe holds.",
    },
  },
  closing: {
    title: 'Be ready before you are asked.',
    copy: 'jobsafe would put in front of an insurer, a client or the HSE about your business today.',
  },
}

export default function WindowDoorFittersPage() {
  return <IndustryPage content={content} />
}
