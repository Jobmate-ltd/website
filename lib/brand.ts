// ─────────────────────────────────────────────────────────────────────────────
// jobsafe — brand & entity constants. SINGLE SOURCE OF TRUTH.
//
// Every price, phone number, address, URL and social profile on the marketing
// site must be read from this file. Nothing here may be duplicated as a string
// literal elsewhere: `npm run seo:audit` fails the build if it is.
//
// Rules encoded here (see SEO Operating Instructions §0):
//   1. The brand is `jobsafe` — always lowercase. Sentence-start is no exception.
//   2. UK English. Dates DD/MM/YYYY.
//   7. Never fabricate customers, testimonials, ratings or statistics.
//
// Last verified against live Chargebee/site data: 09/07/2026.
// ─────────────────────────────────────────────────────────────────────────────

/** The brand string. Lowercase. Always. */
export const BRAND = 'jobsafe' as const

/** Registered legal entity behind the product. */
export const LEGAL_NAME = 'Jobmate Ltd' as const

/** No trailing slash. Append explicitly where a path is needed. */
export const SITE_URL = 'https://www.jobsafe.cloud' as const

/**
 * The homepage canonical. Trailing slash, because that is what is served and
 * what the GSC property (`https://www.jobsafe.cloud/`) is registered against.
 * Sub-routes are canonicalised WITHOUT a trailing slash (Next.js default,
 * `trailingSlash: false`), which is correct and self-consistent.
 */
export const CANONICAL_HOME = `${SITE_URL}/` as const

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

export const ADDRESS = {
  streetAddress: '86 Tettenhall Road',
  addressLocality: 'Wolverhampton',
  postalCode: 'WV1 4TF',
  addressCountry: 'GB',
} as const

// ── Pricing ──────────────────────────────────────────────────────────────────
// The entry price is what a new customer actually pays. Meta descriptions,
// JSON-LD `offers`, and the chat widget must all quote ENTRY_PRICE — never the
// volume rate — or the snippet promises a price the landing page does not honour.

export const CURRENCY = 'GBP' as const
export const CURRENCY_SYMBOL = '£' as const

export interface PricingTier {
  /** Per licence, per month, ex VAT. `null` = bespoke / contact sales. */
  readonly price: number | null
  readonly threshold: string
  readonly popular?: boolean
}

export const PRICING_TIERS: readonly PricingTier[] = [
  { price: 3.0, threshold: 'Up to 500 licences' },
  { price: 2.75, threshold: '500–1,000 licences', popular: true },
  { price: null, threshold: '1,000+ licences' },
] as const

/** The price a new customer pays. Quote this, and only this, in metadata. */
export const ENTRY_PRICE = 3.0 as const

/** Annual billing discount, applied to the per-licence rate. */
export const ANNUAL_DISCOUNT = 0.1 as const

/** Formats a price the way the site displays it: `£3.00`. */
export function formatPrice(value: number): string {
  return `${CURRENCY_SYMBOL}${value.toFixed(2)}`
}

/** `£3.00` — the canonical entry-price string. */
export const ENTRY_PRICE_LABEL = formatPrice(ENTRY_PRICE)

/**
 * `£2.75` — the 500–1,000 licence rate. Derived, never typed. Only ever quoted
 * alongside its threshold: on its own it is the price nobody actually pays.
 * Never put this in a meta description or in schema.
 */
export const VOLUME_PRICE_LABEL = formatPrice(PRICING_TIERS[1].price as number)

// ── Offers ───────────────────────────────────────────────────────────────────
// There must be exactly ONE offer live at any moment. Two offers ~400px apart
// is not a promotion, it is a contradiction, and it reads as bait.

export const TRIAL = {
  /** 14 days, confirmed 14/07/2026 (previously 3). */
  days: 14,
  /**
   * Verify against the Chargebee signup configuration before changing.
   * As of 09/07/2026 the site claims no card is required. Chargebee appears to
   * require one. THIS IS UNRESOLVED — see docs/SEO-P0.md, item P0-2.
   */
  cardRequired: false,
  label: '14-day free trial. No credit card required.',
} as const

/**
 * The launch promotion.
 *
 * `enabled` is deliberately `false` until Adam confirms which offer is real.
 * The previous implementation ran a *simulated* depletion counter — a
 * deterministic countdown from 200 to a floor of 11 that "never hits zero" to
 * "keep some urgency". That is a fabricated statistic (§0.7) and, presented as
 * remaining stock, a false-scarcity claim of the kind the DMCC Act 2024 and the
 * CPUTRs treat as a banned commercial practice. The counter has been removed
 * outright rather than made accurate. Do not reinstate it.
 *
 * If the "6 months free" offer is real, set `enabled: true` and REMOVE the
 * free-trial line from the pricing section. Never run both.
 */
export const LAUNCH_OFFER = {
  enabled: false,
  headline: 'jobsafe is live — sign-ups now open',
  /** Copy to use if, and only if, the promotion is confirmed and the trial line is retired. */
  promotionalHeadline: 'jobsafe is live — the first 200 sign-ups get 6 months free',
} as const

// ── App & entity links ───────────────────────────────────────────────────────

export const LOGIN_URL = 'https://app.jobsafe.cloud/login' as const
export const SIGNUP_TRIAL_URL = 'https://app.jobsafe.cloud/signup-trial' as const

export const PARENT_ORG_URL = 'https://jobmate.cloud' as const

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

/**
 * The X account that actually exists. The site previously declared
 * `twitter:site` as `@jobsafecloud`, which does not resolve; the verified
 * handle in `SAME_AS` is `JobmateCloud`.
 */
export const TWITTER_HANDLE = '@JobmateCloud' as const

// ── Open Graph ───────────────────────────────────────────────────────────────
// The spec is 1200×630. The asset shipped at 1203×633, which some crawlers
// letterbox. `npm run seo:audit` reads the PNG header and fails if it drifts.

export const OG_IMAGE = {
  path: '/images/og-image.png',
  width: 1200,
  height: 630,
  alt: 'jobsafe — workplace incident reporting software',
} as const

export const LOGO_PATH = '/images/jobsafe_logo-removebg-preview.png' as const

// ── Copy guards ──────────────────────────────────────────────────────────────
//
// The lists of forbidden brand casings, and of features jobsafe does not have,
// deliberately live in `scripts/seo-audit.mjs` rather than here. They are lint
// rules, not application constants: nothing at runtime reads them, and spelling
// the forbidden terms out inside a file the site imports would be a small,
// silly way to violate the very rules they encode. The audit found this exact
// mistake in an earlier draft of this file, which is rather the point of it.

