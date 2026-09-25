// ─────────────────────────────────────────────────────────────────────────────
// Cookie consent — PECR reg. 6 and UK GDPR.
//
// One cookie, `jobsafe_consent`, holds the visitor's choice for six months.
// Nothing non-essential (GA4, Speed Insights) loads until the matching
// category is granted; see components/site/Analytics.tsx. The banner and the
// "Cookie settings" footer link both go through the tiny store below so every
// consumer re-renders when the choice changes.
//
// Safe to import from server and client code: nothing here touches `document`
// until a function is called in the browser.
// ─────────────────────────────────────────────────────────────────────────────

export const CONSENT_COOKIE = 'jobsafe_consent' as const

/** Bump when the categories or their meaning change; old cookies are ignored. */
export const CONSENT_VERSION = 1 as const

/** Six months, the longest the ICO considers reasonable without re-asking. */
export const CONSENT_MAX_AGE_SECONDS = 182 * 24 * 60 * 60

export type ConsentCategory = 'analytics' | 'marketing'

export interface Consent {
  readonly version: typeof CONSENT_VERSION
  /** ISO timestamp of the choice. */
  readonly at: string
  readonly analytics: boolean
  readonly marketing: boolean
}

export const CONSENT_CATEGORIES: readonly {
  readonly id: ConsentCategory
  readonly name: string
  readonly description: string
}[] = [
  {
    id: 'analytics',
    name: 'Analytics',
    description:
      'Google Analytics 4 and Vercel Speed Insights, so we can see which pages are read and how fast they load. Off until you say yes.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description:
      'Advertising and remarketing tags. We do not run any today; the category exists so that if we ever do, nothing loads without your say-so.',
  },
] as const

export function serialiseConsent(consent: Consent): string {
  return encodeURIComponent(JSON.stringify(consent))
}

export function parseConsent(raw: string | null | undefined): Consent | null {
  if (!raw) return null
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as Partial<Consent>
    if (value.version !== CONSENT_VERSION) return null
    if (typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean') return null
    return {
      version: CONSENT_VERSION,
      at: typeof value.at === 'string' ? value.at : new Date(0).toISOString(),
      analytics: value.analytics,
      marketing: value.marketing,
    }
  } catch {
    return null
  }
}

/** Reads the consent cookie out of a raw `document.cookie` string. */
export function readConsentFromCookieString(cookieString: string): Consent | null {
  const pair = cookieString
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`))
  return parseConsent(pair ? pair.slice(CONSENT_COOKIE.length + 1) : null)
}

// ── Browser store ────────────────────────────────────────────────────────────

type Listener = () => void
const listeners = new Set<Listener>()
let snapshot: Consent | null | undefined
let settingsRequested = false

function notify() {
  for (const listener of listeners) listener()
}

/** The current choice, or null when the visitor has not chosen yet. */
export function getConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  if (snapshot === undefined) snapshot = readConsentFromCookieString(document.cookie)
  return snapshot
}

/** Persists a choice for six months and tells every subscriber. */
export function setConsent(choice: { analytics: boolean; marketing: boolean }): Consent {
  const consent: Consent = {
    version: CONSENT_VERSION,
    at: new Date().toISOString(),
    analytics: choice.analytics,
    marketing: choice.marketing,
  }
  if (typeof document !== 'undefined') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CONSENT_COOKIE}=${serialiseConsent(consent)}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`
  }
  snapshot = consent
  settingsRequested = false
  notify()
  return consent
}

/** Opens the banner's "Choose" panel from anywhere (the footer link). */
export function openConsentSettings(): void {
  settingsRequested = true
  notify()
}

export function isSettingsRequested(): boolean {
  return settingsRequested
}

export function closeConsentSettings(): void {
  settingsRequested = false
  notify()
}

export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Server snapshot for useSyncExternalStore: no document, no consent. */
export function getServerConsent(): Consent | null {
  return null
}
