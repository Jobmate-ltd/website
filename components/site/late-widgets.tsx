'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

/**
 * LateWidgets — the floating UI nobody needs in the first second.
 *
 * The chat widget, the mobile demo bar, the consent banner and the analytics
 * loader are all client-only. Mounting them after the browser goes idle keeps
 * their code out of the initial bundle and their hydration off the main
 * thread while the hero paints (Lighthouse TBT and LCP on a slow phone).
 * None of them has server-rendered content to lose, so `ssr: false` costs
 * nothing.
 *
 * The consent banner still appears within a couple of seconds of arrival —
 * `requestIdleCallback` is capped at IDLE_TIMEOUT_MS so a busy page cannot
 * postpone it — and nothing non-essential can load until it has been
 * answered, because Analytics reads the same consent store.
 *
 * @example
 *   // app/layout.tsx, after <Footer />
 *   <LateWidgets />
 */
const ChatWidget = dynamic(() => import('./chat-widget').then((m) => m.ChatWidget), { ssr: false })
const StickyDemoBar = dynamic(() => import('./sticky-demo-bar').then((m) => m.StickyDemoBar), { ssr: false })
const ConsentBanner = dynamic(() => import('./consent-banner').then((m) => m.ConsentBanner), { ssr: false })
const Analytics = dynamic(() => import('./analytics').then((m) => m.Analytics), { ssr: false })

const IDLE_TIMEOUT_MS = 1500

export function LateWidgets() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: IDLE_TIMEOUT_MS })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setReady(true), IDLE_TIMEOUT_MS)
    return () => window.clearTimeout(id)
  }, [])

  if (!ready) return null
  return (
    <>
      <ChatWidget />
      <StickyDemoBar />
      <ConsentBanner />
      <Analytics />
    </>
  )
}
