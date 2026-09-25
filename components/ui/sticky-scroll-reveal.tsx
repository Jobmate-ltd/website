'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { FrameScope } from '@/components/ui/frame-scope'

/**
 * StickyScroll — Aceternity UI `sticky-scroll-reveal`
 * (https://ui.aceternity.com/components/sticky-scroll-reveal, MIT), rebuilt
 * for a light page: the steps scroll in the document (no inner scroll box,
 * which traps keyboard and screen-reader users), the media column sticks
 * and swaps to the active step's picture, the inactive steps step down a
 * shade of ink rather than fade (opacity would push their text under the
 * 4.5:1 contrast floor). Every step and every picture is in the HTML; the
 * only thing JavaScript adds is which one is "current", decided by an
 * IntersectionObserver on a band around the middle of the viewport (no
 * scroll listener, no animation library). Under `prefers-reduced-motion`
 * nothing transitions and the pictures still swap.
 *
 * On small screens each step shows its own picture inline, in order.
 *
 * @example
 *   <StickyScroll steps={[{ title, description, media: <Image … /> }]} />
 */
export interface StickyScrollStep {
  readonly title: string
  readonly description: React.ReactNode
  readonly media: React.ReactNode
  /** Small label above the title, e.g. "Step 1". */
  readonly label?: string
}

export function StickyScroll({ steps, className, mediaClassName }: { steps: readonly StickyScrollStep[]; className?: string; mediaClassName?: string }) {
  const listRef = React.useRef<HTMLOListElement>(null)
  const [active, setActive] = React.useState(0)

  // The step whose box crosses the band 40–60% down the viewport is current.
  React.useEffect(() => {
    const list = listRef.current
    if (!list || typeof IntersectionObserver === 'undefined') return
    const items = Array.from(list.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = items.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive((current) => (current === index ? current : index))
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [steps.length])

  return (
    <div className={cn('grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16', className)}>
      <ol ref={listRef} className="flex flex-col gap-10 lg:gap-0">
        {steps.map((step, index) => {
          const current = index === active
          return (
            <li key={step.title} data-active={current} className="flex flex-col gap-4 lg:min-h-[60vh] lg:justify-center lg:py-6 motion-safe:[&_*]:transition-colors motion-safe:[&_*]:duration-200 motion-safe:[&_*]:ease-out-expo">
              <div className="flex items-baseline gap-3">
                <span className={cn('inline-flex size-7 shrink-0 items-center justify-center rounded-pill type-mono text-xs font-medium', current ? 'bg-brand-tint-08 text-brand-strong' : 'bg-line-3 text-ink-4')} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step.label ? <span className={cn('type-eyebrow', current ? 'text-ink-4' : 'text-ink-5')}>{step.label}</span> : null}
              </div>
              <h3 className={cn('type-h3', current ? 'text-ink-1' : 'lg:text-ink-4')}>{step.title}</h3>
              <div className={cn('type-body', current ? 'text-ink-4' : 'lg:text-ink-5')}>{step.description}</div>
              {/* Inline picture for small screens. */}
              <FrameScope value="inline">
                <div className="lg:hidden">{step.media}</div>
              </FrameScope>
            </li>
          )
        })}
      </ol>
      <div className="hidden lg:block">
        <div className={cn('sticky top-28', mediaClassName)}>
          <FrameScope value="sticky">
            {steps.map((step, index) => (
              <div key={step.title} className={cn(index === active ? 'block' : 'hidden')} aria-hidden={index !== active}>
                {step.media}
              </div>
            ))}
          </FrameScope>
        </div>
      </div>
    </div>
  )
}
