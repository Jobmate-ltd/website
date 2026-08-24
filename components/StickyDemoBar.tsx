'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import BookDemoButton from '@/components/ui/book-demo-button'

/**
 * StickyDemoBar — the persistent demo CTA on small screens.
 *
 * On desktop the sticky navbar already carries a brand-red "Book a demo" that
 * never leaves the viewport, so this is `lg:hidden`. On a phone the navbar's
 * other actions collapse into the menu sheet, and the hero CTA scrolls away
 * within a screen, so without this the demo is two taps away for the entire
 * length of the page. This puts it back to one.
 *
 * Reveal is driven by an IntersectionObserver watching a 1px sentinel pinned
 * REVEAL_AFTER_PX down the *document*. Two things make that the right tool:
 *
 *  1. No scroll listener, so nothing runs per scroll frame on the phones least
 *     able to afford it.
 *  2. framer-motion's `useScroll()` does not work on this site. The root element
 *     carries `h-full` (`app/layout.tsx`), so `document.documentElement` measures
 *     one viewport while `body` is the thing that overflows; useScroll reads the
 *     root as unscrollable and its `scrollY` never changes. Verified in the
 *     browser: the `change` handler was never called at any offset. Do not swap
 *     this back to useScroll without removing `h-full` first.
 *
 * The sentinel uses `position: absolute` with no positioned ancestor, so its
 * containing block is the initial containing block, which is anchored to the
 * document origin rather than the viewport. `top: 620px` therefore means 620px
 * down the page, and stays there.
 *
 * z-[55]: above the sticky navbar (z-50) and the grain overlay (z-40), below
 * the chat widget (z-60) so an open chat panel is never trapped underneath.
 */

/** Roughly one phone viewport. Past this, the hero and its CTA are behind them. */
const REVEAL_AFTER_PX = 620

export default function StickyDemoBar() {
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText = `position:absolute;top:${REVEAL_AFTER_PX}px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;`
    document.body.appendChild(sentinel)

    const observer = new IntersectionObserver(([entry]) => {
      // Past it (scrolled down), not merely off-screen: `top < 0` means the mark
      // is above the viewport, which is the only direction that counts.
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-white/10 bg-surface-1/95 backdrop-blur-xl backdrop-saturate-150 print:hidden lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0 leading-tight">
              <p className="text-[13px] font-bold text-white">See it on your sites</p>
              <p className="text-[11px] text-white/45">30 minutes, no obligation</p>
            </div>
            <BookDemoButton placement="mobile-sticky-bar" size="md" className="shrink-0" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
