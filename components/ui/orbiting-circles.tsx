import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * OrbitingCircles — Magic UI `orbiting-circles` (https://magicui.design/docs/components/orbiting-circles,
 * MIT) restyled: a line-1 ring, children spaced evenly on it and orbiting
 * with the `orbit` keyframes in app/globals.css. Each child carries its
 * starting position as a static transform and the animation as inline
 * longhands (a `var()` inside the theme's `--animate-orbit` would resolve on
 * `:root`, not here), so under `prefers-reduced-motion`, where the global
 * rule ends every animation instantly, the children sit evenly spaced on the
 * ring, and the `animate-orbit` class still lets a parent pause the orbit.
 *
 * @example
 *   <div className="relative size-[28rem]"><OrbitingCircles radius={180}><Icon/><Icon/></OrbitingCircles></div>
 */
export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  reverse?: boolean
  /** Seconds per revolution. */
  duration?: number
  radius?: number
  /** Draw the ring. */
  path?: boolean
  iconSize?: number
  /** Degrees to offset the first child by. */
  startAngle?: number
}

export function OrbitingCircles({ className, children, reverse, duration = 40, radius = 160, path = true, iconSize = 44, startAngle = 0, ...props }: OrbitingCirclesProps) {
  const count = React.Children.count(children)
  return (
    <>
      {path ? (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
          <circle className="stroke-line-1" strokeWidth={1} cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      ) : null}
      {React.Children.map(children, (child, index) => {
        const angle = startAngle + (360 / count) * index
        return (
          <div
            style={
              {
                '--radius': radius,
                '--angle': angle,
                '--icon-size': `${iconSize}px`,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg)`,
                animationName: 'orbit',
                animationDuration: `${duration}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              } as React.CSSProperties
            }
            className={cn('absolute left-1/2 top-1/2 flex size-(--icon-size) transform-gpu animate-orbit items-center justify-center rounded-pill', reverse && '[animation-direction:reverse]', className)}
            {...props}
          >
            {child}
          </div>
        )
      })}
    </>
  )
}
