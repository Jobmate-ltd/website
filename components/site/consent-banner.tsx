'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  CONSENT_CATEGORIES,
  closeConsentSettings,
  getConsent,
  getServerConsent,
  isSettingsRequested,
  setConsent,
  subscribeConsent,
  type Consent,
} from '@/lib/consent'
import { Button } from '@/components/ui/button'

/**
 * ConsentBanner — cookie consent under PECR and UK GDPR.
 *
 * Shown until a choice is stored (six months), and again whenever the footer's
 * "Cookie settings" link asks for it. Accept and Reject carry equal weight;
 * "Choose" opens a panel with an analytics and a marketing toggle. Nothing
 * non-essential loads until the matching category is granted — see
 * <Analytics/>. Rendered only on the client, after the cookie has been read,
 * so the server never paints a banner the visitor has already dismissed.
 *
 * @example
 *   <ConsentBanner />   // once, in the root layout
 */
export function useConsent(): Consent | null {
  return React.useSyncExternalStore(subscribeConsent, getConsent, getServerConsent)
}

function useSettingsRequested(): boolean {
  return React.useSyncExternalStore(subscribeConsent, isSettingsRequested, () => false)
}

export function ConsentBanner() {
  const consent = useConsent()
  const settingsRequested = useSettingsRequested()
  const [mounted, setMounted] = React.useState(false)
  const [choosing, setChoosing] = React.useState(false)
  const [analytics, setAnalytics] = React.useState(false)
  const [marketing, setMarketing] = React.useState(false)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const id = React.useId()

  React.useEffect(() => setMounted(true), [])

  // The footer link opens straight into the Choose panel, pre-filled.
  React.useEffect(() => {
    if (settingsRequested) {
      setAnalytics(consent?.analytics ?? false)
      setMarketing(consent?.marketing ?? false)
      setChoosing(true)
      headingRef.current?.focus()
    }
  }, [settingsRequested, consent])

  const open = mounted && (consent === null || settingsRequested)

  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && consent !== null) closeConsentSettings()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, consent])

  if (!open) return null

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    setConsent(choice)
    setChoosing(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-desc`}
      className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 print:hidden"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="mx-auto max-w-3xl rounded-control border border-line-1 bg-canvas p-5 shadow-frame sm:p-6">
        <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1} className="type-h3 text-ink-1 outline-none">
          Cookies on jobsafe.cloud
        </h2>
        <p id={`${id}-desc`} className="type-small mt-2 text-ink-4">
          We use one essential cookie to remember this choice. Analytics cookies are off until you allow them, and we run no
          marketing cookies at all. You can change your mind at any time from &ldquo;Cookie settings&rdquo; in the footer.{' '}
          <Link href="/cookies" className="font-semibold text-brand-strong underline underline-offset-2">
            See every cookie and script
          </Link>
          .
        </p>

        {choosing ? (
          <form
            className="mt-5 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              decide({ analytics, marketing })
            }}
          >
            <fieldset className="flex flex-col divide-y divide-line-1 rounded-control border border-line-1">
              <legend className="sr-only">Choose which cookies to allow</legend>
              <div className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-bold text-ink-1">Necessary</p>
                  <p className="type-small mt-0.5 text-ink-5">The consent cookie itself. Always on, because without it we would have to ask you again on every page.</p>
                </div>
                <span className="mt-0.5 shrink-0 rounded-pill bg-neutral-tint px-2.5 py-1 text-[12px] font-bold text-neutral-text">Always on</span>
              </div>
              {CONSENT_CATEGORIES.map((category) => {
                const checked = category.id === 'analytics' ? analytics : marketing
                const set = category.id === 'analytics' ? setAnalytics : setMarketing
                return (
                  <div key={category.id} className="flex items-start justify-between gap-4 p-4">
                    <label htmlFor={`${id}-${category.id}`} className="cursor-pointer">
                      <span className="block text-sm font-bold text-ink-1">{category.name}</span>
                      <span className="type-small mt-0.5 block text-ink-5">{category.description}</span>
                    </label>
                    <input
                      id={`${id}-${category.id}`}
                      type="checkbox"
                      role="switch"
                      aria-checked={checked}
                      checked={checked}
                      onChange={(event) => set(event.target.checked)}
                      className="mt-1 size-5 shrink-0 cursor-pointer accent-brand-strong"
                    />
                  </div>
                )
              })}
            </fieldset>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" size="md" onClick={() => (consent === null ? setChoosing(false) : closeConsentSettings())}>
                Back
              </Button>
              <Button type="submit" variant="dark" size="md">
                Save choices
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="secondary" size="md" onClick={() => setChoosing(true)}>
              Choose
            </Button>
            <Button type="button" variant="dark" size="md" onClick={() => decide({ analytics: false, marketing: false })}>
              Reject all
            </Button>
            <Button type="button" variant="dark" size="md" onClick={() => decide({ analytics: true, marketing: true })}>
              Accept all
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsentBanner
