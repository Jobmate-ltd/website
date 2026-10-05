'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

/**
 * RouteProgress — a 2px crimson line across the top of the viewport while
 * the next page is on its way (the `route-progress` rule in app/globals.css).
 * Mounted once in app/layout.tsx; hidden under `prefers-reduced-motion` and
 * from assistive tech (the page change itself is what gets announced).
 *
 * It starts when an internal link to another page is followed (a click that
 * Next's <Link> or the browser will turn into a navigation: same origin, no
 * modifier keys, no `target`, no `download`) or on back/forward, trickles
 * towards 90% while the page loads, and completes when the pathname changes.
 * A safety timeout clears it if a navigation never lands.
 *
 * It also marks the document `data-loaded` once the first-paint animation
 * has played, so pages mounted by later client navigations do not replay it
 * underneath their view transition (see `.page-enter` in globals.css).
 */
const FIRST_PAINT_MS = 900
const SAFETY_MS = 10_000

type Phase = 'idle' | 'loading' | 'done'

function isPageNavigation(event: MouseEvent): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  const anchor = (event.target as Element | null)?.closest?.('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return false
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return false
  return url.pathname !== window.location.pathname
}

export function RouteProgress() {
  const pathname = usePathname()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [progress, setProgress] = React.useState(0)
  const pathRef = React.useRef(pathname)

  React.useEffect(() => {
    pathRef.current = pathname
  }, [pathname])

  React.useEffect(() => {
    const id = window.setTimeout(() => document.documentElement.setAttribute('data-loaded', ''), FIRST_PAINT_MS)
    return () => window.clearTimeout(id)
  }, [])

  React.useEffect(() => {
    const begin = () => {
      document.documentElement.setAttribute('data-loaded', '')
      setPhase('loading')
      setProgress(0.12)
    }
    // Bubble phase on the document: Next's <Link> has already run (React
    // listens on the root), so a click it chose not to handle is still seen.
    const onClick = (event: MouseEvent) => {
      if (isPageNavigation(event)) begin()
    }
    // Back/forward to another page (not a hash change on this one).
    const onPopState = () => {
      if (window.location.pathname !== pathRef.current) begin()
    }
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Trickle: close a tenth of the remaining gap every 200ms, never past 90%,
  // and never backwards (a tick can land after the page has completed it).
  React.useEffect(() => {
    if (phase !== 'loading') return
    const trickle = window.setInterval(() => setProgress((p) => (p >= 0.9 ? p : Math.min(0.9, p + (0.9 - p) * 0.1))), 200)
    const safety = window.setTimeout(() => {
      setPhase('done')
      setProgress(1)
    }, SAFETY_MS)
    return () => {
      window.clearInterval(trickle)
      window.clearTimeout(safety)
    }
  }, [phase])

  // The new page has rendered: run to the end, then fade and reset. Derived
  // while rendering (React's pattern for state that follows a prop), so the
  // bar never paints a frame behind the new page.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (phase === 'loading') {
      setPhase('done')
      setProgress(1)
    }
  }

  React.useEffect(() => {
    if (phase !== 'done') return
    const id = window.setTimeout(() => {
      setPhase('idle')
      setProgress(0)
    }, 650)
    return () => window.clearTimeout(id)
  }, [phase])

  return (
    <div
      aria-hidden="true"
      className="route-progress"
      style={{
        transform: `scaleX(${progress})`,
        opacity: phase === 'loading' ? 1 : 0,
        transitionDuration: phase === 'idle' ? '0ms' : undefined,
      }}
    />
  )
}

export default RouteProgress
