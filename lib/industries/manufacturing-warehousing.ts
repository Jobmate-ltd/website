// Manufacturing and warehousing (Phase 3, new). Facts from HSE's
// manufacturing series; HSE files warehousing under transportation and
// storage, which the page says. Checked 25/09/2026. Not claimed: exposure
// monitoring, noise surveys, a maintenance system, telematics on MHE.

import type { IndustryContent } from './types.ts'

export const manufacturingWarehousing: IndustryContent = {
  path: '/industries/manufacturing-warehousing',
  name: 'Manufacturing and warehousing',
  placement: 'industry-manufacturing',
  eyebrow: 'For UK manufacturers, warehouses and distribution centres',
  lead: 'Lines, high bays, forklifts and the people walking between them. A near miss in aisle 12 reported from the truck before the shift ends. A guarding assessment scored 5×5 with the control that has an owner. The forklift’s thorough examination date on the register, and an isolation permit that will not issue until the risk assessment is live. Hosted in London, works offline at the far end of the shed.',
  hero: 'risk-matrix-desktop',
  factsLead: 'From HSE’s manufacturing series. HSE counts warehousing under transportation and storage, so the three figures here are manufacturing only.',
  facts: [
    {
      figure: '18',
      detail: 'workers killed in manufacturing in 2025/26, in a sector whose fatal injury rate HSE puts at around 1.5 to 2.5 times the all-industry average.',
      note: 'Provisional; HSE finalises the year in July 2027.',
      source: {
        name: 'HSE, Work-related fatal injuries in Great Britain',
        year: '2025/26',
        url: 'https://www.hse.gov.uk/statistics/fatals-overview.htm',
        checked: '25/09/2026',
        quote: 'Table “Fatal injuries to workers by main industry, 2025/26”: “Manufacturing 18”.',
      },
    },
    {
      figure: '8,853',
      detail: 'non-fatal injuries to manufacturing employees reported under RIDDOR in 2024/25. 2,463 of them, 28%, were specified injuries.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, Manufacturing statistics in Great Britain, 2025',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/manufacturing.pdf',
        checked: '25/09/2026',
        quote: '“There were 8,853 non-fatal injuries to employees reported by employers under RIDDOR in 2024/25p. 2,463 (28%) were specified injuries and 6,390 (72%) were injuries resulting in the incapacitation of a worker for over seven days”.',
      },
    },
    {
      figure: '1,107',
      detail: 'of those injuries were contact with moving machinery: 13% of the sector’s reported non-fatal injuries in 2024/25.',
      note: 'Provisional.',
      source: {
        name: 'HSE, RIDKIND: injuries reported under RIDDOR by kind of accident and industry, Table 2',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/ridkind.xlsx',
        checked: '25/09/2026',
        quote: 'Table 2, 2024/25p, Manufacturing, “Contact with moving machinery”: total number of reported non-fatal injuries to employees 1,107; share of the industry group’s injuries 0.13.',
      },
    },
  ],
  pains: [
    {
      pain: 'The guarding assessment for the press was done when the press was installed. The press has been modified twice since.',
      module: 'risk',
      outcome: 'A general assessment scored 5×5 with 16 hazard categories, controls tagged by the hierarchy of control with an owner, and an approval step before it goes live. A warning shows on any assessment that is not yet suitable and sufficient under regulation 3.',
    },
    {
      pain: 'The forklift clipped the racking in aisle 12. The driver mentioned it. Nobody wrote it down.',
      module: 'incidents',
      outcome: 'A near miss is one of four report categories, the seven-step form is on the driver’s phone offline, and the vehicle step takes the truck’s identifier. It is on the register with a number before the shift ends.',
    },
    {
      pain: 'Nobody can say which forklift is past its thorough examination without ringing the hire company.',
      module: 'fleet',
      outcome: 'Forklifts, MEWPs and plant sit on the register with their inspection, service and LOLER thorough examination dates. A date that has passed shows “do not use”; one due within 30 days is flagged.',
    },
    {
      pain: 'The contractor isolated the wrong line because the permit was a form in a tray.',
      module: 'permits',
      outcome: 'Electrical, hot works, confined space and three other permit types, each with its required controls, and a gate that will not issue until the contractor checks out and a live risk assessment is attached. The confirmed controls are stored on the permit with who confirmed them.',
    },
    {
      pain: 'For the high-hazard lines, the risk assessment says “controls in place” and nobody can name which one actually stops the event.',
      module: 'bowtie',
      outcome: 'The bowtie is a view inside the risk assessment: the threats, the top event, the consequences and the barriers on each leg, each rated effective, degraded, failed or missing. The barrier audit lists the legs with no barrier or a single one.',
    },
    {
      pain: 'The forklift licence expired in June. The driver is on the truck in September.',
      module: 'training',
      outcome: 'The competency matrix shows who holds which course and when it expires, flagged at 90 days. A critical course that has lapsed stops the work, and the gap raises an action.',
    },
  ],
  screens: [
    { id: 'risk-matrix-desktop', caption: 'The 5×5 worksheet: likelihood against severity on the product’s scales, the band and the action it calls for, with the controls tagged by hierarchy.' },
    { id: 'fleet-cards-desktop', caption: 'Plant and MHE as cards: the thorough examination, service and inspection dates on each forklift, with the ones due within 30 days flagged.' },
    { id: 'bowtie-audit-desktop', caption: 'The barrier audit on a high-hazard assessment: legs with no barrier or a single barrier, and every barrier rated degraded or failed, each able to raise an action.' },
  ],
  legal: {
    title: 'Machinery, lifting and the people between them',
    lead: 'Three regulations do most of the work on a factory floor. Each is a question about a record.',
    points: [
      {
        title: 'PUWER 1998: suitable, maintained, guarded',
        body: 'The Provision and Use of Work Equipment Regulations 1998 require work equipment to be suitable, maintained and inspected, with dangerous parts guarded and the people using it trained. In jobsafe the guarding assessment is a risk assessment with controls that have owners, the inspection and service dates sit on the plant register, and the training is on the matrix. jobsafe is not a maintenance system and does not schedule the work.',
        source: { name: 'Provision and Use of Work Equipment Regulations 1998', url: 'https://www.legislation.gov.uk/uksi/1998/2306/contents', checked: '25/09/2026' },
      },
      {
        title: 'LOLER 1998: the thorough examination',
        body: 'The Lifting Operations and Lifting Equipment Regulations 1998 require lifting equipment to be thoroughly examined at least every 12 months, or every six months where it lifts people, or to a written scheme. Forklifts, hoists and MEWPs carry that date on the register; a date that has passed shows “do not use”.',
        source: { name: 'Lifting Operations and Lifting Equipment Regulations 1998', url: 'https://www.legislation.gov.uk/uksi/1998/2307/contents', checked: '25/09/2026' },
      },
      {
        title: 'Workplace transport: the site, the vehicle, the driver',
        body: 'HSE’s workplace transport guidance is built on three questions: is the site laid out to separate vehicles and people, are the vehicles maintained, and are the drivers trained. jobsafe keeps the segregation assessment, the vehicle dates and the training record, and the near miss in aisle 12 that shows whether the controls held.',
        source: { name: 'HSE, Workplace transport', url: 'https://www.hse.gov.uk/workplacetransport/index.htm', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: '5×5 risk matrix calculator', href: '/tools/risk-matrix', why: 'Score a hazard on the product’s scales and read the band and the action.' },
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'A crush injury, a fracture or over seven days off, with the deadline.' },
  ],
  faqLead: 'Straight answers for plant managers, warehouse managers and the safety lead who covers both.',
  faqs: [
    {
      q: 'Does jobsafe track PUWER inspections and maintenance?',
      a: 'It keeps the dates and the assessment, not the maintenance plan. The Provision and Use of Work Equipment Regulations 1998 require equipment to be inspected and maintained; jobsafe holds the inspection and service dates on the plant register with a flag at 30 days, and the guarding assessment as a scored risk assessment with controls that have owners. It is not a CMMS and does not schedule maintenance jobs.',
    },
    {
      q: 'How does it handle forklift thorough examinations under LOLER 1998?',
      a: 'Each forklift, hoist or MEWP on the register carries its thorough examination date, which the Lifting Operations and Lifting Equipment Regulations 1998 require at least every 12 months, or six where the equipment lifts people. A date that has passed shows “do not use”; one due within 30 days is flagged. The report of thorough examination itself is a document you attach.',
    },
    {
      q: 'What does it do for workplace transport and pedestrian segregation?',
      a: 'It keeps the three records HSE’s workplace transport guidance is built on: the site assessment with its segregation controls, the vehicle register with the dates, and the driver’s training on the matrix. And it keeps the near misses, which are the evidence of whether the controls are holding. It does not track forklifts or fit proximity sensors.',
    },
    {
      q: 'Is a crush injury or an amputation RIDDOR reportable?',
      a: 'An amputation is a specified injury under regulation 4 of the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 and is reported within 10 days; so is a fracture other than to fingers, thumbs or toes, or a crush injury to the head or torso causing damage to the brain or internal organs. An injury that keeps someone off normal work for more than seven days is reported within 15 days. jobsafe’s triage works that out on the report; you submit to HSE.',
    },
    {
      q: 'What about noise and vibration?',
      a: 'A bespoke assessment type covers the risk assessment the Control of Noise at Work Regulations 2005 and the Control of Vibration at Work Regulations 2005 require, scored 5×5 with controls that have owners. jobsafe does not carry out noise surveys, measure vibration exposure or run health surveillance; it keeps the assessment and the actions.',
    },
    {
      q: 'Does COSHH cover the line, not just the cleaning cupboard?',
      a: 'Yes. COSHH is one of the six assessment types, with its own template, scored 5×5 and tagged by the hierarchy of control, so coolants, solvents, fumes and dusts each get an assessment under the Control of Substances Hazardous to Health Regulations 2002. Exposure monitoring stays with your occupational hygienist.',
    },
    {
      q: 'Contractors on the line: how does the permit gate treat them?',
      a: 'Before a permit issues, the gate checks the contractor is not suspended and that their insurance, RAMS, accreditation and last audit are in date, and that a live risk assessment is attached. If a check fails the permit is blocked and the gate says which one. An electrical permit carries the isolation controls the Electricity at Work Regulations 1989 expect. Adding new contractor records from inside the app is not available yet.',
    },
    {
      q: 'Does it work at the far end of the shed with no signal?',
      a: 'Yes, in every module. A report, a checklist, a permit or an assessment saves to the phone first and shows “Pending sync” until signal returns, then syncs on its own. A steel-clad high bay is the normal case here, not the edge case. The RIDDOR 2013 deadline still counts from the incident date, not the date the phone found signal, which is why the report carries the date it was written.',
    },
  ],
  closing: {
    title: 'See the 5×5 on your own line.',
    copy: 'A 30-minute walkthrough of the guarding assessment, the forklift register and the bowtie, with someone who knows the product.',
  },
}
