// ─────────────────────────────────────────────────────────────────────────────
// The comparison pages (Phase 3, Part D): jobsafe against Mitti (formerly
// SafetyCulture), Evotix and EcoOnline. Copy only, typed, importable by
// Node's test runner and by scripts/claims-check.mjs.
//
// Two kinds of fact live here and they are kept apart by field name:
//
//   · Facts about the competitor go ONLY in `them`, `quote`, `summary` and
//     `chooseThem` (plus the competitor's own `name`, `shortName`,
//     `formerName`, `legalNote`, `monitor`, `url`, `checked`, `label`). Each
//     comes from the fact-check of 25/09/2026, is tied to the URL it was read
//     from and carries that date. The claims checker never scans these
//     fields, and the template renders them inside data-claims="competitor".
//   · Facts about jobsafe go in `jobsafe`, `chooseJobsafe`, `switching`,
//     the FAQ and everything else. They come from the product as it ships
//     (lib/platform.ts, lib/platform-modules*.ts, lib/brand.ts, /security,
//     /pricing) and are scanned like any other platform copy. Nothing here
//     claims a certification, a trial, an import, an identity-provider
//     sign-in, an integration or an AI feature for jobsafe.
//
// CAP Code section 3 (rules 3.32 to 3.43): the same fifteen rows on every
// page, every claim verifiable, the competitor named in plain text, and the
// rows where the competitor is stronger stated plainly. No ratings, no
// screenshots, no logos, no adjectives about them.
//
// To re-check a page after a monitored competitor page changes (see
// docs/MONITORING.md): re-fetch the URL, update the row and its `checked`
// date, move `lastChecked`, run the checks, ship.
// ─────────────────────────────────────────────────────────────────────────────

import { COMPARE_PATHS } from './seo/links.ts'

export interface CompareSource {
  readonly url: string
  /** DD/MM/YYYY. */
  readonly checked: string
  /** Verbatim from the page, under 200 characters. */
  readonly quote?: string
  /** The link text, e.g. "mitti.com/pricing". */
  readonly label?: string
}

export type CompareEdge = 'jobsafe' | 'them' | 'even' | 'depends'

export interface CompareRow {
  readonly id: string
  readonly topic: string
  /** Tooltip: what the row means. */
  readonly help?: string
  readonly jobsafe: string
  readonly them: string
  readonly edge: CompareEdge
  readonly source: CompareSource
  /** A site path that backs the jobsafe cell, such as /security. */
  readonly jobsafeSource?: { readonly href: string; readonly label: string }
}

export interface Competitor {
  readonly name: string
  readonly shortName: string
  readonly formerName?: string
  readonly website: string
  readonly legalNote?: string
  /** The competitor pages watched for change (docs/MONITORING.md). */
  readonly monitor: readonly { readonly label: string; readonly url: string }[]
}

export interface ComparePage {
  readonly path: string
  readonly slug: string
  readonly competitor: Competitor
  /** DD/MM/YYYY, shown at the top of the page. */
  readonly lastChecked: string
  /** The one-line honest summary in the hero. A competitor field. */
  readonly summary: string
  readonly chooseThem: readonly string[]
  readonly chooseJobsafe: readonly string[]
  readonly rows: readonly CompareRow[]
  readonly switching: { readonly title: string; readonly body: string }
  readonly faqs: readonly { readonly q: string; readonly a: string }[]
}

/** The ASA/CAP Code rules every comparison page cites in its "How we compare" note. */
export const CAP_CODE = {
  label: 'CAP Code section 3',
  url: 'https://www.asa.org.uk/type/non_broadcast/code_section/03.html',
  rules: 'rules 3.32 to 3.43 on comparisons with identifiable competitors',
} as const

/** `DD/MM/YYYY` → `YYYY-MM-DD`, for <time dateTime>. */
export function isoDateFromUk(date: string): string {
  const [day, month, year] = date.split('/')
  return `${year}-${month}-${day}`
}

/** The fact-check every competitor claim below comes from. */
const CHECKED = '25/09/2026'

type RowId = 'uk-hosting' | 'gbp-prices' | 'vat' | 'riddor' | 'permits' | 'fleet' | 'offline' | 'free-or-demo' | 'implementation' | 'ai' | 'sso' | 'integrations' | 'lone-worker' | 'coshh' | 'security'

export const ROW_ORDER: readonly RowId[] = ['uk-hosting', 'gbp-prices', 'vat', 'riddor', 'permits', 'fleet', 'offline', 'free-or-demo', 'implementation', 'ai', 'sso', 'integrations', 'lone-worker', 'coshh', 'security']

/**
 * The jobsafe side of every row: the same on every page, because the product
 * is the same. Each cell is a "say now" fact; the link is the page on this
 * site that states it.
 */
const JOBSAFE_ROWS: Readonly<Record<RowId, { readonly topic: string; readonly help: string; readonly jobsafe: string; readonly jobsafeSource: { readonly href: string; readonly label: string } }>> = {
  'uk-hosting': {
    topic: 'UK data hosting',
    help: 'Where the records are stored, stated per product where the supplier hosts its products in different places.',
    jobsafe: 'London region: hosted on Supabase over AWS eu-west-2, with each organisation walled off by row-level security and its own private file storage. Storage and processing by jobsafe stay in the UK.',
    jobsafeSource: { href: '/security', label: 'Security and hosting' },
  },
  'gbp-prices': {
    topic: 'Prices in GBP',
    help: 'Whether a price is published, and in which currency.',
    jobsafe: 'Quoted in pounds per user per month, VAT shown separately; no price list published yet. The pricing page shows the tiers and what each includes.',
    jobsafeSource: { href: '/pricing', label: 'Pricing and tiers' },
  },
  vat: {
    topic: 'VAT shown',
    help: 'Whether the tax on the price is shown beside it.',
    jobsafe: 'Shown separately beside every figure quoted. Every jobsafe price is ex VAT with the VAT stated, never folded into the number.',
    jobsafeSource: { href: '/pricing', label: 'Pricing and tiers' },
  },
  riddor: {
    topic: 'RIDDOR triage and deadlines',
    help: 'Whether the product works out if an incident is reportable under RIDDOR 2013 and by when, or leaves that to you.',
    jobsafe: 'Built in. Each incident is triaged against the Reg 4 specified injuries, over-7-day incapacitation and the Schedule 2 dangerous occurrences; the 10-day or 15-day deadline is worked out from the incident date, and the register keeps what you submitted and the reference. You submit to HSE.',
    jobsafeSource: { href: '/platform/riddor', label: 'RIDDOR module' },
  },
  permits: {
    topic: 'Permit to work',
    help: 'Whether there is a permit-to-work module, and what it checks before a permit issues.',
    jobsafe: 'Six permit types: hot works, confined space, work at height, electrical, excavation and roof work. A permit will not issue until the contractor is not suspended, their insurance, RAMS, accreditation and 12-month audit are in date, a live risk assessment supports the job and every control is confirmed.',
    jobsafeSource: { href: '/platform/permits-to-work', label: 'Permits to work' },
  },
  fleet: {
    topic: 'Fleet and plant compliance',
    help: 'Whether MOT, LOLER thorough-examination and DVSA walkaround records are product features.',
    jobsafe: 'MOT or plating, tax, insurance, next service and LOLER thorough-examination dates on every vehicle and machine, with a keeper, odometer or hours and a history log. A DVSA daily walkaround raises an action when an item fails, and a passed statutory date flags the asset as not to be used.',
    jobsafeSource: { href: '/platform/fleet-compliance', label: 'Fleet and plant' },
  },
  offline: {
    topic: 'Offline in every module',
    help: 'Whether the product works without signal in every module, or in some.',
    jobsafe: 'Every module. A report, a risk assessment, a permit or a walkaround saves to the phone first and shows "Pending sync" until signal returns; a signed-in phone opens with no signal at all.',
    jobsafeSource: { href: '/platform/offline', label: 'How offline works' },
  },
  'free-or-demo': {
    topic: 'Free plan or open demo',
    help: 'Whether you can use the product free, or see it, before you buy.',
    jobsafe: 'No free plan. You see the product on a 30-minute demo booked on the calendar, on a UK haulier’s setup, and we quote for your team size on the call.',
    jobsafeSource: { href: '/demo', label: 'How the demo works' },
  },
  implementation: {
    topic: 'Implementation fee',
    help: 'Whether set-up and onboarding are charged as a separate fee.',
    jobsafe: 'Not charged as a separate fee. Onboarding is included in the Enterprise tier of the price book; confirm what your tier includes on the demo call.',
    jobsafeSource: { href: '/pricing', label: 'What each tier includes' },
  },
  ai: {
    topic: 'AI features',
    help: 'Whether the product includes AI features, and on which plans.',
    jobsafe: 'None. jobsafe has no AI features; every record is written by the person who was there.',
    jobsafeSource: { href: '/platform', label: 'The platform' },
  },
  sso: {
    topic: 'Identity-provider sign-in',
    help: 'Whether staff can sign in through the company identity provider (Okta, Microsoft Entra ID) rather than a separate password.',
    jobsafe: 'Not offered yet. Sign-in is by email and password, and six role levels (Admin, HSSE manager, Site manager, Supervisor, Operative, Contractor) decide who can see, edit, approve and close.',
    jobsafeSource: { href: '/security', label: 'Access and roles' },
  },
  integrations: {
    topic: 'Integrations or API',
    help: 'Whether the product connects to other systems, and how: a developer platform, ready-made connectors, or file export.',
    jobsafe: 'Not offered yet. Every register exports to CSV with the filters you applied, so nothing you put in is locked in.',
    jobsafeSource: { href: '/security', label: 'CSV export' },
  },
  'lone-worker': {
    topic: 'Lone worker',
    help: 'Whether the product includes lone-worker check-ins, alarms or monitoring.',
    jobsafe: 'No lone-worker check-ins, alarm or monitoring. Risk assessments include a lone working (night trunking) template.',
    jobsafeSource: { href: '/platform/risk-assessments', label: 'Risk assessments' },
  },
  coshh: {
    topic: 'Chemicals and COSHH register',
    help: 'Whether there is a register of chemicals or substances, and how COSHH assessments are done.',
    jobsafe: 'No chemical or substance register. A COSHH risk assessment type with its own template sits inside risk assessments, scored 5×5 and tagged by hierarchy of control.',
    jobsafeSource: { href: '/platform/risk-assessments', label: 'Risk assessments' },
  },
  security: {
    topic: 'Security certifications',
    help: 'Third-party security certifications the supplier states it holds, on its own website.',
    jobsafe: 'None held. Hosted in the London region on Supabase over AWS eu-west-2, each organisation walled off by row-level security; the security page lists a certification only once it is held.',
    jobsafeSource: { href: '/security', label: 'Security and hosting' },
  },
}

/** A source read on the fact-check date; the label defaults to the bare host and path. */
function src(url: string, quote?: string): CompareSource {
  const label = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  return { url, checked: CHECKED, label, ...(quote ? { quote } : {}) }
}

function row(id: RowId, edge: CompareEdge, them: string, source: CompareSource): CompareRow {
  const base = JOBSAFE_ROWS[id]
  return { id, topic: base.topic, help: base.help, jobsafe: base.jobsafe, jobsafeSource: base.jobsafeSource, them, edge, source }
}

const SWITCHING_TITLE = 'Talk to us about moving your records'

function switching(shortName: string): ComparePage['switching'] {
  return {
    title: SWITCHING_TITLE,
    body: `Every jobsafe register exports to CSV, so nothing you put in is locked in. A spreadsheet import is not built yet, so we do not offer a tool for bringing records in from ${shortName}. Book a 30-minute demo and we will talk through what you hold today, which jobsafe registers it maps to and how to bring it across.`,
  }
}

// ── Mitti (formerly SafetyCulture) ──────────────────────────────────────────

const MITTI: ComparePage = {
  path: COMPARE_PATHS.mitti,
  slug: 'mitti-safetyculture',
  competitor: {
    name: 'Mitti (formerly SafetyCulture)',
    shortName: 'Mitti',
    formerName: 'SafetyCulture',
    website: 'https://mitti.com',
    legalNote: 'SafetyCulture became Mitti on 11/08/2026 and safetyculture.com redirects to mitti.com. Written "Mitti (formerly SafetyCulture)" on first mention and in the H1, "Mitti" after.',
    monitor: [
      { label: 'Pricing', url: 'https://mitti.com/pricing' },
      { label: 'Platform', url: 'https://mitti.com/platform' },
    ],
  },
  lastChecked: CHECKED,
  summary:
    'Mitti (formerly SafetyCulture) is a global inspections platform with a free plan, a public API, AI in every plan, lone worker built in and ISO 27001:2022 and SOC 2 Type II, priced in US dollars with no UK data region. jobsafe is one UK product hosted in London, quoted in pounds with VAT shown, with RIDDOR triage, a gated permit to work and offline in every module.',
  chooseThem: [
    'You want a free plan for a small team: the Mitti Free plan covers up to 10 seats.',
    'You need a public REST API, webhooks, Zapier or Power Automate, or a sync with your HR system.',
    'You want AI assistance in every plan, metered by credits.',
    'Your procurement asks for ISO 27001:2022 and a SOC 2 Type II report.',
    'You want lone-worker check-ins and panic alerts inside the same app.',
    'You want to start from a public library of 59,216 templates.',
    'You work across regions and want data held in the US, the EU (Ireland) or Australia.',
  ],
  chooseJobsafe: [
    'You want your records hosted in the London region, with each organisation walled off.',
    'You want quotes in pounds per user per month with VAT shown separately.',
    'You want RIDDOR triage against Reg 4 and Schedule 2, with the 10-day and 15-day deadlines worked out from the incident date.',
    'You want permits that will not issue until the contractor’s insurance, RAMS, accreditation and audit date and a live risk assessment check out.',
    'You want MOT, tax, insurance, service and LOLER dates on every vehicle and machine.',
    'You want every module to work offline, not a listed subset.',
  ],
  rows: [
    row('uk-hosting', 'jobsafe', 'No UK region. Data at rest is held in AWS data centres in the US, the EU (Ireland) and Australia, and user identity and product analytics data are stored in the US whichever region the rest of the organisation’s data is in.', src('https://help.mitti.com/003569', 'located in the U.S., EU (Ireland), and Australia')),
    row('gbp-prices', 'depends', 'A public price list, in US dollars (Australian dollars for Australia and New Zealand): Premium is $24 per seat per month billed annually or $29 monthly, with Enterprise and per-site pricing on quote. No pricing in pounds.', src('https://mitti.com/pricing', 'We support billing in AUD for Australian and New Zealander customers and USD for all other international customers.')),
    row('vat', 'jobsafe', 'Prices are shown excluding tax, and the tax is not shown.', src('https://mitti.com/pricing', 'Excl. all applicable taxes')),
    row('riddor', 'jobsafe', 'RIDDOR appears in Mitti’s guides and report templates; the investigations product page does not name RIDDOR, and no triage or deadline feature is claimed.', src('https://mitti.com/topics/riddor', 'Browse RIDDOR report templates')),
    row('permits', 'jobsafe', 'Presents permit to work as configurable digital checklists (hot work, confined space entry, lockout/tagout, working at height, cold work and electrical work) and lists no permit-to-work module.', src('https://mitti.com/apps/permit-to-work-software', 'Mitti supports a configurable digital checklist for: Hot work, Confined space entry, Lockout/tagout (LOTO), Working at height, Cold work and electrical work')),
    row('fleet', 'depends', 'An asset register with inspections, maintenance and utilisation, plus telematics connections to Geotab and Samsara. MOT, LOLER and DVSA walkaround appear in free templates rather than as product features.', src('https://mitti.com/pricing', 'Maintain a digital register of your assets, conduct inspections and raise issues related to them, automate maintenance and view utilization across your fleet')),
    row('offline', 'jobsafe', 'Offline is supported on the mobile app only, for a listed set of features: actions, assets, documents, inspections, issues, reports, schedule and training. Analytics, Heads Up, lone worker, supply, notifications, library, sensors and the template editor need a connection.', src('https://help.mitti.com/002907', 'Using Mitti while offline is only supported on the mobile app.')),
    row('free-or-demo', 'them', 'A Free plan for up to 10 seats at $0, with Premium and Enterprise above it; demos are booked by form.', src('https://mitti.com/pricing', 'Up to 10 seats')),
    row('implementation', 'depends', 'Not published. Onboarding services and training are quoted through sales and are not part of the Free plan.', src('https://mitti.com/pricing', 'Onboarding services and training')),
    row('ai', 'them', 'AI in every plan, metered by credits: the Free plan up to 300 credits per seat per month, Premium from 500 and Enterprise from 800, with an AI assistant, AI issue creation and agents.', src('https://mitti.com/pricing', 'NEW - AI included in every plan')),
    row('sso', 'them', 'Single sign-on (SAML 2.0, with Okta or Azure AD) on Premium and Enterprise; SCIM user provisioning on Enterprise.', src('https://mitti.com/pricing', 'Advanced security, including SSO')),
    row('integrations', 'them', 'A public REST API and webhooks, an integrations marketplace, Zapier and Power Automate, and HR syncs with BambooHR, HiBob, Workday, SAP SuccessFactors and ADP; integrations need Premium or above.', src('https://developer.mitti.com', 'Full REST API and webhook coverage')),
    row('lone-worker', 'them', 'Built in on every plan, with the Free plan limited to one job type and one alert escalation: live location on a map, check-ins, panic alerts and Bluetooth panic buttons. 24/7 human monitoring is arranged through partners.', src('https://help.mitti.com/004645', 'Organizations on Free Plan can only have 1 job type and 1 alert escalation')),
    row('coshh', 'depends', 'No named COSHH or chemical module. A HazCom page and a chemical-register template built on documents and checklists.', src('https://mitti.com/safety-and-compliance/hazcom', 'Establish a reliable HazCom system using Mitti (by SafetyCulture)')),
    row('security', 'them', 'ISO 27001:2022 certified, with a SOC 2 Type II audit report; hosted on AWS, AES-256 at rest and TLS 1.2 or later in transit.', src('https://mitti.com/security', 'Mitti (by SafetyCulture) is ISO 27001:2022 certified.')),
  ],
  switching: switching('Mitti'),
  faqs: [
    {
      q: 'Is Mitti cheaper than jobsafe?',
      a: 'We cannot say. Mitti publishes a free plan for up to 10 seats and a Premium price in US dollars that excludes tax; jobsafe has no published price list yet and quotes in pounds per user per month with VAT shown separately. Book a demo, get the quote, and compare it with what you would pay in pounds after tax.',
    },
    {
      q: 'Does jobsafe have a free plan like Mitti?',
      a: 'No. The Mitti Free plan covers up to 10 seats; jobsafe has no free plan. You see the product on a 30-minute demo and we quote for your team size on the call.',
    },
    {
      q: 'Does jobsafe have the AI features Mitti includes?',
      a: 'No. Mitti includes AI credits in every plan; jobsafe has no AI features. Every record is written by the person who was there, and the RIDDOR triage and 5×5 scoring are rules you can read.',
    },
    {
      q: 'Where is our data held with each product?',
      a: 'jobsafe keeps your records in the London region, hosted on Supabase over AWS eu-west-2, with each organisation walled off by row-level security and its own private file storage. Mitti has no UK region: data at rest is held in AWS data centres in the US, the EU (Ireland) or Australia, and user identity and product analytics data stay in the US whichever region is chosen.',
    },
    {
      q: 'Does jobsafe work offline the way Mitti does?',
      a: 'jobsafe works offline in every module: a report, a risk assessment, a permit or a walkaround saves to the phone first and shows "Pending sync" until signal returns. Mitti supports offline on its mobile app for a listed set of features and not for others, such as analytics and lone worker.',
    },
    {
      q: 'Does jobsafe triage RIDDOR?',
      a: 'Yes. jobsafe triages each incident against the Reg 4 specified injuries, over-7-day incapacitation and the Schedule 2 dangerous occurrences, works out the 10-day or 15-day deadline from the incident date and keeps the register of what you submitted. You submit to HSE. The RIDDOR material on the Mitti site is guidance and report templates; it claims no triage or deadline feature.',
    },
    {
      q: 'Does jobsafe have a permit-to-work module?',
      a: 'Yes: six permit types, each with its required controls, and a pre-issue gate that checks the contractor’s insurance, RAMS, accreditation and audit date and requires a live risk assessment. Mitti presents permit to work as configurable checklists and lists no permit-to-work module.',
    },
    {
      q: 'Can we connect jobsafe to our other systems?',
      a: 'Not yet. Every register exports to CSV, and integrations are not offered until they are built. Mitti publishes a developer platform and an integrations marketplace; jobsafe has neither.',
    },
    {
      q: 'How do we move our records from Mitti to jobsafe?',
      a: 'Talk to us. Every jobsafe register exports to CSV, so nothing is locked in, but a spreadsheet import is not built yet. On the demo call we go through what you hold in Mitti, which jobsafe registers it maps to and how to bring it across.',
    },
  ],
}

// ── Evotix ───────────────────────────────────────────────────────────────────

const EVOTIX: ComparePage = {
  path: COMPARE_PATHS.evotix,
  slug: 'evotix',
  competitor: {
    name: 'Evotix',
    shortName: 'Evotix',
    website: 'https://www.evotix.com',
    legalNote: 'Two platforms: Evotix Professional (built on Assure) and Evotix Enterprise (built on Evotix 360). Hosting and feature availability differ by product; the rows say which.',
    monitor: [
      { label: 'Pricing request', url: 'https://www.evotix.com/pricing-request' },
      { label: 'Solutions', url: 'https://www.evotix.com/solutions' },
    ],
  },
  lastChecked: CHECKED,
  summary:
    'Evotix is a Verdantix Green Quadrant Leader (2026) with two platforms, four security badges, SCIM provisioning, a dedicated permit-to-work module and EvoAI agents, sold by quote with a separate one-time implementation fee. jobsafe is one UK product hosted in London, quoted in pounds with VAT shown and no separate implementation fee, with RIDDOR triage, fleet and plant dates and offline in every module.',
  chooseThem: [
    'You want a supplier named a Leader in the 2026 Verdantix Green Quadrant for EHS software.',
    'Your procurement asks for ISO 27001, SOC 2 Type II and Cyber Essentials badges.',
    'You need SCIM provisioning with Okta or Microsoft Entra ID.',
    'You need the wider module set: lockout/tagout, management of change, process safety, occupational health, ESG.',
    'You want EvoAI assistive agents inside CAPA, toolbox talks and permits to work.',
    'You are buying Evotix Professional and want the AWS London region.',
  ],
  chooseJobsafe: [
    'You want a price quoted in pounds per user per month with VAT shown, and no separate implementation invoice.',
    'You want one product hosted in the London region, whichever tier you buy.',
    'You want RIDDOR triage against Reg 4 and Schedule 2 with the deadlines worked out from the incident date.',
    'You want MOT, tax, insurance, service and LOLER dates on every vehicle and machine, with a DVSA walkaround that raises an action on a fail.',
    'You want offline in every module, stated module by module.',
    'You want to be live in days: invite people, pick templates, report.',
  ],
  rows: [
    row('uk-hosting', 'depends', 'Depends on the product. Evotix Professional (the Assure platform) is hosted in the AWS London region for UK and EU customers; Evotix Enterprise (the Evotix 360 platform) is hosted in the AWS Frankfurt region with Dublin as secondary; Learn is hosted in Dublin.', src('https://www.evotix.com/en-subprocessor-policy', 'London Region for UK and EU customers')),
    row('gbp-prices', 'depends', 'No published prices in any currency. Pricing is by quote through a form and is described as built around the organisation’s size, sites and EHS needs.', src('https://www.evotix.com/pricing-request', "Pricing built around your organization's size, sites and EHS needs, not rigid plans.")),
    row('vat', 'depends', 'Not applicable on the website: no prices are published, so no tax treatment is shown.', src('https://www.evotix.com/pricing-request')),
    row('riddor', 'jobsafe', 'RIDDOR is named as a regime the incident-management module tracks; no triage against the reportable categories and no deadline worked out from the incident date are claimed.', src('https://www.evotix.com/solutions/safety/incident-management', 'Automate OSHA, RIDDOR, etc. tracking to cut admin work, avoid fines and breeze through audits.')),
    row('permits', 'even', 'A dedicated permit-to-work module, plus an EvoAI permit-to-work assistive agent.', src('https://www.evotix.com/solutions/operational-risk/permit-to-work', 'EHS Permit to Work Software')),
    row('fleet', 'jobsafe', 'Asset management on Evotix Professional (equipment, plant and assets with inspections, maintenance and safety records) and journey planning; MOT, LOLER and DVSA walkaround are not named.', src('https://www.evotix.com/solutions/evotix-assure', 'Track equipment, plant, and assets, including inspections, maintenance activities, and associated safety records')),
    row('offline', 'depends', 'Offline is claimed for the mobile app in general, with reports submitted online or offline and synced when connected; the website does not list it module by module.', src('https://www.evotix.com/platform/mobile', 'Submit reports online or offline and sync automatically when connected')),
    row('free-or-demo', 'even', 'No free plan. A demo is booked through a five-field form, every field required, with a short product-tour video on the demo page.', src('https://www.evotix.com/book-demo', 'Book a personalized demo')),
    row('implementation', 'jobsafe', 'A separate one-time fee, amount not published; the cost depends on the customisation needed, with "Fast Start" and "Traditional" implementation paths.', src('https://www.evotix.com/pricing-request', 'Implementation is a separate, one-time fee.')),
    row('ai', 'them', 'EvoAI: assistive agents embedded in everyday workflows, listed for CAPA, toolbox talks, permit to work, health tests, materiality assessment and hazard images on mobile.', src('https://www.evotix.com/evo-ai', 'EvoAI is delivered through a set of assistive AI agents embedded directly into everyday EHS workflows')),
    row('sso', 'them', 'SCIM user provisioning and role management with identity providers such as Okta and Microsoft Entra ID, listed under Evotix Professional; availability varies by product.', src('https://www.evotix.com/integrations', 'Availability varies by product. Your Evotix team can help confirm what applies in your environment.')),
    row('integrations', 'them', 'Inbound and outbound APIs, scheduled file-based imports and SCIM; three ready-made connectors (SDS Manager, ENHESA/RegScan, LexisNexis); most customers connect through middleware or a custom integration.', src('https://www.evotix.com/integrations', 'Integrations are supported through inbound and outbound APIs, scheduled file-based imports, and SCIM for identity lifecycle management.')),
    row('lone-worker', 'them', 'No lone-worker module in the solutions list; journey planning offers missed-check-in alerts and simple escalation.', src('https://www.evotix.com/solutions/safety/journey-planning', 'missed-check-in alerts and simple escalation')),
    row('coshh', 'depends', 'A chemical inventory with safety data sheets through the SDS Manager integration; COSHH is not named, and the page refers to OSHA and EPA.', src('https://www.evotix.com/solutions/esg-and-sustainability/chemical-and-sds-management', 'Access millions of up-to-date SDSs through our SDS Manager integration')),
    row('security', 'them', 'Four badges on the Evotix home page: GDPR compliant, ISO 27001 certification, SOC 2 Type II attestation and Cyber Essentials certification.', src('https://www.evotix.com/', 'SOC 2 Type II Attestation')),
  ],
  switching: switching('Evotix'),
  faqs: [
    {
      q: 'Is Evotix cheaper than jobsafe?',
      a: 'We cannot say: Evotix publishes no prices and charges implementation as a separate one-time fee, and jobsafe has no published price list yet. jobsafe quotes in pounds per user per month with VAT shown separately and does not charge implementation as a separate fee. Ask both for a written quote for your team size and compare the totals.',
    },
    {
      q: 'Can our people sign in with our company identity provider, as Evotix allows?',
      a: 'Not yet. Evotix lists provisioning with Okta and Microsoft Entra ID; jobsafe does not offer it. Sign-in is by email and password, and six role levels decide who can see, edit, approve and close.',
    },
    {
      q: 'Does jobsafe have AI agents like EvoAI?',
      a: 'No. Evotix embeds EvoAI assistive agents in its workflows; jobsafe has no AI features. Every record is written by the person who was there.',
    },
    {
      q: 'Where is our data held with each product?',
      a: 'jobsafe keeps your records in the London region, hosted on Supabase over AWS eu-west-2, with each organisation walled off by row-level security. With Evotix it depends on the product: its sub-processor policy places Evotix Professional (Assure) in the AWS London region for UK and EU customers and Evotix Enterprise (Evotix 360) in Frankfurt with Dublin as secondary.',
    },
    {
      q: 'Does jobsafe work offline?',
      a: 'Yes, in every module. A report, a risk assessment, a permit or a walkaround saves to the phone first and shows "Pending sync" until signal returns. Evotix says its mobile app submits reports online or offline and syncs when connected; its website does not list offline module by module.',
    },
    {
      q: 'Does jobsafe triage RIDDOR?',
      a: 'Yes. jobsafe triages each incident against the Reg 4 specified injuries, over-7-day incapacitation and the Schedule 2 dangerous occurrences, works out the 10-day or 15-day deadline from the incident date and keeps the register of what you submitted. You submit to HSE. Evotix names RIDDOR as a regime its incident module tracks; no triage or deadline feature is claimed on its website.',
    },
    {
      q: 'Does jobsafe track fleet and plant dates?',
      a: 'Yes: MOT or plating, tax, insurance, service and LOLER thorough-examination dates on every vehicle and machine, with a DVSA daily walkaround that raises an action when an item fails. Evotix Professional lists asset management with inspections and maintenance records; MOT, LOLER and DVSA are not named.',
    },
    {
      q: 'How do we move our records from Evotix to jobsafe?',
      a: 'Talk to us. Every jobsafe register exports to CSV, so nothing is locked in, but a spreadsheet import is not built yet. On the demo call we go through what you hold in Evotix, which jobsafe registers it maps to and how to bring it across.',
    },
  ],
}

// ── EcoOnline ────────────────────────────────────────────────────────────────

const ECOONLINE: ComparePage = {
  path: COMPARE_PATHS.ecoonline,
  slug: 'ecoonline',
  competitor: {
    name: 'EcoOnline',
    shortName: 'EcoOnline',
    website: 'https://www.ecoonline.com',
    legalNote: 'A suite of separately hosted products (EHS platform, ePermits, Sypol, StaySafe, Chemical Manager, Info Exchange). Hosting and offline claims differ by product; the rows say which.',
    monitor: [
      { label: 'EHS software', url: 'https://www.ecoonline.com/ehs-software/' },
      { label: 'Certifications', url: 'https://www.ecoonline.com/certifications/' },
    ],
  },
  lastChecked: CHECKED,
  summary:
    'EcoOnline is a suite of products serving over 11,000 customers, with ePermits, StaySafe lone-worker monitoring certified to BS 8484, Sypol COSHH assessments, EcoAI and five certifications, sold by quote and hosted in different places by product. jobsafe is one UK product hosted in London, quoted in pounds with VAT shown, with RIDDOR triage, fleet and plant dates and offline in every module.',
  chooseThem: [
    'You need a lone-worker service certified to BS 8484:2022 with outsourced 24/7 monitoring (StaySafe).',
    'You need COSHH assessments written for you (Sypol), a safety data sheet register and SDS authoring.',
    'You need ePermits with real-time permit tracking, or the wider suite: chemical safety, ESG, e-learning, access control.',
    'Your procurement asks for ISO 9001, ISO 22301, ISO/IEC 27001:2013 and Cyber Essentials.',
    'You want a supplier with over 11,000 customers.',
    'You want EcoAI assistance and workflow agents.',
  ],
  chooseJobsafe: [
    'You want one product with every register in one record, hosted in the London region.',
    'You want quotes in pounds per user per month with VAT shown separately.',
    'You want RIDDOR triage against Reg 4 and Schedule 2 with the deadlines worked out from the incident date.',
    'You want MOT, tax, insurance, service and LOLER dates on every vehicle and machine.',
    'You want permits gated on the contractor and a live risk assessment, with every control confirmed before issue.',
    'You want offline in every module, not in some products.',
  ],
  rows: [
    row('uk-hosting', 'depends', 'Depends on the product. The EHS platform sold in the UK is hosted on AWS in Ireland (platform) and Sweden (application), with customer integrations and data warehouses on Azure in the UK; ePermits and Sypol are hosted on Azure in the UK; StaySafe is hosted in several regions; Chemical Manager is hosted in Ireland.', src('https://www.ecoonline.com/sub-processors/')),
    row('gbp-prices', 'depends', 'No published prices. The EHS FAQ says the price depends on the features, users and customisation included, and asks you to speak to the team.', src('https://www.ecoonline.com/ehs-software/', 'As our EHS software is bespoke, the price will depend on the features, users, and customisation we include for your business.')),
    row('vat', 'depends', 'Not applicable on the website: no prices are published, so no tax treatment is shown.', src('https://www.ecoonline.com/ehs-software/')),
    row('riddor', 'jobsafe', 'RIDDOR is not named on the UK incident-management product page; the reporting deadlines appear in a blog article only.', src('https://www.ecoonline.com/ehs-software/incident-management-software/', 'Meet compliance requirements and stay updated on evolving regulations.')),
    row('permits', 'even', 'Yes: Control of Work and the ePermits product, with digital issue, approval and real-time permit tracking.', src('https://www.ecoonline.com/ehs-software/control-of-work/epermits/', 'Real-time permit tracking and validation')),
    row('fleet', 'jobsafe', 'No fleet module in the EHS product list. The transport and logistics industry page markets vehicle inspections and an audit trail for DVSA and HSE inspections.', src('https://www.ecoonline.com/industries/transport-and-logistics/', 'maintain a defensible audit trail for DVSA and HSE inspections')),
    row('offline', 'jobsafe', 'Offline is claimed for audits and inspections, for viewing ePermits and for the StaySafe low-signal mode; it is not claimed for every module.', src('https://www.ecoonline.com/ehs-software/audits-inspections/', 'Continue to work offline in areas of low signal.')),
    row('free-or-demo', 'depends', 'No free plan. A demo is booked through a nine-field form, every field required; a 14-day trial is offered for the StaySafe lone-worker product only, through a form; a library of on-demand demo videos is advertised.', src('https://www.ecoonline.com/book-a-demo/')),
    row('implementation', 'depends', 'Not published. The ePermits page says most organisations can implement it in under one week.', src('https://www.ecoonline.com/ehs-software/control-of-work/epermits/', 'Most organisations can implement EcoOnline ePermits in under one week')),
    row('ai', 'them', 'EcoAI: EcoAssist, an assistant embedded across EcoOne, and EcoAgents for safety workflow automation.', src('https://www.ecoonline.com/ai/', 'Assist, the AI-powered assistant embedded across EcoOne')),
    row('sso', 'depends', 'Not stated on the public product pages, and the help centre could not be read as text, so this was not verified either way on 25/09/2026.', src('https://www.ecoonline.com/ehs-software/')),
    row('integrations', 'them', 'APIs are referenced: ePermits can connect with existing CMMS, EHS or ERP systems through secure APIs. The integrations page returned 404 when checked.', src('https://www.ecoonline.com/ehs-software/control-of-work/epermits/', 'can connect with your existing CMMS, EHS, or ERP systems through secure APIs')),
    row('lone-worker', 'them', 'Yes: StaySafe, certified to BS 8484:2022, with an app, a panic button, low-signal and satellite modes and outsourced 24/7 monitoring.', src('https://www.ecoonline.com/ehs-software/lone-worker/', 'Lone worker software to protect your lone workers 24/7, powered by StaySafe.')),
    row('coshh', 'them', 'Yes: Sypol COSHH risk assessments produced by qualified safety professionals, Chemical Manager for safety data sheets, and SDS authoring.', src('https://www.ecoonline.com/chemical-safety/coshh-risk-assessment/', 'COSHH risk assessments produced by a team of qualified safety professionals as you need them.')),
    row('security', 'them', 'ISO 9001:2015, ISO 22301:2019, ISO/IEC 27001:2013 and Cyber Essentials, plus BS 8484:2022 for StaySafe, as listed on the certifications page.', src('https://www.ecoonline.com/certifications/', 'StaySafe is certified to BS 8484:2022, the British Standard Code of Practice for the provision of lone worker services.')),
  ],
  switching: switching('EcoOnline'),
  faqs: [
    {
      q: 'Is EcoOnline cheaper than jobsafe?',
      a: 'We cannot say: EcoOnline publishes no prices (its FAQ says the price depends on the features, users and customisation included) and jobsafe has no published price list yet. jobsafe quotes in pounds per user per month with VAT shown separately. Ask both for a written quote for your team size and compare the totals.',
    },
    {
      q: 'Does jobsafe have a lone-worker service like StaySafe?',
      a: 'No. StaySafe from EcoOnline is a lone-worker product certified to BS 8484:2022 with 24/7 monitoring; jobsafe has no lone-worker alarm, check-in or monitoring. jobsafe includes a lone working (night trunking) risk assessment template.',
    },
    {
      q: 'Does jobsafe have a COSHH register like Sypol?',
      a: 'No register. EcoOnline offers Sypol COSHH assessments and a Chemical Manager register of safety data sheets; jobsafe has a COSHH risk assessment type inside risk assessments, scored 5×5 and tagged by hierarchy of control, and no chemical register.',
    },
    {
      q: 'Where is our data held with each product?',
      a: 'jobsafe keeps your records in the London region, hosted on Supabase over AWS eu-west-2, with each organisation walled off by row-level security. With EcoOnline it depends on the product: its sub-processor list places the EHS platform sold in the UK on AWS in Ireland and Sweden with integrations and data warehouses on Azure in the UK, and ePermits and Sypol on Azure in the UK.',
    },
    {
      q: 'Does jobsafe work offline?',
      a: 'Yes, in every module. A report, a risk assessment, a permit or a walkaround saves to the phone first and shows "Pending sync" until signal returns. EcoOnline claims offline for audits and inspections, for viewing ePermits and for the StaySafe low-signal mode; it does not claim it for every module.',
    },
    {
      q: 'Does jobsafe triage RIDDOR?',
      a: 'Yes. jobsafe triages each incident against the Reg 4 specified injuries, over-7-day incapacitation and the Schedule 2 dangerous occurrences, works out the 10-day or 15-day deadline from the incident date and keeps the register of what you submitted. You submit to HSE. The EcoOnline UK incident-management page does not name RIDDOR; the reporting deadlines appear in a blog article.',
    },
    {
      q: 'Does jobsafe have permits to work?',
      a: 'Yes. Both products have a permit module. The six jobsafe permit types will not issue until the contractor’s insurance, RAMS, accreditation and audit date and a live risk assessment check out and every control is confirmed; EcoOnline ePermits offers digital issue, approval and real-time permit tracking.',
    },
    {
      q: 'How do we move our records from EcoOnline to jobsafe?',
      a: 'Talk to us. Every jobsafe register exports to CSV, so nothing is locked in, but a spreadsheet import is not built yet. On the demo call we go through what you hold in EcoOnline, which jobsafe registers it maps to and how to bring it across.',
    },
  ],
}

export const COMPARE_PAGES: readonly ComparePage[] = [MITTI, EVOTIX, ECOONLINE]

export function comparePage(slug: string): ComparePage | undefined {
  return COMPARE_PAGES.find((page) => page.slug === slug)
}

export function comparePageByPath(path: string): ComparePage | undefined {
  return COMPARE_PAGES.find((page) => page.path === path)
}
