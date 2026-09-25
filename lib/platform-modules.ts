// ─────────────────────────────────────────────────────────────────────────────
// Module page content. One typed object per module page; the template in
// components/platform/module-page.tsx renders whatever is here, so Phase 3
// adds a module by adding an object. Every fact below comes from the product
// code as listed in the Phase 2 brief. Nothing under `doNotClaim` is ever
// rendered; it is the list of things the product does not do yet, kept next
// to the copy so nobody adds them by accident.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductImageId } from './product-images.ts'
import type { IconName, ModuleId } from './platform.ts'

export interface ModuleFeature {
  readonly title: string
  readonly lead: string
  readonly points: readonly { readonly icon: IconName; readonly title: string; readonly detail: string }[]
  readonly screenshot: ProductImageId
}

export interface ModulePage {
  readonly id: ModuleId
  readonly path: string
  /** The display line under the H1. */
  readonly display: string
  readonly lead: string
  readonly hero: ProductImageId
  readonly proof: readonly string[]
  readonly pains: readonly { readonly pain: string; readonly outcome: string }[]
  readonly features: readonly ModuleFeature[]
  readonly connected: readonly ModuleId[]
  readonly regulation: { readonly title: string; readonly paragraphs: readonly string[] }
  readonly faqs: readonly { readonly q: string; readonly a: string }[]
  /** Not rendered. What the product does not do yet. */
  readonly doNotClaim: readonly string[]
}

export const MODULE_PAGES: readonly ModulePage[] = [
  {
    id: 'incidents',
    path: '/platform/incident-reporting',
    display: 'The report a driver can finish in the cab.',
    lead: 'Incident reporting software that takes a report in seven steps from any phone, with photos, GPS, the people involved, the vehicle and RIDDOR triage, and works without signal. The register, the investigation and the actions live on the same record, hosted in the UK.',
    hero: 'reports-register-desktop',
    proof: ['Works offline', 'Seven-step report', 'Photo, video and PDF evidence', 'RIDDOR triage built in', 'CSV export'],
    pains: [
      { pain: 'Near misses go unreported because the form lives in the office.', outcome: 'A near miss is one of four report categories and the form is on every phone, offline included, so it gets written down where it happened.' },
      { pain: 'By the time the investigator reads it, the photo is on someone else’s phone and the plate is wrong.', outcome: 'Evidence is captured into the report from the camera, and the vehicle step takes the registration, model, mileage and last inspection at the time.' },
      { pain: 'Nobody can say which reports are open, waiting for sign-off or heading for RIDDOR.', outcome: 'Four saved views on the register answer that in one click, and every report carries a status gated by role.' },
    ],
    features: [
      {
        title: 'Seven steps, and the draft saves itself',
        lead: 'Details, site and location with GPS capture, people involved, vehicle or asset, evidence, RIDDOR triage, review. Each step is short enough for a phone in a yard; the draft autosaves on the device as you go.',
        points: [
          { icon: 'map-pin', title: 'Site and location', detail: 'The site from your list, the spot from the phone’s GPS.' },
          { icon: 'users', title: 'People involved', detail: 'Injured, witness, first aider or involved, with the employee ID.' },
          { icon: 'camera', title: 'Evidence from the camera', detail: 'Photo, video or PDF up to 50 MB each, straight from the phone.' },
        ],
        screenshot: 'report-new-evidence-phone',
      },
      {
        title: 'A register that already knows what you want to see',
        lead: 'Search, a date range and filters, plus four saved views: “My open”, “Awaiting my sign-off”, “RIDDOR pending” and “This week’s high-severity”. Bulk assign, start an investigation, close, or export the lot to CSV.',
        points: [
          { icon: 'list-checks', title: 'Four categories, three severities', detail: 'HSSE, near miss, incident or other; high, medium or low; numbered like 26-014.' },
          { icon: 'check', title: 'Bulk actions', detail: 'Assign, start an investigation or close several reports at once.' },
          { icon: 'download', title: 'CSV export', detail: 'Every register exports; nothing you record is locked in.' },
        ],
        screenshot: 'reports-register-desktop',
      },
      {
        title: 'The detail page is the investigation',
        lead: 'The evidence gallery, the people, the vehicle card with its UK number plate, a four-level ICAM root cause, the linked actions, similar past reports, a timeline and comments, all on the one record. Open → Investigating → Awaiting sign-off → Closed, each step gated by role.',
        points: [
          { icon: 'search', title: 'Four-level ICAM', detail: 'Absent or failed defences, individual and team actions, task and environmental conditions, organisational factors.' },
          { icon: 'circle-check', title: 'Linked actions', detail: 'Actions raised from the findings sit on the report and on the board.' },
          { icon: 'clock', title: 'Timeline and comments', detail: 'Who did what, when, with the discussion beside it.' },
        ],
        screenshot: 'report-detail-desktop',
      },
    ],
    connected: ['riddor', 'investigations', 'actions', 'risk'],
    regulation: {
      title: 'What the law asks of an incident record',
      paragraphs: [
        'The Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 require certain incidents to be reported to HSE and records to be kept for three years. The Social Security (Claims and Payments) Regulations 1979 require an accident book (BI 510) where ten or more people are employed.',
        'jobsafe keeps the record: what happened, where, to whom, the evidence and the investigation, with the RIDDOR triage on the report. It does not submit anything to HSE; the RIDDOR module tells you whether and by when, and you submit.',
      ],
    },
    faqs: [
      { q: 'What tool should be used for reporting incidents?', a: 'One that is on the phone of the person who saw it, works without signal, captures the evidence at the time and puts the report in front of the person who has to act. A paper form or an office spreadsheet fails the first three. jobsafe’s seven-step report is built for exactly that, and the register and investigation are on the same record.' },
      { q: 'Does it work without signal?', a: 'Yes. The draft autosaves on the phone and the report shows “Pending sync” until signal returns; then it syncs on its own.' },
      { q: 'What can be attached?', a: 'Photos, video and PDFs, up to 50 MB each, straight from the phone’s camera or files. They stay on the report in an evidence gallery.' },
      { q: 'Who can close a report?', a: 'The lifecycle is Open → Investigating → Awaiting sign-off → Closed, and each step is gated by role level, so a report is signed off by someone allowed to sign it off.' },
      { q: 'Can we get the data out?', a: 'Yes. The register exports to CSV with the filters you have applied. A report prints to PDF from the browser.' },
      { q: 'How do near misses fit in?', a: 'Near miss is one of the four categories, alongside HSSE, incident and other, with the same seven steps, so a near miss is as easy to record as an injury.' },
    ],
    doNotClaim: ['voice notes', 'push or email alerts', 'a real map', 'generated PDFs (it prints to PDF from the browser)'],
  },
  {
    id: 'riddor',
    path: '/platform/riddor',
    display: 'Whether it is reportable, and by when, before you have finished typing.',
    lead: 'RIDDOR reporting software with a seven-step statutory form and a live verdict panel: work-related or not, the Reg 4 specified injuries, over-7-day incapacitation, Schedule 2 dangerous occurrences, occupational diseases, gas incidents and injuries to people not at work, with the deadline worked out from the incident date. You submit to HSE; jobsafe keeps the record and the reference.',
    hero: 'riddor-verdict-desktop',
    proof: ['RIDDOR 2013 Reg 4 and Schedule 2', 'Deadlines from the incident date', 'Over-7-day rule applied correctly', 'F2508 register', 'Accident book declaration'],
    pains: [
      { pain: 'Somebody has to remember that the day of the accident does not count and weekends do.', outcome: 'The over-7-day triage excludes the day of the accident and includes weekends, and puts the resulting deadline on the register.' },
      { pain: 'The 10-day and 15-day clocks start on the incident, not on the day someone gets round to it.', outcome: 'Every deadline is computed from the incident date the moment triage returns a verdict.' },
      { pain: 'Six months later nobody can find what was submitted, or the reference HSE sent back.', outcome: 'The register holds the submission, its reference, the status and the accident book declaration.' },
    ],
    features: [
      {
        title: 'The verdict updates as you answer',
        lead: 'Was it work-related? On a public road, or a private one? Then the Reg 4 specified injuries, over-7-day incapacitation, Schedule 2 dangerous occurrences, occupational diseases, gas incidents and injuries to people not at work. The panel says reportable or not, and which route.',
        points: [
          { icon: 'gavel', title: 'Reg 4 specified injuries', detail: 'Fractures, amputations, loss of sight, crush injuries, burns, scalping, loss of consciousness and the rest.' },
          { icon: 'timer', title: 'Over-7-day incapacitation', detail: 'Day of the accident excluded, weekends included.' },
          { icon: 'shield-alert', title: 'Schedule 2 dangerous occurrences', detail: 'Reportable even when nobody was hurt.' },
        ],
        screenshot: 'riddor-verdict-desktop',
      },
      {
        title: 'Deadlines you do not have to look up',
        lead: 'Deaths and specified injuries: notify without delay by telephone to the HSE Incident Contact Centre on 0345 300 9923, then the form within 10 days. Over-7-day: within 15 days. Non-workers and dangerous occurrences: within 10 days. Diseases: within 10 days of diagnosis. Gas: within 14 days.',
        points: [
          { icon: 'clock', title: 'Computed from the incident date', detail: 'Not from the day someone opened the form.' },
          { icon: 'layout-dashboard', title: 'Due dates on the dashboard', detail: 'RIDDOR due sits beside open incidents and overdue actions.' },
          { icon: 'check', title: 'Awaiting diagnosis', detail: 'A status for the cases where the clock has not started yet.' },
        ],
        screenshot: 'dashboard-desktop',
      },
      {
        title: 'A register of what must be kept',
        lead: 'Due, Submitted, Awaiting diagnosis, Assessed not reportable. The register records the statutory particulars, the submission and the reference HSE returns, and the accident book (BI 510) declaration.',
        points: [
          { icon: 'clipboard-list', title: 'Started from the report', detail: 'Answering “Yes” at RIDDOR triage on an incident opens the RIDDOR record.' },
          { icon: 'folder-open', title: 'Kept for the inspector', detail: 'Three years of records, searchable, exportable to CSV.' },
          { icon: 'lock', title: 'You submit, jobsafe records', detail: 'The reference and the date of submission go on the record.' },
        ],
        screenshot: 'reports-register-desktop',
      },
    ],
    connected: ['incidents', 'investigations', 'actions', 'dashboards'],
    regulation: {
      title: 'RIDDOR 2013, precisely',
      paragraphs: [
        'The Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013 place the duty to report on the responsible person: the employer, a self-employed person, or the person in control of the premises. Reports are made to HSE online, or by telephone for fatal and specified injuries.',
        'jobsafe records the submission and its reference; it does not file with HSE. The customer submits. The accident book declaration under the Social Security (Claims and Payments) Regulations 1979 is recorded on the same register.',
      ],
    },
    faqs: [
      { q: 'Does jobsafe file RIDDOR with HSE for us?', a: 'No. It tells you whether an incident is reportable, which route it takes and by when, and it keeps the statutory record and the reference you get back. You make the submission to HSE.' },
      { q: 'What counts as over-7-day incapacitation?', a: 'A worker unable to do their normal duties for more than seven consecutive days, not counting the day of the accident but including weekends and rest days. jobsafe applies that rule for you and sets the 15-day deadline.' },
      { q: 'What are the RIDDOR reporting timescales?', a: 'Deaths and specified injuries: notify without delay by telephone, then the form within 10 days. Over-7-day incapacitation: within 15 days. Injuries to people not at work and dangerous occurrences: within 10 days. Occupational diseases: within 10 days of the diagnosis. Gas incidents: within 14 days.' },
      { q: 'Is the F2508 form built in?', a: 'The statutory particulars that go on an F2508 are collected in the seven-step form, and the register keeps what must be kept. The submission itself is made on HSE’s online form.' },
      { q: 'What about the accident book?', a: 'The register records the accident book (BI 510) declaration alongside the RIDDOR status, so the two records agree.' },
    ],
    doNotClaim: ['filing RIDDOR with HSE', 'push or email reminders'],
  },
  {
    id: 'risk',
    path: '/platform/risk-assessments',
    display: 'Scored on a 5×5, controlled by hierarchy, approved before it goes live.',
    lead: 'Risk assessment software with six types (general, COSHH, fire, DSE, manual handling and bespoke), 5×5 likelihood × severity scoring with named bands, 16 hazard categories, 10 at-risk groups, controls tagged by hierarchy of control with an owner and a due date, a “suitable and sufficient” check under MHSWR 1999 reg 3, and a bowtie view for the risks that deserve one.',
    hero: 'risk-matrix-desktop',
    proof: ['5×5 scoring with named bands', 'Six assessment types', 'Hierarchy of control', 'MHSWR reg 3 suitability check', 'Bowtie analysis'],
    pains: [
      { pain: 'A risk assessment written for the audit, not the job, sits in a folder unread.', outcome: 'Eight templates start you from the real work (forklift operations, yard traffic segregation, manual handling, roof access, COSHH drum wash, fire, lone working night trunking, DSE), and the lifecycle puts a review date on it.' },
      { pain: 'Controls are listed, but nobody owns them and nobody knows if they are “existing” or “planned”.', outcome: 'Existing and further controls are tagged by hierarchy of control from Eliminate to PPE, each with an owner and a due date, and further controls raise actions.' },
      { pain: 'An inspector asks whether the assessment is suitable and sufficient. Nobody is sure.', outcome: 'The suitability check warns when an assessment is not yet suitable and sufficient under MHSWR 1999 reg 3, before it can be approved.' },
    ],
    features: [
      {
        title: 'The worksheet: hazards, people, controls, score',
        lead: '16 hazard categories and 10 at-risk groups, including young persons, new and expectant mothers, and lone workers. Likelihood × severity on a 5×5: Low 1–4 “broadly acceptable”, Medium 5–9 “reduce where reasonably practicable”, High 10–16 “must be reduced” with a 30-day deadline, Extreme 17–25 “STOP the activity”.',
        points: [
          { icon: 'shield-alert', title: 'Hierarchy of control', detail: 'Eliminate, substitute, engineering, administrative, PPE, on every control.' },
          { icon: 'users', title: 'At-risk groups', detail: 'Ten groups, so the young person and the lone worker are not an afterthought.' },
          { icon: 'circle-check', title: 'Actions from hazards', detail: 'A further control becomes an action with an owner and a date.' },
        ],
        screenshot: 'risk-register-desktop',
      },
      {
        title: 'Draft, approve, live, review',
        lead: 'Draft → Awaiting approval → Live → Review overdue. Only a Live assessment can support a permit, and a High score sets a 30-day deadline to bring it down.',
        points: [
          { icon: 'check', title: 'Approval before live', detail: 'The suitability check runs before the approver sees it.' },
          { icon: 'clock', title: 'Review overdue', detail: 'The register shows what has lapsed, so the review date means something.' },
          { icon: 'file-badge', title: 'Feeds the permit gate', detail: 'Permits to work require a Live supporting risk assessment.' },
        ],
        screenshot: 'risk-matrix-desktop',
      },
      {
        title: 'Bowtie, for the risks that can kill',
        lead: 'Threats on the left, consequences on the right, barriers between. Barrier types: passive hardware, active hardware, hardware plus human, human procedural, continuous. Effectiveness: Effective, Degraded, Failed or Missing. Escalation factors on any barrier. A computed score you can adopt into the worksheet, and a barrier audit that flags a leg with a single barrier.',
        points: [
          { icon: 'scale', title: 'Barrier effectiveness', detail: 'Effective, Degraded, Failed or Missing, for each barrier.' },
          { icon: 'search', title: 'Barrier audit', detail: 'Any threat or consequence leg protected by one barrier is flagged.' },
          { icon: 'refresh-cw', title: 'Adopt the score', detail: 'The bowtie’s computed score can replace the worksheet’s.' },
        ],
        screenshot: 'risk-bowtie-desktop',
      },
    ],
    connected: ['permits', 'actions', 'incidents', 'training'],
    regulation: {
      title: 'MHSWR 1999 reg 3 and the rest',
      paragraphs: [
        'Regulation 3 of the Management of Health and Safety at Work Regulations 1999 requires every employer to make a suitable and sufficient assessment of the risks to employees and to others affected by the work, and to record the significant findings where five or more people are employed. COSHH 2002, the Regulatory Reform (Fire Safety) Order 2005 and the DSE Regulations 1992 each call for their own assessment.',
        'jobsafe gives each of those an assessment type and a template, checks suitability before approval and keeps the record with its review date. It does not certify anything: the assessment is yours, and so is the judgement in it.',
      ],
    },
    faqs: [
      { q: 'What is the best risk assessment software?', a: 'The one your supervisors will actually use on a Tuesday: scored the way HSE describes (likelihood × severity), with controls that have owners, an approval step and a review date that is enforced. jobsafe does that with a 5×5 matrix, hierarchy of control, six assessment types and a bowtie view, and it works offline.' },
      { q: 'Can I do my own risk assessment?', a: 'Yes. The law asks for a competent person, not a consultant; if you know the work and the hazards, you are that person. jobsafe gives you templates for common jobs, a 5×5 matrix with named bands and a check that the assessment is suitable and sufficient before it is approved.' },
      { q: 'Which assessment types are there?', a: 'General, COSHH, fire, DSE, manual handling and bespoke, each with its own template.' },
      { q: 'What is a bowtie?', a: 'A diagram with the top event in the middle, threats on the left, consequences on the right and the barriers between them. It shows which single barrier you are relying on. jobsafe’s bowtie view scores it and audits the barriers.' },
      { q: 'What happens when a score is High?', a: 'High (10–16) means the risk must be reduced and sets a 30-day deadline. Extreme (17–25) means stop the activity.' },
      { q: 'Does it work offline?', a: 'Yes. Assessments save to the device first and sync when signal returns, like every module.' },
    ],
    doNotClaim: ['AI-written assessments', 'certification of any kind'],
  },
  {
    id: 'permits',
    path: '/platform/permits-to-work',
    display: 'No permit issues until the contractor and the risk assessment check out.',
    lead: 'Permit to work software for hot works, confined space, work at height, electrical, excavation and roof work, each with its required controls. The pre-issue gate checks the contractor is not suspended, that employer’s liability insurance, RAMS and accreditation are in date, that the contractor was audited within 12 months, that a Live risk assessment supports the job and that every control has been confirmed. Blocked is worked out for you.',
    hero: 'permits-gate-desktop',
    proof: ['Six permit types', 'Pre-issue competence gate', 'Live risk assessment required', 'Controls confirmed and stored', 'Blocked worked out automatically'],
    pains: [
      { pain: 'A hot-works permit is issued on trust, and the contractor’s insurance lapsed in March.', outcome: 'The gate checks employer’s liability insurance, RAMS and accreditation dates before the permit can move to Approved.' },
      { pain: 'The risk assessment the permit relies on was last reviewed two years ago.', outcome: 'A permit requires a Live supporting risk assessment; a Draft or Review-overdue one blocks it.' },
      { pain: 'Nobody can say afterwards which controls were in place when the permit was signed.', outcome: 'Every control is confirmed before issue and the confirmations are stored on the permit.' },
    ],
    features: [
      {
        title: 'Six permit types, each with its controls',
        lead: 'Hot works, confined space, work at height, electrical, excavation and roof work. Each type carries the controls it needs, and the permit will not issue until each one is confirmed.',
        points: [
          { icon: 'flame', title: 'Hot works', detail: 'Fire watch, extinguishers, combustibles cleared: confirmed, not assumed.' },
          { icon: 'arrow-up-from-line', title: 'Work at height and roof work', detail: 'Edge protection, access and rescue, each a line on the permit.' },
          { icon: 'lock', title: 'Electrical and confined space', detail: 'Isolation, testing, gas monitoring and standby, confirmed before issue.' },
        ],
        screenshot: 'permits-gate-desktop',
      },
      {
        title: 'The gate: five checks before Approved',
        lead: 'Contractor not suspended. Employer’s liability insurance, RAMS and accreditation all in date. Contractor audited within 12 months. A Live supporting risk assessment. Every control confirmed. Fail one and the permit shows Blocked, with the reason.',
        points: [
          { icon: 'hard-hat', title: 'Contractor competence', detail: 'Suspension, insurance, RAMS, accreditation and audit date, all checked.' },
          { icon: 'shield-alert', title: 'A Live risk assessment', detail: 'The assessment behind the permit must be approved and in date.' },
          { icon: 'check', title: 'Confirmations stored', detail: 'Who confirmed what, on the permit, for the inspector.' },
        ],
        screenshot: 'risk-matrix-desktop',
      },
      {
        title: 'Awaiting approval, Approved, Active, Closed',
        lead: 'The lifecycle is four states and Blocked is not one you set; it is worked out from the gate. Close the permit and the record stays with the job.',
        points: [
          { icon: 'clock', title: 'Active while the work is on', detail: 'The board shows what is live on site today.' },
          { icon: 'circle-check', title: 'Actions from the permit', detail: 'A failed check can raise an action to fix what blocked it.' },
          { icon: 'download', title: 'CSV export', detail: 'Permits export like every other register.' },
        ],
        screenshot: 'actions-board-desktop',
      },
    ],
    connected: ['risk', 'contractors', 'actions', 'incidents'],
    regulation: {
      title: 'Where permits come from',
      paragraphs: [
        'A permit-to-work system is HSE’s recommended control for high-hazard work: hot work, confined spaces (Confined Spaces Regulations 1997), work at height (Work at Height Regulations 2005), electrical work (Electricity at Work Regulations 1989) and excavation. The permit is the record that the hazards were identified, the controls put in place and the people competent.',
        'jobsafe keeps that record and refuses to issue a permit until the checks pass. It does not make the work safe; the people confirming the controls do.',
      ],
    },
    faqs: [
      { q: 'What blocks a permit?', a: 'Any one of: a suspended contractor; employer’s liability insurance, RAMS or accreditation out of date; no contractor audit within 12 months; no Live supporting risk assessment; a control not yet confirmed. The permit shows Blocked with the reason.' },
      { q: 'Which permit types are there?', a: 'Hot works, confined space, work at height, electrical, excavation and roof work, each with its own required controls.' },
      { q: 'What does the permit lifecycle look like?', a: 'Awaiting approval → Approved → Active → Closed. Blocked is worked out from the gate, not set by hand.' },
      { q: 'Does the permit check the risk assessment?', a: 'Yes. It requires a Live supporting risk assessment, so a Draft or a Review-overdue assessment stops the permit.' },
      { q: 'Are the confirmations kept?', a: 'Yes. Every control confirmation is stored on the permit, with who confirmed it.' },
      { q: 'Can contractors use it?', a: 'Contractor is a role level, and the gate checks contractor records. Creating new contractor records from inside the app is not available yet.' },
    ],
    doNotClaim: ['signatures on issue or hand-back', 'adding contractors in-app'],
  },
]

export function modulePage(id: ModuleId): ModulePage | undefined {
  return MODULE_PAGES.find((m) => m.id === id)
}

export function modulePageByPath(path: string): ModulePage | undefined {
  return MODULE_PAGES.find((m) => m.path === path)
}
