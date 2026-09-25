// Field services (Phase 3 rebuild). Kept from the Phase 1 page: the lead
// image of plant rooms with no bars, and the plain statement that jobsafe is
// not a lone-worker alarm. CHAS, SafeContractor and Constructionline are
// named only as schemes. There is no HSE series for field service or lone
// working, so the facts are DfT (driving for work) and all-industry HSE
// figures, and the page says so. Checked 25/09/2026.

import type { IndustryContent } from './types.ts'

export const fieldServices: IndustryContent = {
  path: '/industries/field-services',
  name: 'Field services',
  placement: 'industry-field-services',
  eyebrow: 'For UK field service, maintenance and mobile engineering teams',
  lead: 'Plant rooms with no bars on the phone. Roofs, lofts, substations and customer sites nobody from your office has ever walked. jobsafe gives lone and mobile engineers the report, the risk assessment for the job and the procedure they need on the phone in their pocket, saved to the device until there is a signal, so when a client, an insurer or the HSE asks what happened, the answer is a record and not a reconstruction. It is not a lone-worker alarm, and it says so.',
  hero: 'reports-register-desktop',
  factsLead: 'There is no HSE series for field service. The first figure is from the Department for Transport, because road collisions are outside RIDDOR; the other two are all-industry HSE figures that apply to work at height on any site.',
  facts: [
    {
      figure: '583',
      detail: 'people killed in collisions involving driving for work in 2025, an estimate for Great Britain.',
      note: 'DfT official statistics; road collisions are not reportable under RIDDOR.',
      source: {
        name: 'Department for Transport, Reported road casualties Great Britain: estimates involving driving for work',
        year: '2025',
        url: 'https://www.gov.uk/government/statistics/reported-road-casualties-great-britain-involving-driving-for-work/reported-road-casualties-great-britain-estimates-involving-driving-for-work-new-approach',
        checked: '25/09/2026',
        quote: '“In 2025, an estimated: 583 people were killed in collisions involving driving for work, a decrease of 25% compared with 2016.”',
      },
    },
    {
      figure: '31',
      detail: 'workers killed by a fall from height in 2025/26, around a quarter of all worker deaths and the most common kind of fatal accident, across all industries.',
      note: 'Provisional; HSE finalises the year in July 2027.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain',
        year: '2025/26',
        url: 'https://www.hse.gov.uk/statistics/fatals-overview.htm',
        checked: '25/09/2026',
        quote: 'Table “Main kinds of fatal accident for workers, 2025/26”: “Falls from a height 31”. Report: “The most common kind of fatal accident continues to be falls from a height, accounting for around a quarter of fatal injuries to workers in 2025/26p.”',
      },
    },
    {
      figure: '8%',
      detail: 'of employer-reported non-fatal injuries to employees in 2024/25 were falls from a height: 4,684 reports, across all industries.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, Kind of accident statistics in Great Britain, 2025',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/kinds-of-accident.pdf',
        checked: '25/09/2026',
        quote: '“Falls from a height, the most common cause of fatal injury to workers in recent years, accounted for 8% of employer reported non-fatal injuries to employees in 2024/25.” RIDKIND Table 2, All industries, Falls from a height: 4,684.',
      },
    },
  ],
  pains: [
    {
      pain: 'The engineer slipped in the customer’s car park, drove to the next job, and told someone on Friday.',
      module: 'incidents',
      outcome: 'The seven-step report is on the phone in their pocket, offline included: the site, the GPS from the phone, a photo of the surface, the people involved. It is on the register the moment it syncs, not the moment someone remembers.',
    },
    {
      pain: 'The risk assessment for the job is a PDF in a shared drive, written for a different customer.',
      module: 'risk',
      outcome: 'Six assessment types scored 5×5 with hazards, controls tagged by the hierarchy of control and an approval step, on the same phone as the report. The one for this job is the one they open.',
    },
    {
      pain: 'Nobody can say which van is due its MOT and which one has no insurance certificate on file.',
      module: 'fleet',
      outcome: 'Every van carries its MOT, tax, insurance and service dates. A date that has passed shows “do not use”; one due within 30 days is flagged. The walkaround is a checklist that raises an action when something fails.',
    },
    {
      pain: 'A client asks for evidence that the engineer on their site was competent for the task. The certificate is a photo on someone’s phone.',
      module: 'training',
      outcome: 'The competency matrix shows who holds which course and when it expires, flagged at 90 days. A critical course that has lapsed stops the work. Certificates sit on the record, not in a wallet.',
    },
    {
      pain: 'The procedure changed in March. The version on the van is from last year.',
      module: 'documents',
      outcome: 'A folder tree with access levels, and a new version uploaded under the same name replaces the old one. The engineer opens the current procedure on the phone; the old one is history, not a choice.',
    },
    {
      pain: 'An engineer fractures a wrist on a client’s premises, and two companies each assume the other is reporting it.',
      module: 'riddor',
      outcome: 'The triage runs on the report: a fracture is a specified injury, reported within 10 days by the engineer’s employer. The deadline is worked out from the incident date and sits on the register. You submit to HSE; jobsafe keeps the reference.',
    },
  ],
  screens: [
    { id: 'report-new-evidence-phone', caption: 'The evidence step on the phone: a photo from the camera straight onto the report, with the site and the GPS already captured, no signal needed.' },
    { id: 'fleet-cards-desktop', caption: 'The van fleet as cards: MOT, tax, insurance and service dates on each, with the ones due within 30 days flagged.' },
    { id: 'documents-tree-desktop', caption: 'Document control: the folder tree with access levels and the current version of each procedure, replaced in place when a new one is uploaded under the same name.' },
  ],
  legal: {
    title: 'Duties that travel with the engineer',
    lead: 'The law does not change because the work happens on someone else’s premises. Neither does the record you need to show.',
    points: [
      {
        title: 'Your duty follows your people onto the client’s site',
        body: 'Section 2 of the Health and Safety at Work etc. Act 1974 places the duty for an employee’s health and safety on their employer, wherever the work is. Section 3 adds a duty to people who are not your employees but are affected by your work, which on a client’s site means their staff and the public. The assessment for the job and the record of what happened are how both duties are shown.',
        source: { name: 'Health and Safety at Work etc. Act 1974, section 2', url: 'https://www.legislation.gov.uk/ukpga/1974/37/section/2', checked: '25/09/2026' },
      },
      {
        title: 'Lone working is a risk to assess, not a device to buy',
        body: 'HSE’s guidance on lone working asks employers to assess the risks of working alone, put controls in place and keep in touch. jobsafe holds the assessment, the training record and the incident when something happens. It is not a man-down or panic-alarm service, does not monitor location and does not raise an alarm; a client who wants that buys it alongside.',
        source: { name: 'HSE, Lone working', url: 'https://www.hse.gov.uk/lone-working/index.htm', checked: '25/09/2026' },
      },
      {
        title: 'Driving for work is work',
        body: 'HSE’s guidance on driving and riding safely for work treats the van and the journey as part of the job, with the same duty to manage the risk. jobsafe keeps the vehicle’s statutory dates and the walkaround, and the incident record when there is one. It does not track the vehicle, read the tachograph or score the driver.',
        source: { name: 'HSE, Driving and riding safely for work', url: 'https://www.hse.gov.uk/roadsafety/index.htm', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'Who reports, what is reportable and by when, one question at a time.' },
    { label: '5×5 risk matrix calculator', href: '/tools/risk-matrix', why: 'Score a hazard on the product’s scales and read the band and the action.' },
  ],
  faqLead: 'Straight answers for the people whose engineers are already out there.',
  faqs: [
    {
      q: 'Is jobsafe a lone-worker alarm?',
      a: 'No. It is not a man-down or panic-alarm service, it does not monitor an engineer’s location and it does not raise an alarm to a control room; if the lone working risk assessment HSE’s guidance asks for needs that, buy it alongside. What jobsafe gives a lone engineer is the report, the risk assessment for the job, the procedure and their training record on the phone, offline, and the record of what happened when something did.',
    },
    {
      q: 'An engineer is injured on a client’s premises. Who reports it under RIDDOR?',
      a: 'The engineer’s employer. Under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 the responsible person for an injured employee is their employer wherever the injury happened, so it is your report, not the client’s. jobsafe triages the injury on the report, works the 10 or 15-day deadline out from the incident date and keeps the reference. You submit to HSE.',
    },
    {
      q: 'Does it work in a plant room, a loft or a substation with no signal?',
      a: 'Yes, in every module. A report, a risk assessment or a document opens and saves on the phone first and shows “Pending sync” until signal returns, then syncs on its own. Basements, lift shafts and rural sites are the normal case for a field engineer, not an edge case. The RIDDOR 2013 deadline still counts from the incident date, not the date the phone found signal, which is why the report carries the date it was written.',
    },
    {
      q: 'What does it keep about driving for work?',
      a: 'The vehicle’s MOT, tax, insurance and service dates on the fleet register, the walkaround as a checklist whose failed items raise actions, and the incident record when something happens in the van or the car park. It does not track the vehicle, read the tachograph or score driving, and a road collision on the public highway is not RIDDOR reportable, which the triage will tell you.',
    },
    {
      q: 'We use ladders on customer sites every day. What does the Work at Height Regulations 2005 side look like?',
      a: 'A work-at-height permit type with its required controls, a roof-access risk assessment template, and the training record for the people doing it. A fall from a ladder is triaged against RIDDOR like any other injury. HSE’s guidance on the safe use of ladders and stepladders decides whether the ladder was the right choice; your risk assessment records that decision.',
    },
    {
      q: 'Can it hold the competence evidence the Electricity at Work Regulations 1989 expect?',
      a: 'It holds the records. The Electricity at Work Regulations 1989 require the people doing electrical work to be competent, and jobsafe keeps each engineer’s courses and certificates on the competency matrix with their expiry dates, flagged at 90 days, with a critical course that has lapsed stopping the work. jobsafe does not assess competence itself; it shows who is in date.',
    },
    {
      q: 'What about COSHH for the substances engineers carry in the van?',
      a: 'COSHH is one of the six assessment types, with its own template, scored 5×5 and tagged by the hierarchy of control, so the solvents, refrigerants and cleaning products in the van get an assessment under the Control of Substances Hazardous to Health Regulations 2002. The current assessment is on the phone with the job.',
    },
    {
      q: 'What do CHAS, SafeContractor and Constructionline actually ask for?',
      a: 'Evidence that a safety management system exists and works: incident and near-miss records, risk assessments and method statements, training records, and how actions are closed. All three are member schemes of Safety Schemes in Procurement (SSIP), so the questions are the SSIP core criteria. jobsafe keeps those records and exports them to CSV. It is not an accreditation and is not affiliated with any scheme; it is where the evidence the assessor asks for lives.',
    },
  ],
  closing: {
    title: 'Your engineers are already out there.',
    copy: 'A 30-minute walkthrough of the report, the risk assessment and the fleet register on a phone with no signal, with someone who knows the product.',
  },
}
