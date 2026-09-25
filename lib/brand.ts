// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — brand & entity constants. SINGLE SOURCE OF TRUTH.
//
// Every price, phone number, address, URL and social profile on the marketing
// site must be read from this file. Nothing here may be duplicated as a string
// literal elsewhere: `npm run seo:audit` fails the build if it is.
//
// Rules encoded here (see SEO Operating Instructions §0 and docs/REBUILD.md):
//   1. The brand is `jobsafe` — always lowercase. Sentence-start is no exception.
//   2. UK English. Dates DD/MM/YYYY.
//   7. Never fabricate customers, testimonials, ratings or statistics.
//
// seo-audit-ignore: no-checklists — PRICE_BOOK below lists the platform's
// modules, one of which is Checklists & inspections. It renders only behind
// NEXT_PUBLIC_PLATFORM_LAUNCH; nothing in the Phase 1 constants claims one.
//
// Last verified against checkout (the Inputs block of the Phase 1 brief):
// 25/09/2026. Worker £3.00, Admin £12.00, volume £2.75 for 500–1,000, annual
// "2 months free", 14-day trial with a card required at sign-up.
// ─────────────────────────────────────────────────────────────────────────────

/** The brand string. Lowercase. Always. */
export const BRAND = 'jobsafe' as const

/** Registered legal entity behind the product. */
export const LEGAL_NAME = 'Jobmate Ltd' as const

/** The one maker line, used verbatim everywhere the maker is named. */
export const MAKER_LINE = `${BRAND} is made by ${LEGAL_NAME}.` as const

/** Footer credit. */
export const MADE_IN_LINE = `Made by ${LEGAL_NAME}, Wolverhampton` as const

/** No trailing slash. Append explicitly where a path is needed. */
export const SITE_URL = 'https://www.jobsafe.cloud' as const

/** The bare apex. Requests here are redirected permanently to SITE_URL. */
export const APEX_HOST = 'jobsafe.cloud' as const

/**
 * The homepage canonical. Trailing slash, because that is what is served and
 * what the GSC property (`https://www.jobsafe.cloud/`) is registered against.
 * Sub-routes are canonicalised WITHOUT a trailing slash (Next.js default,
 * `trailingSlash: false`), which is correct and self-consistent.
 */
export const CANONICAL_HOME = `${SITE_URL}/` as const

/** Absolute, self-referencing canonical for any path. `'/'` → CANONICAL_HOME. */
export function canonicalFor(path: string): string {
  return path === '/' ? CANONICAL_HOME : `${SITE_URL}${path}`
}

/** Stable schema.org node identifiers, referenced by @id across the graph. */
export const SCHEMA_ID = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  software: `${SITE_URL}/#software`,
} as const

// ── NAP ──────────────────────────────────────────────────────────────────────
// Name / Address / Phone must be byte-identical here, on both app stores, on
// LinkedIn, and in every directory listing. Inconsistent NAP is the single
// cheapest way to lose an entity disambiguation fight.

export const PHONE_DISPLAY = '0333 8000 883' as const
export const PHONE_E164 = '+443338000883' as const
export const PHONE_HREF = 'tel:03338000883' as const

export const EMAIL_SALES = 'sales@jobsafe.cloud' as const
export const EMAIL_SUPPORT = 'support@jobsafe.cloud' as const
/** Data-protection enquiries. Routed to support until a DPO address exists. */
export const EMAIL_PRIVACY = EMAIL_SUPPORT

export const ADDRESS = {
  streetAddress: '86 Tettenhall Road',
  addressLocality: 'Wolverhampton',
  postalCode: 'WV1 4TF',
  addressCountry: 'GB',
} as const

/** The address on one line, for the footer and the contact page. */
export const ADDRESS_LINE = `${ADDRESS.streetAddress}, ${ADDRESS.addressLocality} ${ADDRESS.postalCode}` as const

/** Where the platform's data lives. Quoted on every page that talks about hosting. */
export const HOSTING_LINE = 'Hosted in London' as const
export const HOSTING_DETAIL = 'London region (Supabase on AWS eu-west-2)' as const

// ── Pricing ──────────────────────────────────────────────────────────────────
// Two licence types, priced per licence per month, ex VAT. Meta descriptions,
// JSON-LD `offers`, the chat widget, llms.txt and every pricing block read the
// values below — never a typed-out figure. Every displayed price carries
// VAT_SUFFIX so the site never quotes a number checkout will not charge.

export const CURRENCY = 'GBP' as const
export const CURRENCY_SYMBOL = '£' as const

/** Shown beside every price. Prices on this site are always ex VAT. */
export const VAT_SUFFIX = '+ VAT' as const
export const VAT_NOTE = 'All prices exclude VAT, which is charged at the prevailing UK rate.' as const

export interface PricingTier {
  /** Per licence, per month, ex VAT. `null` = bespoke / book a demo. */
  readonly price: number | null
  readonly threshold: string
  readonly popular?: boolean
}

export type LicenceId = 'worker' | 'admin'

export interface LicenceType {
  readonly id: LicenceId
  /** As checkout labels it. */
  readonly name: string
  /** Per licence, per month, ex VAT. */
  readonly price: number
  /** Who holds this licence and what it lets them do. */
  readonly summary: string
  readonly includes: readonly string[]
  /** Volume rates, if checkout applies any. The first tier is the entry price. */
  readonly volume?: readonly PricingTier[]
}

/** Worker volume tiers, as checkout applies them. */
export const PRICING_TIERS: readonly PricingTier[] = [
  { price: 3.0, threshold: 'Up to 500 licences' },
  { price: 2.75, threshold: '500–1,000 licences', popular: true },
  { price: null, threshold: '1,000+ licences' },
] as const

export const LICENCES: Readonly<Record<LicenceId, LicenceType>> = {
  worker: {
    id: 'worker',
    name: 'Worker',
    price: 3.0,
    summary: 'For the people doing the work. Report incidents, near misses and hazards from the app, online or off.',
    includes: [
      'Unlimited incident and near-miss reports',
      'Works offline, syncs when back in signal',
      'Photo, video and voice attachments',
      'Automatic GPS and timestamp on every report',
    ],
    volume: PRICING_TIERS,
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    price: 12.0,
    summary: 'For supervisors and safety leads. Review, assign and close reports from the dashboard.',
    includes: [
      'Real-time alerts when a report lands',
      'Dashboard analytics and site breakdowns',
      'Full audit trail on every report',
      'Export for insurers, clients and inspectors',
    ],
  },
} as const

/** The price a new customer pays for a Worker licence. Quote this in metadata. */
export const ENTRY_PRICE = LICENCES.worker.price

/** The Admin licence rate. Always quoted alongside the Worker rate. */
export const ADMIN_PRICE = LICENCES.admin.price

/**
 * Annual billing terms, exactly as checkout words them. Twelve months for the
 * price of ten: a yearly licence costs ANNUAL_MONTHS_CHARGED × the monthly rate.
 */
export const ANNUAL_TERMS = '2 months free' as const
export const ANNUAL_MONTHS_CHARGED = 10 as const

/** Formats a price the way the site displays it: `£3.00`. */
export function formatPrice(value: number): string {
  return `${CURRENCY_SYMBOL}${value.toFixed(2)}`
}

/** `£3.00 + VAT` — a price with the VAT suffix the site never omits. */
export function formatPriceExVat(value: number): string {
  return `${formatPrice(value)} ${VAT_SUFFIX}`
}

/** Per licence, per year, on annual billing: monthly × ANNUAL_MONTHS_CHARGED. */
export function annualPrice(monthly: number): number {
  return Math.round(monthly * ANNUAL_MONTHS_CHARGED * 100) / 100
}

/** `£3.00` — the canonical entry-price string. */
export const ENTRY_PRICE_LABEL = formatPrice(ENTRY_PRICE)

/** `£3.00 + VAT` — the entry price as it must appear in copy. */
export const ENTRY_PRICE_EX_VAT_LABEL = formatPriceExVat(ENTRY_PRICE)

/** `£12.00 + VAT` — the Admin rate as it must appear in copy. */
export const ADMIN_PRICE_EX_VAT_LABEL = formatPriceExVat(ADMIN_PRICE)

/**
 * `£2.75` — the 500–1,000 licence rate. Derived, never typed. Only ever quoted
 * alongside its threshold: on its own it is the price nobody actually pays.
 * Never put this in a meta description or in schema.
 */
export const VOLUME_PRICE_LABEL = formatPrice(PRICING_TIERS[1].price as number)

/** One line that states the whole price list, for copy that has room for it. */
export const PRICE_SUMMARY_LINE =
  `Worker licences from ${ENTRY_PRICE_EX_VAT_LABEL} per licence per month, Admin licences ${ADMIN_PRICE_EX_VAT_LABEL}. ` +
  `Annual billing: ${ANNUAL_TERMS}.`

// ── Offers ───────────────────────────────────────────────────────────────────
// There must be exactly ONE offer live at any moment. Two offers ~400px apart
// is not a promotion, it is a contradiction, and it reads as bait.

export const TRIAL = {
  /** 14 days, confirmed against checkout 25/09/2026. */
  days: 14,
  /**
   * Checkout takes a payment card at sign-up (confirmed 25/09/2026). The site
   * therefore never says "no card required". Flip this only when checkout
   * changes, and `trialSentence()` follows automatically.
   */
  cardRequired: true,
  label: '14-day free trial',
} as const

/** The one sentence the site uses to describe the trial. */
export function trialSentence(): string {
  return TRIAL.cardRequired
    ? `${TRIAL.label}. A payment card is taken at sign-up.`
    : `${TRIAL.label}. No card required.`
}

/*
 * The launch promotion — "the first 200 sign-ups get 6 months free" — has been
 * retired, along with the announcement ticker that carried it. It is not
 * paused behind a flag; the copy and the component are gone.
 *
 * Two pieces of history worth keeping, because both are easy to recreate:
 *
 * 1. The ticker originally rendered "· N spots remaining", where N came from a
 *    deterministic countdown from 200 to a floor of 11 across thirty days,
 *    unconnected to any sign-up and floored so it never reached zero. That is a
 *    fabricated statistic, and presented as remaining availability it is the
 *    kind of false-scarcity claim the DMCC Act 2024 and the CPUTRs treat as a
 *    banned commercial practice. If remaining places are ever shown again, the
 *    number must come from a real sign-ups endpoint and must be allowed to
 *    hit zero.
 *
 * 2. There is exactly ONE offer on the site at a time. That offer is now the
 *    free trial in `TRIAL` above. Any future promotion retires the trial line
 *    first — never both at once. The `single-offer` rule in scripts/seo-audit.mjs
 *    still guards this: it fires if a re-added LAUNCH_OFFER const in this file
 *    is switched on while the pricing section still advertises the trial.
 */

// ── App & entity links (the current app; unchanged in Phase 1) ───────────────

export const LOGIN_URL = 'https://app.jobsafe.cloud/login' as const
export const SIGNUP_TRIAL_URL = 'https://app.jobsafe.cloud/signup-trial' as const

export const PARENT_ORG_URL = 'https://jobmate.cloud' as const

/**
 * The sales demo booking link. Calendly owns the calendar, the confirmation
 * email and the reminders; the site's only job is to get people to it.
 *
 * Every "Book a demo" control on the site resolves to this constant, via
 * <BookDemoButton>. There is exactly ONE demo destination.
 *
 * The trailing path segment is the Calendly event's duration. If that event is
 * re-timed or renamed, change this URL and DEMO_DURATION_LABEL together, or the
 * page promises a slot length the booking screen does not offer.
 */
export const DEMO_BOOKING_URL = 'https://calendly.com/jobmate-sales/30min' as const

/** Reads out of the URL above. Quoted in CTA copy so the length is no surprise. */
export const DEMO_DURATION_LABEL = '30 minutes' as const

/** Public assets the site links to. */
export const BROCHURE_PATH = '/jobsafe-brochure.pdf' as const

// ── Phase 2 groundwork ───────────────────────────────────────────────────────
// The platform is not in production yet. Everything below is typed and empty by
// default; a component that reads an unset value must render the safe fallback
// ("Book a demo" → DEMO_BOOKING_URL) and never an invented number or URL.
// Preview deployments set NEXT_PUBLIC_PLATFORM_LAUNCH=true.

/** `true` only when NEXT_PUBLIC_PLATFORM_LAUNCH is exactly "true". */
export const PLATFORM_LAUNCH = process.env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true'

/**
 * Phase 2 routes call this and return `notFound()` while it is false; the
 * sitemap and nav leave them out. Wrapped in a function so tests can stub the
 * environment and so call sites read as a question, not a constant.
 */
export function isPlatformLaunched(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NEXT_PUBLIC_PLATFORM_LAUNCH === 'true'
}

/**
 * Phase 3 inputs. Each one answers "has the product shipped this?" and each
 * `false` limits what the site may say: a page gated on it is unbuilt (404,
 * out of the menu and the sitemap) and no copy claims the capability. The
 * brief left every value in brackets, so every value is `false`, the only
 * reading that cannot produce a false claim; each was checked against the
 * product code on 25/09/2026 (docs/PHASE-3.md). Flip one only when the
 * product ships it; the page, the menu item and the sitemap entry follow.
 */
export const PHASE_3_INPUTS = {
  /** Can customers create their own checklist templates in the platform? Gates /platform/checklists. */
  checklistBuilderShipped: false,
  /** Can customers add and edit contractors in the platform? Gates /platform/contractors. */
  contractorCrudShipped: false,
  /** Are owners emailed about actions? While false, copy says "the in-app bell". */
  emailAlertsShipped: false,
  /** Can records be imported from CSV? While false, compare pages say "Talk to us about moving your records". */
  csvImportShipped: false,
  /** Does the product generate PDFs? While false, nothing offers a PDF. */
  pdfExportShipped: false,
} as const

export type Phase3Input = keyof typeof PHASE_3_INPUTS

/**
 * The comparison pages (Part D) need sign-off before comparative advertising
 * goes live, so they sit behind their own flag as well as the launch flag.
 * `true` only when NEXT_PUBLIC_COMPARE_PAGES is exactly "true".
 */
export const COMPARE_PAGES = process.env.NEXT_PUBLIC_COMPARE_PAGES === 'true'

export function comparePagesEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NEXT_PUBLIC_COMPARE_PAGES === 'true'
}

/** Reads an optional absolute URL from the environment. Empty → null. */
export function optionalUrl(name: string, env: NodeJS.ProcessEnv = process.env): string | null {
  const value = env[name]?.trim()
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

/** Where the new platform lives. Unset until Phase 2 goes live. */
export const PLATFORM_APP_URL = optionalUrl('NEXT_PUBLIC_PLATFORM_APP_URL')
export const PLATFORM_SIGNUP_URL = optionalUrl('NEXT_PUBLIC_PLATFORM_SIGNUP_URL')
export const PLATFORM_LOGIN_URL = optionalUrl('NEXT_PUBLIC_PLATFORM_LOGIN_URL')
/** The open live demo of the platform. Unset until it is public. */
export const LIVE_DEMO_URL = optionalUrl('NEXT_PUBLIC_LIVE_DEMO_URL')
/** Phase 2 demo booking. Unset → every demo control falls back to DEMO_BOOKING_URL. */
export const BOOK_DEMO_URL = optionalUrl('NEXT_PUBLIC_BOOK_DEMO_URL')

/** The safe fallback for any unset Phase 2 call to action. */
export const FALLBACK_CTA = { label: 'Book a demo', href: DEMO_BOOKING_URL } as const

export interface Cta {
  readonly label: string
  readonly href: string
}

/** Resolves an optional Phase 2 URL to a CTA, or to the fallback if unset. */
export function ctaFor(url: string | null, label: string): Cta {
  return url ? { label, href: url } : FALLBACK_CTA
}

export type PriceBookTierId = 'essentials' | 'professional' | 'enterprise'

export interface PriceBookTier {
  readonly id: PriceBookTierId
  readonly name: string
  /** Per user, per month, ex VAT. `null` = not yet set, or bespoke. */
  readonly pricePerUserMonthExVat: number | null
  /** e.g. "2 months free". `null` = not yet set. */
  readonly annualTerms: string | null
  /** What the tier includes, in the words the price list uses. */
  readonly includedModules: readonly string[]
  /** A label instead of a number, e.g. "Talk to us" for a bespoke tier. */
  readonly priceNote?: string
}

/** Shown wherever a tier's price is not set. Never a number. */
export const PRICE_UNSET_LABEL = 'Book a demo for pricing' as const

/**
 * The Phase 2 price book. Every tier is empty by default; `priceBookLabel()`
 * renders "Book a demo" for an unset price and never a number nobody agreed.
 */
export const PRICE_BOOK: Readonly<Record<PriceBookTierId, PriceBookTier>> = {
  // Prices and annual terms are still open inputs (the brief left them in
  // brackets), so they stay null and every page renders PRICE_UNSET_LABEL.
  essentials: {
    id: 'essentials',
    name: 'Essentials',
    pricePerUserMonthExVat: null,
    annualTerms: null,
    includedModules: ['Incident and near-miss reporting', 'Investigations', 'Corrective actions', 'RIDDOR', 'Dashboard', 'SOS', 'Sites and people', 'Offline app'],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    pricePerUserMonthExVat: null,
    annualTerms: null,
    includedModules: ['Everything in Essentials', 'Risk assessments and bowtie', 'Permits and contractors', 'Checklists', 'Fleet and plant', 'Training', 'Documents'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    pricePerUserMonthExVat: null,
    annualTerms: null,
    priceNote: 'Talk to us',
    includedModules: ['Everything in Professional', 'Onboarding', 'Invoicing', 'SLAs'],
  },
} as const

/** `£x.xx + VAT per user per month`, the tier's own note, or the unset label. Never an invented number. */
export function priceBookLabel(tier: PriceBookTier): string {
  if (tier.pricePerUserMonthExVat !== null) return `${formatPriceExVat(tier.pricePerUserMonthExVat)} per user per month`
  return tier.priceNote ?? PRICE_UNSET_LABEL
}

/** True once at least one tier has a number, i.e. prices may be published and put in schema. */
export function priceBookHasPrices(): boolean {
  return Object.values(PRICE_BOOK).some((tier) => tier.pricePerUserMonthExVat !== null)
}

// ── Entity links ─────────────────────────────────────────────────────────────

/**
 * `sameAs` — the entity disambiguation payload. jobsafe competes for its own
 * name with jobsafe.co.nz, jobsafe Pro, a Swedish entity and a Polish PPE
 * brand. These links are how a crawler tells us apart from them.
 *
 * Add Companies House and the four SaaS directories (G2, Capterra, GetApp,
 * Software Advice) as soon as those listings are claimed — see P0-8.
 */
export const SAME_AS: readonly string[] = [
  'https://uk.linkedin.com/company/jobmate-cloud',
  'https://x.com/JobmateCloud',
  'https://www.instagram.com/jobmateltd/',
  'https://play.google.com/store/apps/details?id=cloud.jobsafe.jobsafeapp',
  'https://apps.apple.com/gb/app/jobsafe/id6767254776',
] as const

export const SOCIAL = {
  linkedin: SAME_AS[0],
  x: SAME_AS[1],
  instagram: SAME_AS[2],
} as const

/**
 * The X account that actually exists. The site previously declared
 * `twitter:site` as `@jobsafecloud`, which does not resolve; the verified
 * handle in `SAME_AS` is `JobmateCloud`.
 */
export const TWITTER_HANDLE = '@JobmateCloud' as const

// ── Open Graph ───────────────────────────────────────────────────────────────
// Every route generates its own 1200×630 image with next/og (see lib/og.tsx).
// The static file below is the light-theme fallback used by JSON-LD nodes that
// want a plain image URL. `npm run seo:audit` reads the PNG header and fails
// if it drifts from 1200×630.

export const OG_IMAGE = {
  path: '/images/og-image.png',
  width: 1200,
  height: 630,
  alt: 'jobsafe — workplace incident reporting software',
} as const

/**
 * The wordmark on light: ink "job", crimson "safe". Exported at 1× (300×97)
 * and 2× (600×194) in PNG and WebP. A vector SVG is still needed from design.
 */
export const WORDMARK = {
  src: '/images/brand/jobsafe-wordmark.png',
  src2x: '/images/brand/jobsafe-wordmark@2x.png',
  webp: '/images/brand/jobsafe-wordmark.webp',
  webp2x: '/images/brand/jobsafe-wordmark@2x.webp',
  width: 300,
  height: 97,
  alt: BRAND,
} as const

/** Used in schema.org `logo`. The 2× wordmark is the crispest asset we have. */
export const LOGO_PATH = WORDMARK.src2x

// ── Analytics ────────────────────────────────────────────────────────────────
// Loaded only after analytics consent (components/site/Analytics.tsx).

export const GA4_MEASUREMENT_ID = 'G-72H4Q5HDVL' as const

// ── Copy guards ──────────────────────────────────────────────────────────────
//
// The lists of forbidden brand casings, of features jobsafe does not have, of
// unsourced numbers and of retired maker lines deliberately live in
// `scripts/seo-audit.mjs` rather than here. They are lint rules, not
// application constants: nothing at runtime reads them, and spelling the
// forbidden terms out inside a file the site imports would be a small, silly
// way to violate the very rules they encode.
