import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Marquee — repeats its children in a row that scrolls continuously.
 *
 * Duration comes from `--marquee-duration` (default 40s), the gap from
 * `--marquee-gap`. Pauses on hover with `pauseOnHover`; reduced motion stops
 * it entirely via the global rule. Repeated copies are hidden from assistive
 * tech so a screen reader hears the content once.
 *
 * @example
 *   <Marquee pauseOnHover className="[--marquee-duration:30s]"><ul>…</ul></Marquee>
 */
interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  reverse?: boolean
  pauseOnHover?: boolean
  repeat?: number
}

export function Marquee({ className, reverse = false, pauseOnHover = false, children, repeat = 3, ...props }: MarqueeProps) {
  return (
    <div {...props} className={cn('marquee-track flex gap-[var(--marquee-gap,1rem)] overflow-hidden [--marquee-gap:1rem]', className)}>
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? 'true' : undefined}
          className={cn('marquee-row flex shrink-0 items-center justify-around gap-[var(--marquee-gap,1rem)] animate-marquee', {
            'group-hover:[animation-play-state:paused]': pauseOnHover,
            '[animation-direction:reverse]': reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

export default Marquee
