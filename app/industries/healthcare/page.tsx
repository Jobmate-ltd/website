import type { Metadata } from 'next'
import { Crosshair, FileSearch, Handshake, MoonStar, Scale, Siren, Users } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { trialSentence } from '@/lib/brand'
import { IndustryPage, type IndustryContent } from '@/components/site/industry-page'

const PATH = '/industries/healthcare'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Health and safety software for care homes and healthcare',
  description:
    'Incident and near-miss reporting for UK care homes, home care and clinical teams. Photo, GPS and timestamped evidence an inspector can trust. Start your free trial.',
  ogTitle: 'Every shift, every incident, on the record | jobsafe',
})

// Every claim below is a claim the site already makes about the product
// (offline mode, media evidence, GPS/timestamps, alerts, exportable records,
// dashboards). This page is explicit that jobsafe is workplace HSSE reporting
// and not a clinical patient-safety system: the H1 is about staff safety, and
// the first FAQ says so in plain words, so the two can never contradict.

const content: IndustryContent = {
  path: PATH,
  breadcrumb: 'Care homes, home care and healthcare',
  placement: 'industry-healthcare',
  hero: {
    eyebrow: 'For UK care homes, home care and healthcare providers',
    title: (
      <>
        Every shift, every incident, <span className="text-brand">on the record</span>.
      </>
    ),
    lead:
      'Hoists and transfers, sharps, wet floors, aggression, and staff working alone in other people’s homes at seven in the morning. jobsafe gives carers, nurses and support workers a fast way to record accidents and near misses, photographed, GPS-anchored and timestamped, so when an inspector, a commissioner or an insurer asks what happened, you answer in seconds rather than scrambles.',
    media: {
      kind: 'video',
      src: '/videos/healthcare-hero.mp4',
      poster: '/videos/healthcare-hero-poster.jpg',
      alt: 'A carer supporting an older resident in a care home lounge',
    },
  },
  trustFacts: ['Built for UK care and clinical teams', 'Works offline on home visits', 'Staff safety, not patient records'],
  point: {
    icon: <Scale />,
    title: (
      <>
        Good governance is an <span className="text-brand">evidence</span> test.
      </>
    ),
    body: (
      <>
        Regulation 17 of the Health and Social Care Act 2008 (Regulated Activities) Regulations 2014 requires providers to keep accurate, complete and contemporaneous records, and to assess, monitor and mitigate risks to health and safety. The Health and Safety at Work etc. Act 1974 asks the same of you for your staff. Both are evidence questions: a dated, geotagged reporting trail <strong className="text-ink-1">demonstrates</strong> your system; good intentions only <strong className="text-ink-1">describe</strong> it.
      </>
    ),
    note: 'Regulation 17 is the England wording. The Care Inspectorate, Care Inspectorate Wales and RQIA ask the same question in their own.',
  },
  pains: {
    title: 'Four moments every provider recognises',
    lead: 'Care work is physical, unpredictable and often done alone or at three in the morning, by people who move between homes, rounds and rotas. When something goes wrong, the record you kept is the difference.',
    cards: [
      {
        icon: <FileSearch />,
        title: 'An inspector asks for six months of incidents. How long does the answer take?',
        body: 'Every report lives in one place, searchable, timestamped and ready in seconds, not “bear with us” while somebody hunts for the accident book in the office drawer.',
      },
      {
        icon: <Siren />,
        title: 'A transfer goes wrong and a carer’s back goes with it. What happens next?',
        body: 'The carer logs it where it happened, with photos, location and time attached, while the facts are still facts and not a memory of a busy shift.',
      },
      {
        icon: <MoonStar />,
        title: 'The fall happened on nights. The write-up happens when someone gets a minute.',
        body: 'A report reconstructed three days later from a handover note protects nobody. jobsafe captures it on the shift, on the spot.',
      },
      {
        icon: <Users />,
        title: 'An agency carer had a near miss on a Friday visit. You hear about it on Monday.',
        body: 'Real-time alerts notify the office the moment a report is submitted: employed, bank or agency, whichever home or postcode they are working in.',
      },
    ],
  },
  commercial: {
    title: (
      <>
        Win the contract. Keep the cover.
        <br />
        Pass the inspection.
      </>
    ),
    lead: 'Providers rarely lose a framework place on price alone. They lose it on evidence they could not produce in time.',
    cards: [
      {
        icon: <Handshake />,
        title: 'Insurance renewals',
        body: 'An active, dated reporting history shows an employers’ liability underwriter a provider that manages its risk rather than one that hopes. Walk in with evidence, not assurances.',
      },
      {
        icon: <Crosshair />,
        title: 'Commissioners and frameworks',
        body: 'Local authorities, integrated care boards and private clients increasingly ask for proof of a working safety management system before a provider joins the list. Producing your reporting record quickly is the ticket to bigger contracts.',
      },
      {
        icon: <Scale />,
        title: 'The day the inspector asks',
        body: 'If a CQC inspector or an HSE officer asks what happened and what you did about it, the answer is already written: timestamped, geotagged and in order.',
      },
    ],
    links: [
      { label: 'RIDDOR reporting, explained in plain English', href: '/insights/riddor-reporting-explained' },
      { label: 'Lone worker safety, for staff on community rounds', href: '/insights/lone-worker-safety-guide' },
    ],
  },
  toolkit: { audience: 'UK employers' },
  faqs: [
    {
      q: 'Is jobsafe a clinical patient-safety system?',
      a: 'No, and it does not pretend to be. jobsafe is workplace health and safety reporting: accidents, near misses and hazards affecting the people doing the work and the people around them. It sits alongside your clinical governance and patient-safety arrangements rather than replacing them, and it does not submit to national patient-safety services on your behalf. What it does is give you a fast, evidenced, timestamped record of what actually happened on site.',
    },
    {
      q: 'Does jobsafe replace our risk assessments and care plans?',
      a: 'No, and it should not. Your risk assessments and care plans set out how work should be done safely; jobsafe is the reporting layer that tells you whether those controls are actually holding. Every incident and near miss your staff capture is feedback on a specific task, building, round or piece of equipment, so you know which assessment to revisit before the next shift rather than after an injury.',
    },
    {
      q: 'Can it handle multiple homes, branches and agency staff?',
      a: 'Yes. jobsafe is licensed per user, so employed, bank and agency staff all report through the same app, and every report automatically carries who, where and when. The dashboard breaks reports down by site, so a provider running several homes or branches sees each location, and the whole picture, in one place.',
    },
    {
      q: 'Does it help with RIDDOR reporting?',
      a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened, with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when you are deciding whether something is reportable and by when. Submitting to the HSE remains your decision; our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
    },
    {
      q: 'What happens when there is no signal, in a service user’s home, a lift or a plant room?',
      a: 'The mobile app stores reports locally and syncs to the cloud as soon as connectivity returns. Community and domiciliary staff can capture incidents in flats, lifts, rural properties and basements with no coverage at all, without losing a single record.',
    },
    {
      q: 'Is it safe to attach photos in a care setting?',
      a: 'Media is stored under UK GDPR, encrypted in transit and at rest on UK-based AWS, with a data processing agreement available on request. What goes into a report remains your call and your policy: for most incidents the evidence that matters is the hazard rather than the person, the wet floor, the failed hoist sling, the damaged bed rail, and your staff should be told to record it that way.',
    },
    {
      q: 'Can we export evidence for an inspector, a commissioner or an insurer?',
      a: 'Yes. Every report is timestamped and exportable, with its photos, video and voice notes permanently linked to the record, so you hand over an evidenced account rather than a reconstruction.',
    },
    {
      q: 'How long does it take to get set up?',
      a: 'There is no installation, no hardware and no IT involvement: create an account, invite your staff by email, and you are reporting. Onboarding guides and short video lessons in the academy get carers, nurses and support workers confident from day one.',
    },
    {
      q: 'What does the free trial include?',
      a: `The full product. ${trialSentence()} Set it up across one home or one community round, capture some real reports, and see exactly what jobsafe would show an inspector, a commissioner or an insurer about your service.`,
    },
  ],
  faqIntro: 'Straight answers for care and healthcare providers weighing up jobsafe.',
  launch: {
    faqs: {
      "Can we export evidence for an inspector, a commissioner or an insurer?": "Yes. Every report is timestamped and exportable, with its photos, video and documents linked to the record, so you hand over an evidenced account rather than a reconstruction.",
      "Does jobsafe replace our risk assessments and care plans?": "Care plans stay yours. Risk assessments are now a jobsafe module: general, COSHH, fire, DSE, manual handling and bespoke types, scored 5×5 with hierarchy of control and approved before they go live, on the same record as the incident. The reporting and the assessing now sit together.",
    },
  },
  closing: {
    title: 'Evidence, not recollection.',
    copy: 'jobsafe would put in front of an inspector, a commissioner or an insurer about your service today.',
  },
}

export default function HealthcarePage() {
  return <IndustryPage content={content} />
}
