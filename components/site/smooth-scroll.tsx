'use client'

import * as React from 'react'
import type Lenis from 'lenis'

/**
 * SmoothScroll — eased, inertial scrolling for the whole site, with Lenis
 * (https://lenis.darkroom.engineering, MIT). Mounted once in app/layout.tsx.
 *
 * Lenis smooths the real document scroll rather than faking it with a
 * transform, so `position: sticky`, IntersectionObserver (Reveal, the sticky
 * story), find-in-page, keyboard scrolling and assistive tech all behave as
 * they do natively.
 *
 * - Loaded after hydration with a dynamic import, so it never sits on the
 *   critical path or competes with the hero for bandwidth.
 * - Never starts under `prefers-reduced-motion`, and stops if the visitor
 *   switches it on mid-visit.
 * - Same-page anchor links glide to their target and land below the sticky
 *   header: Lenis reads the 88px `scroll-padding-top` on <html> (and any
 *   `scroll-margin-top` on the target) itself, so there is no offset here.
 * - Pauses while anything locks the page (a Radix dialog or sheet marks the
 *   body `data-scroll-locked`; the Phase 1 menu sets `overflow: hidden`), and
 *   leaves anything that scrolls on its own (a dialog, a `[data-lenis-prevent]`
 *   region) to scroll natively.
 * - Stops any glide the moment an internal link is followed, so the next page
 *   opens at its top.
 */
function scrollLocked(): boolean {
  const body = document.body
  return body.hasAttribute('data-scroll-locked') || getComputedStyle(body).overflow === 'hidden' || getComputedStyle(document.documentElement).overflow === 'hidden'
}

export function SmoothScroll() {
  React.useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cancelled = false
    let instance: Lenis | null = null
    let lockObserver: MutationObserver | null = null

    const stop = () => {
      lockObserver?.disconnect()
      lockObserver = null
      instance?.destroy()
      instance = null
    }

    const start = async () => {
      if (motion.matches || instance) return
      const { default: LenisClass } = await import('lenis')
      if (cancelled || motion.matches || instance) return
      instance = new LenisClass({
        autoRaf: true,
        lerp: 0.1,
        wheelMultiplier: 1,
        anchors: true,
        stopInertiaOnNavigate: true,
        prevent: (node) => node.matches('dialog, [role="dialog"], [data-radix-popper-content-wrapper]'),
      })
      const lenis = instance
      const sync = () => (scrollLocked() ? lenis.stop() : lenis.start())
      lockObserver = new MutationObserver(sync)
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class', 'data-scroll-locked'] })
      lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
      sync()
    }

    const onMotionChange = () => (motion.matches ? stop() : void start())

    void start()
    motion.addEventListener('change', onMotionChange)
    return () => {
      cancelled = true
      motion.removeEventListener('change', onMotionChange)
      stop()
    }
  }, [])

  return null
}

export default SmoothScroll
