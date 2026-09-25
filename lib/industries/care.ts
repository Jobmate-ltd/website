// Care homes and home care (Phase 3 rebuild of /industries/healthcare).
// Staff safety only: jobsafe is not a clinical or resident-safety system
// and the page says so first. CQC Regulation 17 is cited as the duty to
// keep records about staff and the management of the service, which a
// staff-incident record evidences. HSE's series is "Human health and social
// work activities", which includes hospitals; the page says so. Checked
// 25/09/2026.

import type { IndustryContent } from './types.ts'

export const care: IndustryContent = {
  path: '/industries/healthcare',
  name: 'Care homes and home care',
  placement: 'industry-care',
  eyebrow: 'For UK care homes, home care and supported living providers',
  lead: 'Hoists and transfers, sharps, wet floors, aggression, and staff working alone in other people’s homes at seven in the morning. jobsafe is the record of what happens to your staff: the assault on a night shift reported before the shift ends, the moving and handling assessment on the carer’s phone, the training matrix that shows whose refresher has lapsed. It is not a resident or patient safety system, and it says so. Hosted in London, works offline in a flat with no signal.',
  hero: 'reports-register-desktop',
  factsLead: 'From HSE’s human health and social work series, which covers residential care, home care and hospitals. All three figures are about staff, not the people they care for.',
  facts: [
    {
      figure: '255,000',
      detail: 'workers in human health and social work suffering from work-related ill health each year, averaged over 2022/23 to 2024/25. 52% of it is stress, depression or anxiety.',
      note: 'Labour Force Survey estimate, new and long-standing cases.',
      source: {
        name: 'HSE, Human health and social work activities statistics in Great Britain, 2025',
        year: '2022/23 to 2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/health.pdf',
        checked: '25/09/2026',
        quote: '“255,000 workers suffering from work-related ill health (new or long-standing) averaged over the three-year period 2022/23-2024/25.” … “52% were stress, depression or anxiety.”',
      },
    },
    {
      figure: '29%',
      detail: 'of employer-reported non-fatal injuries to staff in human health and social work in 2024/25 were acts of violence, the most common kind in the sector, against 10% across all industries. 3,211 reports.',
      note: 'Provisional. HSE estimates employers report around half of the non-fatal injuries RIDDOR defines.',
      source: {
        name: 'HSE, Kind of accident statistics in Great Britain, 2025',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/kinds-of-accident.pdf',
        checked: '25/09/2026',
        quote: '“The most common accident kind in these two sectors was acts of violence, accounting for 29% and 25% of all employer reported non-fatal injuries in 2024/25 respectively (compared to 10% overall).” RIDKIND Table 2, Human health and social work activities, Acts of violence: 3,211.',
      },
    },
    {
      figure: '2,125',
      detail: 'staff injured while handling, lifting or carrying in human health and social work in 2024/25: 19% of the sector’s 11,157 reported non-fatal injuries.',
      note: 'Provisional.',
      source: {
        name: 'HSE, RIDKIND: injuries reported under RIDDOR by kind of accident and industry, Table 2',
        year: '2024/25',
        url: 'https://www.hse.gov.uk/statistics/assets/docs/ridkind.xlsx',
        checked: '25/09/2026',
        quote: 'Table 2, 2024/25p, Human health and social work activities, “Injured while handling, lifting or carrying”: 2,125; share 0.19. Sector total from health.pdf: “There were 11,157 non-fatal injuries to employees reported by employers under RIDDOR in 2024/25p.”',
      },
    },
  ],
  pains: [
    {
      pain: 'A carer was hit on the night shift. The write-up happened three days later, from a handover note.',
      module: 'incidents',
      outcome: 'The seven-step report is on the phone on the shift: the home or the visit address, the time, the people involved, a photo if there is one. It is on the register with a number before the shift ends, offline included.',
    },
    {
      pain: 'The carer was off for two weeks with a back injury from a transfer. Nobody is sure that counts.',
      module: 'riddor',
      outcome: 'It does. An injury from work that keeps someone off normal work for more than seven days is reportable, and an injury from an assault at work is too. The triage works that out on the report, with the 15 or 10-day deadline from the incident date. You submit to HSE; jobsafe keeps the reference.',
    },
    {
      pain: 'The moving and handling assessment is a form in the office. The transfer happens in a bedroom.',
      module: 'risk',
      outcome: 'Manual handling is one of six assessment types, with its own template, scored 5×5 with controls tagged by the hierarchy of control and an approval step, on the carer’s phone where the transfer happens.',
    },
    {
      pain: 'Refreshers expire on different dates for forty staff, and the matrix is a spreadsheet the manager updates when there is time.',
      module: 'training',
      outcome: 'The competency matrix shows who is in date for moving and handling, first aid and the rest, with expiries flagged at 90 days. A critical course that has lapsed stops the work, and a gap raises an action.',
    },
    {
      pain: 'Three homes, three versions of the lone working procedure.',
      module: 'documents',
      outcome: 'One folder tree with access levels for the provider. A new version uploaded under the same name replaces the old one, and the current version is what the carer opens on the phone.',
    },
    {
      pain: 'The actions from the last inspection were agreed in a meeting and belong to nobody.',
      module: 'actions',
      outcome: 'One register for every action from every module, each with an owner, a due date and a status. Overdue is worked out from the date and owners see it in the in-app bell.',
    },
  ],
  screens: [
    { id: 'report-new-evidence-phone', caption: 'The report on the phone during a visit: the address, the time and the evidence, saved to the device until there is a signal.' },
    { id: 'training-matrix-desktop', caption: 'The competency matrix: who is in date for moving and handling, first aid and medication, what expires within 90 days, and the critical courses that stop work.' },
    { id: 'actions-list-desktop', caption: 'The actions register: every action from reports, assessments and training gaps, each with an owner, a due date and whether it is overdue.' },
  ],
  legal: {
    title: 'Good governance is an evidence test',
    lead: 'Regulation 17 asks for records. The Health and Safety at Work etc. Act asks for the same thing about your staff. Both are answered by what you can show.',
    points: [
      {
        title: 'CQC Regulation 17: records about staff and the service',
        body: 'Regulation 17 of the Health and Social Care Act 2008 (Regulated Activities) Regulations 2014 requires providers to keep securely such records as are necessary about the people employed in the regulated activity and about its management. A dated, complete record of what happened to staff and what was done about it is the evidence that staff incidents are managed. This is the England wording; the Care Inspectorate, Care Inspectorate Wales and RQIA ask the same question in their own.',
        source: { name: 'CQC, Regulation 17: Good governance', url: 'https://www.cqc.org.uk/guidance-providers/regulations/regulation-17-good-governance', checked: '25/09/2026' },
      },
      {
        title: 'Moving and handling: assess, reduce, record',
        body: 'The Manual Handling Operations Regulations 1992 require an employer to avoid hazardous manual handling where reasonably practicable and otherwise to assess and reduce the risk. In care that is every hoist, transfer and bed change. The assessment with its controls and the training record for the people doing it are the record of the duty.',
        source: { name: 'Manual Handling Operations Regulations 1992', url: 'https://www.legislation.gov.uk/uksi/1992/2793/contents', checked: '25/09/2026' },
      },
      {
        title: 'Violence at work is reportable',
        body: 'An injury to a member of staff from physical violence arising out of their work is reportable under regulation 4 of the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 in the same way as any other injury: a specified injury within 10 days, more than seven days off within 15. HSE’s guidance on violence at work asks employers to record incidents and act on the pattern.',
        source: { name: 'HSE, Work-related violence', url: 'https://www.hse.gov.uk/violence/index.htm', checked: '25/09/2026' },
      },
    ],
  },
  tools: [
    { label: 'Is it RIDDOR reportable?', href: '/tools/riddor-checker', why: 'An assault, a back injury or more than seven days off, with the deadline.' },
    { label: '5×5 risk matrix calculator', href: '/tools/risk-matrix', why: 'Score a moving and handling hazard on the product’s scales.' },
  ],
  faqLead: 'Straight answers for registered managers, nominated individuals and the people who cover the rota.',
  faqs: [
    {
      q: 'Is jobsafe a clinical or resident safety system?',
      a: 'No, and it does not pretend to be. jobsafe is the workplace health and safety record for your staff: the incidents, near misses and hazards affecting the people doing the work. Resident and patient safety records stay in your care planning and clinical governance systems, which CQC inspects under its own regulations, and jobsafe does not submit anything to national patient safety services. What it gives you is a dated, evidenced record of what happened to your staff and what was done about it.',
    },
    {
      q: 'How does this help with CQC Regulation 17?',
      a: 'Regulation 17 requires records to be kept securely about the people you employ and about the management of the regulated activity, and it asks providers to assess, monitor and mitigate risks to health and safety. A staff-incident record with the report, the RIDDOR decision, the investigation, the actions and the training that followed is that evidence, in order and exportable, when an inspector asks how staff incidents are managed.',
    },
    {
      q: 'Is an assault on a carer RIDDOR reportable?',
      a: 'It can be. An injury to a member of staff from physical violence that arises out of their work is treated under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 like any other injury: a specified injury such as a fracture is reported within 10 days, and an injury that keeps them off normal work for more than seven days within 15. jobsafe’s triage asks the questions on the report and puts the deadline on the register; you submit to HSE.',
    },
    {
      q: 'Does it work in a service user’s home, a lift or a basement with no signal?',
      a: 'Yes, in every module. A report, an assessment or a document opens and saves on the phone first and shows “Pending sync” until signal returns, then syncs on its own. Community and domiciliary staff capture incidents in flats, lifts and rural properties with no coverage without losing the record. The RIDDOR 2013 deadline still counts from the incident date, not the date the phone found signal, which is why the report carries the date it was written.',
    },
    {
      q: 'What does it do for moving and handling under the Manual Handling Operations Regulations 1992?',
      a: 'Manual handling is one of six assessment types, with its own template, scored 5×5 with controls tagged by the hierarchy of control and an approval step, so each hoist, transfer and bed change has an assessment on the carer’s phone. The training record for moving and handling sits on the competency matrix with its expiry, and a lapsed critical course stops the work.',
    },
    {
      q: 'Is jobsafe a lone-worker alarm for home visits?',
      a: 'No. It does not monitor a carer’s location, does not have a panic button that reaches a control room, and does not raise an alarm. What it gives a lone carer is the report, the assessment and the procedure on the phone, offline, and the record of what happened. If the lone working assessment HSE’s guidance asks for needs a monitored alarm, that is a separate service bought alongside.',
    },
    {
      q: 'Is it safe to attach photos in a care setting?',
      a: 'The data is hosted in the London region with each organisation walled off and private file storage, handled under UK GDPR and the Data Protection Act 2018, and what goes into a report remains your policy. For most staff incidents the evidence that matters is the hazard rather than the person: the wet floor, the failed sling, the damaged bed rail. Tell staff to record it that way, and the record answers the question without becoming a problem of its own.',
    },
    {
      q: 'Can it handle several homes, branches and agency staff?',
      a: 'Yes. Sites are first-class, so each home or branch that CQC registers as a location sees its own picture and the provider sees the whole one on the dashboard. Six role levels cover employed, bank and agency staff through the same app, and every report carries who, where and when. Pricing is per user per month, in pounds, with VAT shown.',
    },
  ],
  closing: {
    title: 'Evidence, not recollection.',
    copy: 'A 30-minute walkthrough of the staff incident record, the moving and handling assessment and the training matrix, with someone who knows the product.',
  },
}
