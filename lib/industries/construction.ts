// Construction (Phase 3, new). CDM 2015 is context only: jobsafe does not
// produce the construction phase plan, the F10 or the health and safety
// file, and says so. CSCS cards are recorded as course records with an
// expiry; jobsafe does not check them with CSCS. Facts from HSE's
// construction series, checked 25/09/2026.

import type { IndustryContent } from './types.ts'

export const construction: IndustryContent = {
  path: '/industries/construction',
  name: 'Construction',
  placement: 'industry-construction',
  eyebrow: 'For UK contractors, principal contractors and trades',
  lead: 'The site, the permit and the RAMS on one record. A hot-works permit that will not issue until the contractor’s insurance is in date and the risk assessment is live. A fall from a stepladder triaged against RIDDOR before the site manager has finished the phone call. A training matrix that shows whose card lapses next month. Hosted in London, works offline in the basement, and written for CDM 2015 sites rather than translated from somewhere else.',
  hero: 'permits-gate-desktop',
  factsLead: 'From HSE’s construction series, which covers building, civil engineering and the specialised trades. Latest years published; HSE marks them provisional.',
  facts: [
    {
      figure: '25',
      detail: 'construction workers killed in 2025/26, against an annual average of 37 over the previous five years. Construction still accounts for the largest share of worker deaths of any sector.',
      note: 'Provisional; HSE finalises the year in July 2027.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain, 2026 report',
        year: '2025/26',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/fatalinjuries.pdf',
        checked: '25/09/2026',
        quote: '“Despite a reduction in the number of deaths to construction workers in the latest year (25 deaths in 2025/26p compared to an annual average of 37 over the last 5 years), the construction sector continues to account for the largest share of fatal injuries to workers of all main industry sectors.”',
      },
    },
    {
      figure: '5×',
      detail: 'the all-industry rate of fatal injury, on the annual average rates for 2021/22 to 2025/26.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain, 2026 report',
        year: '2021/22 to 2025/26',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/fatalinjuries.pdf',
        checked: '25/09/2026',
        quote: '“The rate of fatal injury in construction, while around 5 times as high as the average rate across all industries, is considerably less than the rate in agriculture, forestry and fishing despite accounting for a greater number of cases.”',
      },
    },
    {
      figure: '3,726',
      detail: 'non-fatal injuries to construction employees reported under RIDDOR in 2024/25. 1,525 of them, 41%, were specified injuries.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, Construction statistics in Great Britain, 2025',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/construction.pdf',
        checked: '25/09/2026',
        quote: '“There were 3,726 non-fatal injuries to employees reported by employers under RIDDOR in 2024/25p. 1,525 (41%) were specified injuries and 2,201 (59%) were injuries resulting in the incapacitation of a worker for over seven days”.',
      },
    },
  ],
  pains: [
    {
      pain: 'The hot-works permit was signed in the site office by someone who had not seen the RAMS or the subbie’s insurance.',
      module: 'permits',
      outcome: 'Six permit types, each with its required controls, and a gate that will not issue a permit until the contractor’s insurance, RAMS, accreditation and audit are in date and a live risk assessment is attached. Blocked is worked out for you, with the reason shown.',
    },
    {
      pain: 'The RAMS for the roof was copied from the last job, and the last job was a warehouse.',
      module: 'risk',
      outcome: 'Six assessment types with their own templates, including a roof-access template, scored 5×5 with hazards, controls tagged by the hierarchy of control and an approval step. A warning shows on any assessment that is not yet suitable and sufficient under regulation 3.',
    },
    {
      pain: 'A labourer fell from a stepladder on Thursday. On Monday nobody knows whether it was reportable.',
      module: 'riddor',
      outcome: 'The triage runs on the report: a fracture other than to fingers, thumbs or toes is a specified injury with a 10-day deadline; more than seven days off is 15 days. The deadline is worked out from the incident date and sits on the register. You submit to HSE.',
    },
    {
      pain: 'The site manager is sure everyone has a card. The cards are in wallets, and two have expired.',
      module: 'training',
      outcome: 'CSCS, CPCS, first aid and any course are records on the competency matrix with an expiry date, flagged at 90 days. A critical course that has lapsed stops the work. jobsafe records the card; it does not check it with CSCS.',
    },
    {
      pain: 'The investigation is a Word document in a folder, and the photographs are on the supervisor’s phone.',
      module: 'investigations',
      outcome: 'A four-level ICAM analysis runs on the report itself, beside the evidence gallery, the people involved and the timeline. Moving a report into investigation needs level 2 or above; signing it off needs level 3 or above.',
    },
    {
      pain: 'Every audit finds the same thing: the actions were agreed and nobody owned them.',
      module: 'actions',
      outcome: 'One register for every action from every module, each with an owner, a due date and a status. Overdue is worked out from the date, the board shows where the work is stuck, and owners see what is overdue in the in-app bell.',
    },
  ],
  screens: [
    { id: 'permits-gate-desktop', caption: 'The permit gate: a hot-works permit blocked because the contractor’s insurance has lapsed, with the reason shown and the risk assessment it needs.' },
    { id: 'risk-register-desktop', caption: 'The risk assessment register: six types, the 5×5 score and band on each, who approved it and when it is due for review.' },
    { id: 'training-matrix-desktop', caption: 'The competency matrix: who holds which course, what expires within 90 days, and the critical courses that stop work when they lapse.' },
  ],
  legal: {
    title: 'What the site must be able to show',
    lead: 'CDM 2015 sets the duties. The Sentencing Council sets the price of not meeting them. Both are questions about the record.',
    points: [
      {
        title: 'CDM 2015: plan, manage, monitor',
        body: 'The Construction (Design and Management) Regulations 2015 require the principal contractor to plan, manage and monitor the construction phase and to ensure workers are inducted, competent and consulted. jobsafe does not produce the construction phase plan, the F10 notification or the health and safety file. It keeps the records those duties generate: the risk assessments, the permits, the incidents and the training.',
        source: { name: 'Construction (Design and Management) Regulations 2015', url: 'https://www.legislation.gov.uk/uksi/2015/51/contents', checked: '25/09/2026' },
      },
      {
        title: 'Work at height: avoid, prevent, minimise',
        body: 'The Work at Height Regulations 2005 require work at height to be avoided where reasonably practicable, and otherwise planned, supervised and carried out by competent people with the right equipment. In jobsafe that is a work-at-height permit type with its required controls, a roof-access risk assessment template and the training record for the people doing it.',
        source: { name: 'Work at Height Regulations 2005', url: 'https://www.legislation.gov.uk/uksi/2005/735/contents', checked: '25/09/2026' },
      },
      {
        title: 'The fine is set by turnover',
        body: 'Since 1 February 2016 the Sentencing Council guideline has set the starting point for a health and safety fine by the organisation’s turnover, with “large” meaning £50 million and over, and weighed the harm risked as well as the harm caused. The offence range runs to £10 million. A permit that was gated and a RAMS that was approved are the evidence of what was done.',
        source: { name: 'Sentencing Council, Health and Safety Offences guideline (organisations)', url: 'https://www.sentencingcouncil.org.uk/offences/magistrates-court/item/organisations-breach-of-duty-of-employer-towards-employees-and-non-employees-breach-of-duty-of-self-employed-to-others-breach-of-health-and-safety-regulations/', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'Fracture, over-seven-day or record only, with the deadline worked out.' },
    { label: '5×5 risk matrix calculator', href: '/tools/risk-matrix', why: 'Score a hazard on the product’s scales and read the band and the action.' },
  ],
  faqLead: 'Straight answers for principal contractors, contractors and the trades on their sites.',
  faqs: [
    {
      q: 'Does jobsafe produce the construction phase plan, the F10 or the health and safety file?',
      a: 'No. Those are the principal contractor’s and the client’s documents under the Construction (Design and Management) Regulations 2015, and jobsafe does not write them. It keeps the records the plan relies on and the file draws from: the risk assessments and method statements, the permits, the incidents and near misses, the investigations and the training matrix, all on one record and exportable.',
    },
    {
      q: 'Are CSCS cards checked?',
      a: 'They are recorded, not checked. A CSCS, CPCS or any other card is a course record on the competency matrix with an expiry date, flagged at 90 days, and a critical course that has lapsed stops the work. jobsafe does not verify a card with CSCS or read the card’s chip; that stays with the CSCS smart check. The record is how a principal contractor shows the competence duty in the Construction (Design and Management) Regulations 2015 was met.',
    },
    {
      q: 'Which permits does it cover?',
      a: 'Hot works, confined space, work at height, electrical, excavation and roof work, each with its own required controls: the permit is how the site shows the planning and supervision that the Work at Height Regulations 2005 and the Confined Spaces Regulations 1997 require. A permit will not issue until the contractor is not suspended, their insurance, RAMS, accreditation and last audit are in date, and a live risk assessment is attached. The confirmed controls are stored on the permit with who confirmed them.',
    },
    {
      q: 'A subcontractor’s worker is injured on our site. Who reports it under RIDDOR?',
      a: 'The injured person’s employer is the responsible person under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013, so the subcontractor reports its own employee. For a self-employed person injured on premises under someone else’s control, the person in control of the premises reports. Either way the principal contractor wants the record, and jobsafe holds the report, the triage and the deadline whoever submits it.',
    },
    {
      q: 'Does it cover ladders and stepladders under the Work at Height Regulations 2005?',
      a: 'Work at height is a permit type with its required controls and a roof-access risk assessment template, and a fall from a ladder is triaged against RIDDOR like any other injury. jobsafe does not decide for you whether a ladder was the right choice; HSE’s guidance on the safe use of ladders and stepladders does that, and your risk assessment records the decision.',
    },
    {
      q: 'What about silica dust and COSHH?',
      a: 'COSHH is one of the six assessment types, with its own template, scored 5×5 and tagged by the hierarchy of control, so cutting, grinding and drilling get an assessment of their own under the Control of Substances Hazardous to Health Regulations 2002. jobsafe does not do exposure monitoring or health surveillance; it keeps the assessment and the controls.',
    },
    {
      q: 'Can it hold the LOLER dates for excavators, hoists and telehandlers?',
      a: 'Yes. The fleet and plant register holds MOT, tax, insurance, service and inspection dates on vehicles and plant, including the thorough examination date the Lifting Operations and Lifting Equipment Regulations 1998 require for lifting equipment. A date that has passed shows “do not use”; one due within 30 days is flagged.',
    },
    {
      q: 'Does it work in a basement, a plant room or a site with no signal?',
      a: 'Yes, in every module. A report, a permit or a risk assessment saves to the phone first and shows “Pending sync” until signal returns, then syncs on its own. Signed-in phones open offline, so a site that is a hole in the ground on Monday is not a problem on Monday. The RIDDOR 2013 deadline still counts from the incident date, not the date the phone found signal, which is why the report carries the date it was written.',
    },
  ],
  closing: {
    title: 'See it on a site, not a slide.',
    copy: 'A 30-minute walkthrough of the permit gate, the RAMS and the RIDDOR verdict with someone who knows the product.',
  },
}
