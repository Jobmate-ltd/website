import type { Metadata } from 'next'
import { ChartColumn, Crosshair, Eye, Folders, Handshake, Scale, TriangleAlert, Users } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { trialSentence } from '@/lib/brand'
import { IndustryPage, type IndustryContent } from '@/components/site/industry-page'

const PATH = '/industries/transport-logistics'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Health and safety software for transport and logistics',
  description:
    'Incident and near-miss reporting for UK transport, logistics and warehousing operators. Evidence for PQQs, customer audits and the HSE. Start your free trial.',
  ogTitle: 'Incident reporting for depots, yards and cabs | jobsafe',
})

// Written for operations and HSEQ management. Every legal claim below is
// checkable and names its source and year on the page:
//   • Sentencing Council Definitive Guideline for Health and Safety Offences,
//     in force 01/02/2016. Fines are assessed against turnover and against the
//     harm risked as well as the harm caused. Large organisation (£50m+
//     turnover): health and safety range reaches £10m; corporate manslaughter
//     £20m. Those are the published range ceilings.
//   • HSWA 1974 s.37: personal liability for a director or manager where the
//     offence is committed with their consent or connivance, or attributable to
//     their neglect. Disqualification is available under CDDA 1986.
//   • HSE's public register of convictions and enforcement notices is
//     searchable by company name at hse.gov.uk.
// Deliberately NOT stated: the Fee for Intervention hourly rate, and any injury
// or fatality count. The first FAQ states plainly that this is not telematics.

const content: IndustryContent = {
  path: PATH,
  breadcrumb: 'Transport, logistics and warehousing',
  placement: 'industry-logistics',
  hero: {
    eyebrow: 'For UK transport, logistics and warehousing operators',
    title: (
      <>
        The fine is set by what <span className="text-brand">could</span> have happened
      </>
    ),
    lead:
      'Since 2016 the Sentencing Council guideline has weighed the harm an operation risked, not only the harm it caused, and set the fine against turnover. Which makes the forklift near miss nobody logged the most expensive record you do not have. jobsafe gives every depot, yard and cab an evidenced, timestamped incident and near-miss trail: the thing your customer’s bid team, your underwriter and an HSE inspector all ask to see.',
    media: {
      kind: 'image',
      src: '/images/industries/transport-logistics-hero.jpg',
      alt: 'A forklift truck working an aisle between loaded pallet racking in a distribution warehouse',
    },
  },
  trustFacts: ['Built for UK multi-site operators', 'Evidence for PQQs and audits', 'Works offline in yards and cold stores'],
  point: {
    icon: <Eye />,
    title: (
      <>
        Your safety record is <span className="text-brand">public</span>.
      </>
    ),
    body: (
      <>
        The HSE publishes convictions and enforcement notices on a register anyone can search by company name. Your customers&apos; procurement teams can read it, and in a sector where contracts turn on HSE performance, they <strong className="text-ink-1">do</strong>. Alongside the accident frequency rate and RIDDOR history your tender documents already ask for, the record you keep is either a commercial asset or a commercial problem. You do not get to decide which after the fact.
      </>
    ),
  },
  pains: {
    title: 'Four questions with only one good answer',
    lead: 'None of these are asked by the people driving the trucks. They are asked by auditors, underwriters, customers and inspectors, and they are all asked of you.',
    cards: [
      {
        icon: <ChartColumn />,
        title: 'A customer’s PQQ asks for your accident frequency rate over three years. Can you produce one?',
        body: 'An accident frequency rate is arithmetic performed on data you either captured or you did not. jobsafe gives you the half that is hard to reconstruct: every incident, dated, categorised and attributable to a site, so the answer is a report rather than an estimate.',
      },
      {
        icon: <TriangleAlert />,
        title: 'Your near-miss numbers are suspiciously low. An auditor knows what that means.',
        body: 'A near-zero near-miss count does not read as a safe operation. It reads as a reporting failure, and a sudden spike reads as a system that has only just started working. Capture that takes a few taps is how you get a number that means something.',
      },
      {
        icon: <Users />,
        title: 'The shift manager knew on Tuesday. You found out at the monthly review.',
        body: 'Real-time alerts put the report in front of the office the moment it is submitted, and the dashboard breaks reports down by site, so a pattern at one depot is visible while it is still one depot’s problem.',
      },
      {
        icon: <Folders />,
        title: 'An inspector asks for three years of records. Where are they, exactly?',
        body: 'Every report is timestamped and exportable, held in one place across every depot, yard and vehicle, rather than across three ring binders, a shared drive and a supervisor’s phone.',
      },
    ],
  },
  commercial: {
    title: (
      <>
        Win the tender. Keep the cover.
        <br />
        Survive the audit.
      </>
    ),
    lead: 'Operators rarely lose a contract on rate alone. They lose it on a safety record they could not evidence when the bid was due.',
    cards: [
      {
        icon: <Crosshair />,
        title: 'Tenders are scored on it',
        body: 'Retailers, manufacturers and public bodies score HSE performance directly: RIDDOR counts, accident frequency rate, enforcement notices and prosecutions over the last three to five years. FORS and CLOCS put the same questions in writing. A bid that cannot evidence its record loses to one that can.',
      },
      {
        icon: <Scale />,
        title: 'How the fine is actually calculated',
        body: 'Since 2016 the Sentencing Council guideline has set health and safety fines against turnover rather than profit, and against the harm risked rather than only the harm caused. For a large organisation the published range reaches £10m, and £20m for corporate manslaughter. On logistics margins, a turnover-based fine is a different kind of number.',
      },
      {
        icon: <Handshake />,
        title: 'Cover, and the person who signs',
        body: 'Employers’ liability and motor fleet renewals turn on claims history and on whether you can show the risk is managed. And under section 37 of the Health and Safety at Work etc. Act 1974, where an offence is attributable to the neglect of a director or manager, that individual is personally liable, with disqualification available to the court.',
      },
    ],
    links: [
      { label: 'Why near-miss reporting is the number auditors read', href: '/insights/near-miss-reporting-safety-culture' },
      { label: 'RIDDOR reporting, explained in plain English', href: '/insights/riddor-reporting-explained' },
    ],
  },
  toolkit: { audience: 'UK operators' },
  faqs: [
    {
      q: 'Is this telematics or a driver-behaviour system?',
      a: 'No. jobsafe does not track vehicles, score driving, or replace your tachograph, telematics or camera platform, and it will not tell you who braked hard on the A14. It is the incident and near-miss reporting layer that sits alongside those systems: what happened, where, when, with the evidence attached and an auditable trail from raised to closed. Operators generally have plenty of vehicle data and very little on the near miss in the yard that nobody wrote down.',
    },
    {
      q: 'We already keep an accident book. What does this change?',
      a: 'An accident book is a legal minimum and a record of injuries that have already happened. It tells you nothing about the near misses that preceded them, carries no photographs, no location and no timeline, and cannot be analysed. jobsafe captures the incidents and the near misses with evidence attached at the point of capture, routes them to the right person immediately, and gives you the trend across sites, which is what an auditor, an underwriter and a customer are actually asking to see.',
    },
    {
      q: 'Can we produce an accident frequency rate from it?',
      a: 'jobsafe gives you the half of that calculation that is hard to get right: a complete, dated, categorised incident count you can filter by site and period, and export. The hours-worked figure you divide it by comes from your payroll or workforce system, so the rate itself is assembled by you rather than published by us, but you will no longer be reconstructing the numerator from memory and a spreadsheet.',
    },
    {
      q: 'Can we report by depot, and still see the group picture?',
      a: 'Yes. The dashboard breaks reports down by site, so each depot, yard or contract can be looked at on its own and against the others. jobsafe is licensed per user, so employed, agency and subcontracted staff report through the same app, and every report automatically carries who, where and when, which matters most for the people who are not on your payroll.',
    },
    {
      q: 'Our drivers and yard staff won’t use it.',
      a: 'That is the objection worth taking seriously, because a reporting system nobody uses produces exactly the near-zero numbers an auditor distrusts. A report takes a few taps on the phone already in their pocket, with photographs and voice notes instead of typing; a driver in gloves at a loading bay will talk when they will not fill in a form. The friction you remove is the reporting rate you get.',
    },
    {
      q: 'What happens with no signal, in a yard, a trailer or a cold store?',
      a: 'The mobile app stores reports on the device and syncs to the cloud as soon as connectivity returns. Steel-clad warehouses, cold stores, underground service yards and rural laybys are exactly where coverage fails and exactly where incidents go unrecorded, so this is not an edge case in this sector. It is the normal case.',
    },
    {
      q: 'Does it help with RIDDOR reporting?',
      a: 'It gives your responsible person what RIDDOR decisions depend on: a fast, dated record of what happened with the evidence attached. Reports are timestamped and geotagged at the point of capture, so the timeline is already in front of you when you are deciding whether something is reportable and by when. Submitting to the HSE remains your decision; our free toolkit includes a RIDDOR decision flowchart to make it a quick one.',
    },
    {
      q: 'Can we export evidence for a customer audit or an insurer?',
      a: 'Yes. Every report is timestamped and exportable, with its photographs, video and voice notes permanently linked to the record. That is the difference between handing a customer’s auditor an evidenced account and handing them a reconstruction written the week they asked for it.',
    },
    {
      q: 'How long does it take to roll out across several sites?',
      a: `A multi-site rollout is a matter of inviting people rather than installing anything: no hardware, no integration work, no IT project. Onboarding guides and short video lessons in the academy cover the crews. ${trialSentence()} That is long enough to run one depot properly and see what the reporting rate actually looks like before you commit.`,
    },
  ],
  faqIntro: 'Straight answers for the people who sign the tender and carry the liability.',
  closing: {
    title: 'Three years of evidence starts today.',
    copy: 'jobsafe would put in front of a customer’s auditor, an underwriter or the HSE about your operation today.',
  },
}

export default function TransportLogisticsPage() {
  return <IndustryPage content={content} />
}
