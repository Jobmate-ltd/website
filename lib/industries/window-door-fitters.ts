// Window and door fitters (Phase 3 rebuild). Kept from the Phase 1 page:
// the lead ("Glass is heavy, edges are sharp, and half the job happens up a
// ladder"), the director-liability framing and the FAQ questions that
// worked. Facts from HSE's construction series, which HSE defines to
// include glazing; there is no glazing-only series and the page says so.
// Checked 25/09/2026.

import type { IndustryContent } from './types.ts'

export const windowDoorFitters: IndustryContent = {
  path: '/industries/window-door-fitters',
  name: 'Window and door fitters',
  placement: 'industry-fitters',
  eyebrow: 'For UK window, door and garage door installers',
  lead: 'Glass is heavy, edges are sharp, and half the job happens up a ladder. jobsafe gives fitting and glazing crews the report, the risk assessment for the job and their training record on the phone in the van, saved to the device until there is a signal. A sealed unit slips and a hand is cut: the report is written at the scene with the photo, and the RIDDOR verdict is worked out before the fitter is back in the van. Hosted in London, works offline on the plot.',
  hero: 'risk-register-desktop',
  factsLead: 'HSE has no glazing-only series. These figures are from its construction series, which HSE defines to include glazing among the specialised trades.',
  facts: [
    {
      figure: 'Over half',
      detail: 'of construction worker deaths over the last five years were falls from height: an average of 19 deaths a year.',
      note: 'Five-year average, 2021/22 to 2025/26p.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain, 2026 report',
        year: '2021/22 to 2025/26',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/fatalinjuries.pdf',
        checked: '25/09/2026',
        quote: '“A markedly higher proportion of worker deaths in construction were due to falls from a height compared to other sectors, with over half of all deaths in construction over this five-year period accounted for by this accident kind (average of 19 deaths per year).”',
      },
    },
    {
      figure: '736',
      detail: 'falls from height reported under RIDDOR for construction employees in 2024/25, 20% of the sector’s injuries. 513 of them were specified injuries.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, RIDKIND: injuries reported under RIDDOR by kind of accident and industry, Table 2',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/ridkind.xlsx',
        checked: '25/09/2026',
        quote: 'Table 2, 2024/25p, Construction, “Falls from a height”: total number of reported non-fatal injuries to employees 736; number of specified injuries 513; share of the industry group’s injuries 0.2.',
      },
    },
    {
      figure: '41,000',
      detail: 'construction workers with a work-related musculoskeletal disorder each year, 53% of the sector’s ill health. 2.0% of the workforce, against 1.2% across all industries.',
      note: 'Labour Force Survey estimate, averaged over 2022/23 to 2024/25.',
      source: {
        name: 'HSE, Construction statistics in Great Britain, 2025',
        year: '2022/23 to 2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/construction.pdf',
        checked: '25/09/2026',
        quote: '“There were an estimated 41,000 workers suffering from a work-related musculoskeletal disorder (new or long-standing), 53% of all ill health in this sector.” … “Around 2.0% of workers in the sector suffered from work-related musculoskeletal disorders (new or long-standing)” … “statistically significantly higher than that for workers across all industries (1.2%)”.',
      },
    },
  ],
  pains: [
    {
      pain: 'A sealed unit slips and a hand is cut open. The report gets written when someone is back in the office.',
      module: 'incidents',
      outcome: 'The seven-step report is on the fitter’s phone at the scene: the site, the GPS, a photo of the unit and the hand, the people involved. It is on the register with a number the moment it syncs, offline included.',
    },
    {
      pain: 'The ladder near miss was three weeks ago and nobody is sure it happened.',
      module: 'incidents',
      outcome: 'A near miss is one of four report categories and takes the same seven steps, so it is written on the day. The register shows the pattern: which crew, which kind of job, which month.',
    },
    {
      pain: 'A fitter fractures a wrist stepping off a ladder. Is it RIDDOR, and when is the deadline?',
      module: 'riddor',
      outcome: 'A fracture other than to fingers, thumbs or toes is a specified injury, reported within 10 days. The triage says so on the report and works the deadline out from the incident date. You submit to HSE; jobsafe keeps the reference.',
    },
    {
      pain: 'The RAMS for the bay window went in with the tender and nobody has opened it since.',
      module: 'risk',
      outcome: 'Six assessment types with their own templates, including a roof-access template and manual handling for the glass, scored 5×5 with controls tagged by the hierarchy of control and an approval step. The method statement is a controlled document beside it.',
    },
    {
      pain: 'The working-at-height course expired for two of the crew, and the crew is on a first-floor job.',
      module: 'training',
      outcome: 'The competency matrix shows who holds which course and when it expires, flagged at 90 days. A critical course that has lapsed stops the work, and the gap raises an action.',
    },
    {
      pain: 'Four vans, and the MOT on one of them lapsed in August.',
      module: 'fleet',
      outcome: 'Every van carries its MOT, tax, insurance and service dates. A date that has passed shows “do not use”; one due within 30 days is flagged. The walkaround is a checklist whose failed items raise actions.',
    },
  ],
  screens: [
    { id: 'report-new-evidence-phone', caption: 'The evidence step on the phone: a photo from the camera straight onto the report, with the site and the GPS already captured, no signal needed.' },
    { id: 'risk-matrix-desktop', caption: 'The 5×5 worksheet on a work-at-height assessment: likelihood against severity, the band and the action it calls for, with the controls tagged by hierarchy.' },
    { id: 'fleet-cards-desktop', caption: 'The vans as cards: MOT, tax, insurance and service dates on each, with the ones due within 30 days flagged.' },
  ],
  legal: {
    title: 'Director liability is personal',
    lead: 'Under the Health and Safety at Work etc. Act 1974, what protects the people running the business is being able to show that reasonably practicable steps were taken. That is an evidence question.',
    points: [
      {
        title: 'Section 37: consent, connivance or neglect',
        body: 'Section 37 of the Health and Safety at Work etc. Act 1974 makes a director, manager or similar officer personally liable where an offence was committed with their consent or connivance, or is attributable to their neglect. A dated, geotagged reporting trail, an approved risk assessment and a training matrix demonstrate the system; good intentions only describe it.',
        source: { name: 'Health and Safety at Work etc. Act 1974, section 37', url: 'https://www.legislation.gov.uk/ukpga/1974/37/section/37', checked: '25/09/2026' },
      },
      {
        title: 'Work at height: avoid, prevent, minimise',
        body: 'The Work at Height Regulations 2005 require work at height to be avoided where reasonably practicable, and otherwise planned, supervised and carried out by competent people with the right equipment. For a fitter that is the ladder decision, the roof-access assessment and the training record, and HSE’s guidance on the safe use of ladders and stepladders sets out when a ladder is the right choice.',
        source: { name: 'Work at Height Regulations 2005', url: 'https://www.legislation.gov.uk/uksi/2005/735/contents', checked: '25/09/2026' },
      },
      {
        title: 'Manual handling: the glass, the door, the stairs',
        body: 'The Manual Handling Operations Regulations 1992 require an employer to avoid hazardous manual handling where reasonably practicable and otherwise to assess and reduce the risk. Sealed units, composite doors and garage doors up a staircase are exactly that. Manual handling is one of jobsafe’s six assessment types, with its own template.',
        source: { name: 'Manual Handling Operations Regulations 1992', url: 'https://www.legislation.gov.uk/uksi/1992/2793/contents', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'A fracture, a cut needing hospital treatment or over seven days off, with the deadline.' },
    { label: '5×5 risk matrix calculator', href: '/tools/risk-matrix', why: 'Score a work-at-height hazard on the product’s scales and read the band.' },
  ],
  faqLead: 'Straight answers for installation businesses weighing up jobsafe.',
  faqs: [
    {
      q: 'Does jobsafe replace our risk assessments and method statements?',
      a: 'Risk assessments are a jobsafe module: six types including a roof-access template and manual handling, scored 5×5 with the hierarchy of control, approved before they go live and required before a permit issues, which is the suitable and sufficient assessment regulation 3 of the Management of Health and Safety at Work Regulations 1999 asks for. Method statements stay yours; they are controlled documents beside the assessment, with the current version in front of the crew. The RAMS a principal contractor asks for is the two together.',
    },
    {
      q: 'Can it handle multiple depots and subcontracted crews?',
      a: 'Yes. Sites and depots are first-class, so each depot sees its own picture and the business sees the whole one on the dashboard. Six role levels cover employed fitters and subcontracted crews through the same app, and every report carries who, where and when: section 3 of the Health and Safety at Work etc. Act 1974 makes your undertaking responsible for the risks to a subcontracted crew, whoever pays them. Pricing is per user per month, in pounds, with VAT shown.',
    },
    {
      q: 'A fitter fractures a wrist stepping off a ladder. Is it RIDDOR reportable?',
      a: 'Yes. A fracture other than to fingers, thumbs or toes is a specified injury under regulation 4 of the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 and is reported within 10 days. A cut that keeps a fitter off normal work for more than seven days is reported within 15. jobsafe works that out on the report and puts the deadline on the register; you submit to HSE.',
    },
    {
      q: 'What happens when there is no signal on site?',
      a: 'The report, the assessment and the documents save on the phone first and show “Pending sync” until signal returns, then sync on their own. Fitters capture incidents in basements, stairwells and new-build plots with no coverage without losing the record. The RIDDOR 2013 deadline still counts from the incident date, not the date the phone found signal, which is why the report carries the date it was written.',
    },
    {
      q: 'Can fitters attach photos and video from the job?',
      a: 'Yes. Photos, video and PDF documents, up to 50 MB each, go onto the report from the phone’s camera, with the site and the GPS captured at the time, and stay linked to the incident record. Every register exports to CSV, so the evidence goes to an insurer, a client or an auditor as a record, not a reconstruction, and the record regulation 12 of RIDDOR 2013 requires you to keep for three years is kept.',
    },
    {
      q: 'What does the Work at Height Regulations 2005 side look like for a fitter?',
      a: 'A work-at-height permit type with its required controls, a roof-access risk assessment template, and the training record for the people doing it on the competency matrix. A fall is triaged against RIDDOR like any other injury. jobsafe does not decide whether the ladder was the right choice; HSE’s guidance on ladders and stepladders does that, and the assessment records the decision.',
    },
    {
      q: 'We fit for domestic customers. Does CDM 2015 apply to us?',
      a: 'Yes. Under the Construction (Design and Management) Regulations 2015 a domestic client’s duties pass to the contractor, or to the principal contractor where there is more than one, so on a domestic job they are yours. jobsafe does not write the construction phase plan; it keeps the risk assessment, the method statement, the training record and the incident the plan relies on.',
    },
    {
      q: 'How long does it take to get set up?',
      a: 'No installation, no hardware and no IT involvement: jobsafe is an installable web app, so a fitter adds it to the home screen from the browser and it opens like an app, offline included. Book a demo and we show it on a fitting business’s setup, answer your questions and, if it fits, agree a start date.',
    },
  ],
  closing: {
    title: 'Be ready before you are asked.',
    copy: 'A 30-minute walkthrough of the report from the plot, the roof-access assessment and the van register, with someone who knows the product.',
  },
}
