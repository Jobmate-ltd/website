'use client'

import * as React from 'react'
import { DEMO_DURATION_LABEL } from '@/lib/brand'
import { BookDemoButton } from '@/components/ui/book-demo-button'

/**
 * StickyDemoBar — the persistent demo CTA on small screens.
 *
 * On desktop the sticky header already carries "Book a demo", so this is
 * `lg:hidden`. Appears once the visitor has scrolled past roughly one phone
 * viewport, driven by an IntersectionObserver on a sentinel rather than a
 * scroll listener. Sits below the consent banner (z-70) and the chat (z-60).
 */
const REVEAL_AFTER_PX = 620

export function StickyDemoBar() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText = `position:absolute;top:${REVEAL_AFTER_PX}px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;`
    document.body.appendChild(sentinel)
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-line-1 bg-canvas/95 backdrop-blur-md animate-rise-in print:hidden lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 leading-tight">
          <p className="text-[13px] font-bold text-ink-1">See it on your sites</p>
          <p className="text-[11px] text-ink-5">{DEMO_DURATION_LABEL}, no obligation</p>
        </div>
        <BookDemoButton placement="mobile-sticky-bar" size="sm" className="shrink-0" />
      </div>
    </div>
  )
}

export default StickyDemoBar
