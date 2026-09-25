// Facilities management (Phase 3, new). HSE has no series labelled
// facilities management; the closest is "Admin/support services (N)", and
// one figure is all-industry. The page says which is which. Checked
// 25/09/2026.

import type { IndustryContent } from './types.ts'

export const facilitiesManagement: IndustryContent = {
  path: '/industries/facilities-management',
  name: 'Facilities management',
  placement: 'industry-facilities',
  eyebrow: 'For UK facilities, estates and property teams',
  lead: 'Occupied buildings, contractors you did not hire and a public that did not sign in. A visitor slips in the lobby and the report is on the register before the cleaner has finished the sign. A contractor’s hot-works permit will not issue until their insurance is in date. Every site has the current version of every procedure, and the estate shows on one dashboard. Hosted in London, works offline in the plant room.',
  hero: 'dashboard-desktop',
  factsLead: 'HSE publishes no facilities management series. The first two figures are its “Admin and support services” group, the sector most FM businesses sit in; the third is all industries.',
  facts: [
    {
      figure: '2,160',
      detail: 'self-reported non-fatal workplace injuries per 100,000 workers in admin and support services in 2024/25, against 1,780 across all industries.',
      note: 'Labour Force Survey rates; HSE industry group N.',
      source: {
        name: 'HSE, Industries: statistics by industry',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/industry/index.htm',
        checked: '25/09/2026',
        quote: 'Table “Rate of non-fatal workplace injuries by industry for people working in the last 12 months (per 100,000 workers)”: “Admin/support services (N) 2160” … “All industries 1780”.',
      },
    },
    {
      figure: '9',
      detail: 'workers killed in admin and support services in 2025/26, in a sector whose fatal injury rate HSE puts at around 1.5 to 2.5 times the all-industry average.',
      note: 'Provisional; HSE finalises the year in July 2027.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain',
        year: '2025/26',
        url: 'https://www.hse.gov.uk/statistics/fatals-overview.htm',
        checked: '25/09/2026',
        quote: 'Table “Fatal injuries to workers by main industry, 2025/26”: “Admin and support services 9”. Report: “The manufacturing, transportation and storage, and administration and support services sectors all have elevated rates compared to the average rate across all industries: around 1.5 to 2.5 times the average rate.”',
      },
    },
    {
      figure: '30%',
      detail: 'of employer-reported non-fatal injuries to employees in 2024/25 were slips, trips or falls on the same level: 18,051 reports, across all industries.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, Kind of accident statistics in Great Britain, 2025',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/kinds-of-accident.pdf',
        checked: '25/09/2026',
        quote: '“just two different accident kinds accounted for around a half of all employer reported non-fatal injuries to employees in 2024/25; slips, trips or falls on same level (30%) and injured while handling, lifting or carrying (17%).” RIDKIND Table 2, All industries, Slips, trips or falls on same level: 18,051.',
      },
    },
  ],
  pains: [
    {
      pain: 'A visitor slipped in the lobby, the receptionist wrote it in a book, and the book is in a drawer.',
      module: 'incidents',
      outcome: 'The seven-step report is on every phone: the site, the spot from the GPS, a photo of the floor, and the people involved, including a member of the public. It is on the register with a number the moment it syncs.',
    },
    {
      pain: 'The visitor went to hospital. Nobody in the building knows that makes it reportable.',
      module: 'riddor',
      outcome: 'The triage knows. A non-worker taken from the scene to hospital for treatment is reportable under RIDDOR, and the verdict says so on the report with the deadline worked out from the date. You submit to HSE; jobsafe keeps the reference.',
    },
    {
      pain: 'The roofing contractor started hot works on the fourth floor with a permit signed on a clipboard by someone who had not checked their insurance.',
      module: 'permits',
      outcome: 'Six permit types, each with its required controls, and a gate that will not issue until the contractor’s insurance, RAMS, accreditation and audit are in date and a live risk assessment is attached. Blocked is worked out for you, with the reason shown.',
    },
    {
      pain: 'Each site has its own copy of the procedures, and no two are the same version.',
      module: 'documents',
      outcome: 'One folder tree with access levels for the whole estate. A new version uploaded under the same name replaces the old one, so no site is reading last year’s copy.',
    },
    {
      pain: 'Forty buildings, one safety lead, and the picture arrives in a monthly spreadsheet.',
      module: 'dashboards',
      outcome: 'The four KPIs, a live incident feed, hotspots by site and a 12-week trend on one screen, with a site filter that follows you across the app.',
    },
    {
      pain: 'The actions from the last audit were agreed in a meeting and belong to nobody.',
      module: 'actions',
      outcome: 'One register for every action from every module, each with an owner, a due date and a status. Overdue is worked out from the date and owners see it in the in-app bell.',
    },
  ],
  screens: [
    { id: 'permits-gate-desktop', caption: 'The permit gate: a contractor’s hot-works permit blocked because their insurance has lapsed, with the reason shown and the risk assessment it needs.' },
    { id: 'documents-tree-desktop', caption: 'Document control across the estate: the folder tree with access levels and the current version of each procedure, replaced in place under the same name.' },
    { id: 'dashboard-trend-desktop', caption: 'The 12-week trend and hotspots by site: which buildings the reports cluster in, and whether the number is moving.' },
  ],
  legal: {
    title: 'Duties to people who are not yours',
    lead: 'Facilities work is defined by other people’s presence: tenants, visitors, contractors. The law reflects that, and so must the record.',
    points: [
      {
        title: 'Section 3: the public and the tenants',
        body: 'Section 3 of the Health and Safety at Work etc. Act 1974 places a duty on every employer to conduct its undertaking so that people who are not its employees are not exposed to risks to their health or safety. In an occupied building that means tenants, visitors and the public. The incident report with a non-worker on it, and the action that fixed the floor, are how that duty is shown.',
        source: { name: 'Health and Safety at Work etc. Act 1974, section 3', url: 'https://www.legislation.gov.uk/ukpga/1974/37/section/3', checked: '25/09/2026' },
      },
      {
        title: 'The fire risk assessment is yours',
        body: 'The Regulatory Reform (Fire Safety) Order 2005 makes the responsible person for a building carry out and keep a fire risk assessment and act on it. Fire is one of jobsafe’s six assessment types, with its own template, and hot works is a permit type that checks its controls before issue. jobsafe is not a fire alarm system and does not test one.',
        source: { name: 'Regulatory Reform (Fire Safety) Order 2005', url: 'https://www.legislation.gov.uk/uksi/2005/1541/contents', checked: '25/09/2026' },
      },
      {
        title: 'The fine is set by turnover',
        body: 'Since 1 February 2016 the Sentencing Council guideline has set the starting point for a health and safety fine by the organisation’s turnover, with “large” meaning £50 million and over, and weighed the harm risked as well as the harm caused. The offence range runs to £10 million. For an FM contract on thin margins, a turnover-based fine is a different kind of number.',
        source: { name: 'Sentencing Council, Health and Safety Offences guideline (organisations)', url: 'https://www.sentencingcouncil.org.uk/offences/magistrates-court/item/organisations-breach-of-duty-of-employer-towards-employees-and-non-employees-breach-of-duty-of-self-employed-to-others-breach-of-health-and-safety-regulations/', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'Including the non-worker taken to hospital, one question at a time.' },
    { label: 'Accident frequency rate calculator', href: '/tools/accident-frequency-rate', why: 'The figure a client’s tender asks for, with the working shown.' },
  ],
  faqLead: 'Straight answers for the people responsible for buildings full of other people.',
  faqs: [
    {
      q: 'A member of the public is hurt in one of our buildings. Is it RIDDOR reportable?',
      a: 'If they are taken from the scene to hospital for treatment, yes: an injury to a person who is not at work that arises out of or in connection with work is reportable under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 when they go straight to hospital. The responsible person is the person in control of the premises. jobsafe’s triage asks that question and puts the deadline on the report; you submit to HSE.',
    },
    {
      q: 'Does jobsafe do fire risk assessments under the Regulatory Reform (Fire Safety) Order 2005?',
      a: 'Fire is one of the six assessment types, with its own template, scored 5×5 with controls tagged by the hierarchy of control and an approval step, so the assessment the responsible person must keep is kept on the record. jobsafe is not a fire alarm, emergency lighting or extinguisher testing system, and does not replace a competent fire risk assessor where one is needed.',
    },
    {
      q: 'Can it hold the LOLER dates for passenger lifts and hoists?',
      a: 'Yes. Lifts that carry people need a thorough examination at least every six months under the Lifting Operations and Lifting Equipment Regulations 1998, and other lifting equipment at least every 12 months or to a written scheme. The plant register holds that date beside the service and inspection dates; a date that has passed shows “do not use” and one due within 30 days is flagged.',
    },
    {
      q: 'What about legionella?',
      a: 'The written scheme and the risk assessment the Approved Code of Practice L8 asks for live in jobsafe as a bespoke assessment type and as controlled documents with a current version, and the monitoring tasks that fall out of them can be actions with owners and dates. jobsafe is not a water hygiene system and does not log temperatures for you.',
    },
    {
      q: 'Does it help with the duty to manage asbestos?',
      a: 'It keeps the records. Regulation 4 of the Control of Asbestos Regulations 2012 requires the dutyholder to find out whether asbestos is present, keep a record and manage the risk. The survey and the management plan are controlled documents in jobsafe, with the current version in front of the people who need it, and any work near it is a permit and a risk assessment. jobsafe is not an asbestos register product.',
    },
    {
      q: 'Contractors we did not hire work in our buildings. How does the permit gate treat them?',
      a: 'The same as anyone else, and the Construction (Design and Management) Regulations 2015 apply to maintenance and refurbishment work in an occupied building just as they do to a site. Before a permit issues, the gate checks the contractor is not suspended and that their insurance, RAMS, accreditation and last audit are in date, and that a live risk assessment is attached. If a check fails the permit is blocked and the gate says which one. Adding new contractor records from inside the app is not available yet.',
    },
    {
      q: 'We run forty buildings with one safety lead. How does multi-site work?',
      a: 'Sites are first-class in jobsafe: every report, assessment, permit and asset belongs to one, the dashboard shows hotspots by site, and a site filter follows you across the app. Six role levels let a building manager see their building and the safety lead see the estate, which matters when each building has its own responsible person under the Regulatory Reform (Fire Safety) Order 2005.',
    },
    {
      q: 'What about COSHH for cleaning chemicals?',
      a: 'COSHH is one of the six assessment types, with its own template, scored 5×5 and tagged by the hierarchy of control, so the products your cleaning teams use get an assessment under the Control of Substances Hazardous to Health Regulations 2002 and the current one is on the phone with the job.',
    },
  ],
  closing: {
    title: 'See the whole estate on one screen.',
    copy: 'A 30-minute walkthrough of the permit gate, the incident report with a member of the public on it and the dashboard, with someone who knows the product.',
  },
}
