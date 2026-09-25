// ─────────────────────────────────────────────────────────────────────────────
// Analytics events, consent-respecting.
//
// `track()` is the only way a component sends an event. It is a no-op unless
// the visitor has granted analytics consent AND the GA4 tag has loaded (both
// happen in components/site/analytics.tsx); it never throws and never blocks
// a navigation. Event names are typed so a typo cannot create a new metric.
// ─────────────────────────────────────────────────────────────────────────────

import { getConsent } from './consent.ts'

export type AnalyticsEvent =
  | 'book_demo_click'
  | 'lead_form_submitted'
  | 'tour_started'
  | 'tour_completed'
  | 'pricing_toggle'
  | 'calculator_used'
  | 'signal_toggle_used'

export type AnalyticsParams = Record<string, string | number | boolean>

type Gtag = (...args: unknown[]) => void

function gtag(): Gtag | null {
  if (typeof window === 'undefined') return null
  const fn = (window as unknown as { gtag?: Gtag }).gtag
  return typeof fn === 'function' ? fn : null
}

/** Sends a GA4 event if, and only if, analytics consent has been given and the tag is present. */
export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): boolean {
  if (typeof window === 'undefined') return false
  if (getConsent()?.analytics !== true) return false
  const fn = gtag()
  if (!fn) return false
  try {
    fn('event', event, params)
    return true
  } catch {
    return false
  }
}
