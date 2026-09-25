import { cn } from '@/lib/utils'

/**
 * BorderBeam — Magic UI `border-beam` (https://magicui.design/docs/components/border-beam,
 * MIT): a short gradient that travels around the border of its parent along
 * a CSS motion path. Recoloured to the brand crimson from the tokens and kept
 * thin and slow, so on a light page it reads as a highlight, not a glow.
 *
 * Rebuilt without the `motion` library: the travel is the `border-beam`
 * keyframes in app/globals.css animating `offset-distance`, so the component
 * is plain markup, ships no JavaScript and needs no hydration (it was the only
 * reason the homepage loaded `motion`). Hidden under `prefers-reduced-motion`.
 *
 * The parent needs `relative` and a border radius; the beam inherits it.
 *
 * @example
 *   <div className="relative rounded-frame border border-line-1"><Image … /><BorderBeam duration={8} size={120} /></div>
 */
export interface BorderBeamProps {
  size?: number
  /** Seconds per lap. */
  duration?: number
  /** Seconds before the first lap. */
  delay?: number
  className?: string
  style?: React.CSSProperties
  reverse?: boolean
  /** Starting position along the path, 0–100. */
  initialOffset?: number
  borderWidth?: number
}

export function BorderBeam({ className, size = 120, delay = 0, duration = 8, style, reverse = false, initialOffset = 0, borderWidth = 1.5 }: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(black,black)] mask-intersect [mask-clip:padding-box,border-box] motion-reduce:hidden"
      style={{ '--border-beam-width': `${borderWidth}px` } as React.CSSProperties}
    >
      <div
        className={cn('absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent', className)}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            offsetDistance: `${initialOffset}%`,
            '--beam-from': `${initialOffset}%`,
            '--beam-to': `${100 + initialOffset}%`,
            '--color-from': 'var(--color-brand)',
            '--color-to': 'var(--color-brand-strong)',
            animationName: 'border-beam',
            animationDuration: `${duration}s`,
            animationDelay: `${-delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: reverse ? 'reverse' : 'normal',
            ...style,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export default BorderBeam
