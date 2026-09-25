'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Reveal — a restrained reveal-on-scroll that can never hide content.
 *
 * The element renders visible. On mount, only if it is below the fold and the
 * visitor has not asked for reduced motion, it is set to `pending` and an
 * IntersectionObserver flips it to `in` (once) as it scrolls into view. If
 * JavaScript never runs, or the observer never fires, nothing is hidden.
 * `index` staggers a group by 60ms per step.
 *
 * @example
 *   <Reveal index={1}><Card … /></Reveal>
 */
export function Reveal({
  index = 0,
  as: Tag = 'div',
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { index?: number; as?: 'div' | 'li' | 'article' | 'section' }) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    // The observer's first callback says whether the element is on screen, so
    // there is no getBoundingClientRect() here: a synchronous read right after
    // hydration forces layout on every Reveal on the page.
    let first = true
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        if (first) {
          first = false
          if (visible) {
            observer.disconnect() // already on screen: leave it visible
            return
          }
          el.dataset.reveal = 'pending'
          return
        }
        if (visible) {
          el.dataset.reveal = 'in'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    // @ts-expect-error -- the ref is typed for the union of tags we allow
    <Tag ref={ref} className={cn(className)} style={{ ...style, '--reveal-delay': `${index * 60}ms` } as React.CSSProperties} {...props}>
      {children}
    </Tag>
  )
}

export default Reveal
