// ─────────────────────────────────────────────────────────────────────────────
// The platform content model for Phase 2: modules, families, facts,
// regulation tiles and the homepage FAQ. Copy only; icons are named and
// resolved in components/platform/icons.tsx so this file stays free of JSX
// and importable by Node tests.
//
// Every claim here is on the "say now" list in docs/REBUILD.md §3 or in the
// Phase 2 brief's product facts. Nothing from the "once built" or "never"
// lists appears: no push or email alerts, no voice notes, no immutable
// trail, no filing RIDDOR for anyone, no store apps, no ISO 45001.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductImageId } from './product-images.ts'

export type Family = 'record' | 'resolve' | 'prevent'

export const FAMILIES: Readonly<Record<Family, { readonly name: string; readonly promise: string; readonly screenshot: ProductImageId }>> = {
  record: {
    name: 'Record',
    promise: 'Get it down while it is fresh: incidents, RIDDOR, checks and vehicles, from the phone in your pocket, with or without signal.',
    screenshot: 'reports-register-desktop',
  },
  resolve: {
    name: 'Resolve',
    promise: 'Turn the record into work that gets done: investigations, actions with owners and dates, permits that check before they issue.',
    screenshot: 'actions-board-desktop',
  },
  prevent: {
    name: 'Prevent',
    promise: 'Stop the next one: risk assessments with bowtie analysis, training that is in date, documents that are current, dashboards that show where to look.',
    screenshot: 'risk-bowtie-desktop',
  },
}

export type IconName =
  | 'clipboard-list'
  | 'gavel'
  | 'list-checks'
  | 'truck'
  | 'search'
  | 'circle-check'
  | 'file-badge'
  | 'hard-hat'
  | 'shield-alert'
  | 'graduation-cap'
  | 'folder-open'
  | 'layout-dashboard'
  | 'map-pin'
  | 'wifi-off'
  | 'camera'
  | 'scale'
  | 'accessibility'
  | 'pound-sterling'
  | 'cloud'
  | 'users'
  | 'lock'
  | 'download'
  | 'timer'
  | 'flame'
  | 'arrow-up-from-line'
  | 'flask-conical'
  | 'wrench'
  | 'car'
  | 'clock'
  | 'smartphone'
  | 'refresh-cw'
  | 'check'

export type ModuleId =
  | 'incidents'
  | 'riddor'
  | 'checklists'
  | 'fleet'
  | 'investigations'
  | 'actions'
  | 'permits'
  | 'contractors'
  | 'risk'
  | 'training'
  | 'documents'
  | 'dashboards'

export interface Module {
  readonly id: ModuleId
  readonly name: string
  readonly family: Family
  /** The module's page. `null` until a later phase builds it; the nav never links a null. */
  readonly path: string | null
  /** One-line promise, in the customer's words. */
  readonly promise: string
  /** `expanding` marks a module the platform ships only part of today. */
  readonly status: 'live' | 'expanding'
  readonly icon: IconName
}

export const MODULES: readonly Module[] = [
  // Record
  { id: 'incidents', name: 'Incident & near-miss reporting', family: 'record', path: '/platform/incident-reporting', promise: 'Seven steps from any phone, with photos, GPS, people, vehicles and RIDDOR triage.', status: 'live', icon: 'clipboard-list' },
  { id: 'riddor', name: 'RIDDOR 2013', family: 'record', path: '/platform/riddor', promise: 'A live verdict on what is reportable and by when, then a register of what you submitted.', status: 'live', icon: 'gavel' },
  { id: 'checklists', name: 'Checklists & inspections', family: 'record', path: null, promise: 'Walkarounds and inspections whose failures raise actions.', status: 'expanding', icon: 'list-checks' },
  { id: 'fleet', name: 'Fleet & plant', family: 'record', path: null, promise: 'MOT, tax, insurance, service and LOLER dates on every vehicle and machine.', status: 'live', icon: 'truck' },
  // Resolve
  { id: 'investigations', name: 'Investigations', family: 'resolve', path: null, promise: 'Four-level ICAM root cause on the report itself, with the evidence beside it.', status: 'live', icon: 'search' },
  { id: 'actions', name: 'Corrective actions', family: 'resolve', path: null, promise: 'Raised from reports, hazards, checklists and permits, each with an owner and a date.', status: 'live', icon: 'circle-check' },
  { id: 'permits', name: 'Permits to work', family: 'resolve', path: '/platform/permits-to-work', promise: 'Six permit types that will not issue until the contractor and the risk assessment check out.', status: 'live', icon: 'file-badge' },
  { id: 'contractors', name: 'Contractors', family: 'resolve', path: null, promise: 'Insurance, RAMS, accreditation and audit dates, checked at the permit gate.', status: 'expanding', icon: 'hard-hat' },
  // Prevent
  { id: 'risk', name: 'Risk assessments & bowtie', family: 'prevent', path: '/platform/risk-assessments', promise: '5×5 scoring, hierarchy of control, six types, bowtie barriers and approval.', status: 'live', icon: 'shield-alert' },
  { id: 'training', name: 'Training & competence', family: 'prevent', path: null, promise: 'A competency matrix that shows who is in date for what.', status: 'live', icon: 'graduation-cap' },
  { id: 'documents', name: 'Document control', family: 'prevent', path: null, promise: 'Policies and procedures with the current version in front of the people who need it.', status: 'live', icon: 'folder-open' },
  { id: 'dashboards', name: 'Dashboards', family: 'prevent', path: null, promise: 'Open incidents by site, RIDDOR due dates and overdue actions on one screen.', status: 'live', icon: 'layout-dashboard' },
]

export function moduleById(id: ModuleId): Module {
  const found = MODULES.find((m) => m.id === id)
  if (!found) throw new Error(`Unknown module ${id}`)
  return found
}

export function modulesIn(family: Family): readonly Module[] {
  return MODULES.filter((m) => m.family === family)
}

/** Modules that have a page today. */
export function modulesWithPages(): readonly (Module & { path: string })[] {
  return MODULES.filter((m): m is Module & { path: string } => m.path !== null)
}

/** The verifiable facts on the strip. "Prices in pounds" joins the list only once PRICE_BOOK has prices. */
export const PLATFORM_FACTS: readonly { readonly icon: IconName; readonly label: string; readonly detail: string }[] = [
  { icon: 'map-pin', label: 'Hosted in London', detail: 'UK region, each organisation walled off' },
  { icon: 'wifi-off', label: 'Works offline', detail: 'Every module saves to the phone first' },
  { icon: 'gavel', label: 'RIDDOR 2013 built in', detail: 'Reg 4, Schedule 2 and the deadlines' },
  { icon: 'accessibility', label: 'WCAG 2.2 AA', detail: 'Tested at 320px, gloves and glare' },
]

export const PRICES_IN_POUNDS_FACT = { icon: 'pound-sterling', label: 'Prices in pounds', detail: 'Per user per month, VAT shown' } as const

/** What the product does with each regulation. Precise, no certification claims. */
export interface RegulationTile {
  readonly id: string
  readonly name: string
  readonly short: string
  readonly icon: IconName
  readonly does: string
  readonly href: string | null
  readonly span?: 2
}

export const REGULATIONS: readonly RegulationTile[] = [
  {
    id: 'riddor',
    name: 'RIDDOR 2013',
    short: 'Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013',
    icon: 'gavel',
    does: 'Triage against the Reg 4 specified injuries, over-7-day incapacitation and the Schedule 2 dangerous occurrences, with the 10 and 15-day deadlines worked out from the incident date. You submit to HSE; jobsafe keeps the record and the reference.',
    href: '/platform/riddor',
    span: 2,
  },
  {
    id: 'mhswr',
    name: 'MHSWR 1999 reg 3',
    short: 'Management of Health and Safety at Work Regulations 1999, regulation 3',
    icon: 'scale',
    does: 'A warning on any risk assessment that is not yet "suitable and sufficient", before it can go live.',
    href: '/platform/risk-assessments',
  },
  {
    id: 'loler',
    name: 'LOLER 1998',
    short: 'Lifting Operations and Lifting Equipment Regulations 1998',
    icon: 'arrow-up-from-line',
    does: 'LOLER examination dates kept on every vehicle and machine that lifts, beside MOT, tax, insurance and service.',
    href: null,
  },
  {
    id: 'puwer',
    name: 'PUWER 1998',
    short: 'Provision and Use of Work Equipment Regulations 1998',
    icon: 'wrench',
    does: 'Service and inspection dates on the plant register, so the record shows equipment is maintained.',
    href: null,
  },
  {
    id: 'coshh',
    name: 'COSHH 2002',
    short: 'Control of Substances Hazardous to Health Regulations 2002',
    icon: 'flask-conical',
    does: 'A COSHH risk assessment type with its own template, scored 5×5 and tagged by hierarchy of control.',
    href: '/platform/risk-assessments',
  },
  {
    id: 'wahr',
    name: 'Work at Height Regs 2005',
    short: 'Work at Height Regulations 2005',
    icon: 'hard-hat',
    does: 'A work-at-height permit type with its required controls, and a roof-access risk assessment template.',
    href: '/platform/permits-to-work',
  },
  {
    id: 'rrfso',
    name: 'Fire Safety Order 2005',
    short: 'Regulatory Reform (Fire Safety) Order 2005',
    icon: 'flame',
    does: 'A fire risk assessment type and template, with hot-works permits that check controls before issue.',
    href: '/platform/risk-assessments',
  },
  {
    id: 'dvsa',
    name: 'DVSA daily walkaround',
    short: 'Driver daily walkaround checks',
    icon: 'car',
    does: 'A walkaround checklist for drivers; a failed item raises an action against the vehicle.',
    href: null,
  },
]

/** Section 9 on the homepage: jobsafe against "the big suites". No competitor is named. */
export const WHY_SWITCH: readonly { readonly topic: string; readonly jobsafe: string; readonly suites: string }[] = [
  { topic: 'Where your data lives', jobsafe: 'London. Each organisation walled off, private file storage.', suites: 'A US or EU region, chosen for you.' },
  { topic: 'How you pay', jobsafe: 'Quoted in pounds, VAT shown, per user per month.', suites: 'A dollar price list, or a quote after a sales call.' },
  { topic: 'When there is no signal', jobsafe: 'Every module saves to the phone first; "Pending sync" on the record.', suites: 'An offline mode for some forms, not the whole product.' },
  { topic: 'RIDDOR', jobsafe: 'Reg 4, Schedule 2 and the deadlines built in, with a register of what you submitted.', suites: 'A generic incident form; you work out what is reportable.' },
  { topic: 'Getting started', jobsafe: 'Live in days: invite people, pick templates, report.', suites: 'An implementation project with its own invoice.' },
]

export interface FaqItem {
  readonly q: string
  readonly a: string
}

/** Homepage FAQ, answer-first, truthful. The first three answer "People also ask". */
export const HOME_FAQS: readonly FaqItem[] = [
  {
    q: 'Does it work offline?',
    a: 'Yes, in every module. A report, a risk assessment, a permit or a walkaround saves to the phone first and shows "Pending sync" until signal returns; then it syncs on its own. Signed-in phones open offline.',
  },
  {
    q: 'Where is our data?',
    a: 'In the London region, hosted on Supabase over AWS eu-west-2. Each organisation is walled off by row-level security with its own private file storage, and you can export every register to CSV.',
  },
  {
    q: 'Is there an app?',
    a: 'jobsafe is an installable web app: add it to the home screen on iPhone, Android or a desktop from the browser and it opens like an app, offline included. A native store app is not available yet.',
  },
  {
    q: 'Does it file RIDDOR for us?',
    a: 'No. It tells you whether an incident is reportable and by when, keeps the statutory record and the reference you get back, and reminds you of the deadline. You submit to HSE.',
  },
  {
    q: 'What does it cost, and is VAT included?',
    a: 'Pricing is per user per month, in pounds, with VAT shown separately on every figure. Book a demo for pricing and we will quote for your team size on the call.',
  },
  {
    q: 'Can contractors use it?',
    a: 'Contractor is one of the six role levels, and the permit gate checks a contractor’s insurance, RAMS, accreditation and audit date before a permit issues. Adding new contractor records from inside the app is not available yet.',
  },
  {
    q: 'Can we import our records?',
    a: 'Not yet. Every register exports to CSV, so nothing you put in is locked in; import from spreadsheets is on the list but not built.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a 30-minute walkthrough. We show you the product on a UK haulier’s setup, answer your questions and, if it fits, agree a start date.',
  },
]

/** "People also ask" answered on the homepage, answer-first. */
export const HOME_PAA: readonly FaqItem[] = [
  {
    q: 'What are some good health and safety apps?',
    a: 'A good health and safety app records incidents, risk assessments, permits and checks on a phone, works without signal, keeps the data in your own jurisdiction and shows what is due. jobsafe does all four for UK operators; the big international suites cover the first.',
  },
  {
    q: 'What is an EHS software?',
    a: 'EHS (environment, health and safety) software is one system for the records a business must keep about harm and risk at work: incidents, RIDDOR, risk assessments, permits, training and inspections. jobsafe is EHS software written for UK law and UK sites.',
  },
  {
    q: 'What are HSE software systems?',
    a: 'HSE software systems keep health, safety and environment records in one place so they can be found, acted on and shown to an inspector. In the UK the term also refers to the Health and Safety Executive; software like jobsafe helps you meet HSE’s reporting rules, but the HSE does not sell software.',
  },
]

/** The six-step story for "One incident, end to end". */
export const INCIDENT_STORY: readonly { readonly title: string; readonly description: string; readonly screenshot: ProductImageId }[] = [
  { title: 'A driver reports a tail-lift injury in the yard with no signal.', description: 'Seven steps on the phone: what happened, where (GPS captured), who, the vehicle by registration, a photo of the tail lift, RIDDOR triage, review. The draft autosaves; the report shows "Pending sync" until the cab picks up signal.', screenshot: 'report-new-evidence-phone' },
  { title: 'RIDDOR triage returns "Over-7-day incapacitation, report within 15 days".', description: 'The live verdict panel works the incident date against Reg 4 and the over-7-day rule, excluding the day of the accident and counting weekends, and puts the deadline on the register.', screenshot: 'riddor-verdict-desktop' },
  { title: 'The investigator runs a four-level ICAM analysis.', description: 'On the report itself, beside the evidence gallery and the vehicle card: absent or failed defences, individual and team actions, task and environmental conditions, organisational factors.', screenshot: 'report-detail-desktop' },
  { title: 'Corrective actions raise themselves.', description: 'Each finding becomes an action with an owner and a due date on the board, linked back to the report so the trail reads both ways.', screenshot: 'actions-board-desktop' },
  { title: 'The manual-handling risk assessment is re-scored.', description: 'The worksheet is reopened, the tail-lift hazard re-scored on the 5×5 matrix, a further control added at the engineering level, and the assessment sent for approval.', screenshot: 'risk-matrix-desktop' },
  { title: 'A training gap is flagged.', description: 'The competency matrix shows the driver’s tail-lift training is out of date. That becomes an action too.', screenshot: 'training-matrix-desktop' },
]
