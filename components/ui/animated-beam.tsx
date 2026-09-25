'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * AnimatedBeam — Magic UI `animated-beam` (https://magicui.design/docs/components/animated-beam,
 * MIT) recoloured: a line-1 path with a crimson pulse travelling along it,
 * colours read from the tokens as CSS variables. Draws a quadratic curve
 * between two elements inside `containerRef` and redraws on resize. Under
 * `prefers-reduced-motion` the pulse is replaced by a static brand-tint
 * stroke.
 *
 * @example
 *   <AnimatedBeam containerRef={ref} fromRef={phoneRef} toRef={cloudRef} curvature={-40} />
 */
export interface AnimatedBeamProps {
  className?: string
  containerRef: React.RefObject<HTMLElement | null>
  fromRef: React.RefObject<HTMLElement | null>
  toRef: React.RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathWidth?: number
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4,
  delay = 0,
  pathWidth = 2,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = React.useId()
  const reduced = useReducedMotion()
  const [pathD, setPathD] = React.useState('')
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  const gradientCoordinates = reverse
    ? { x1: ['90%', '-10%'], x2: ['100%', '0%'], y1: ['0%', '0%'], y2: ['0%', '0%'] }
    : { x1: ['10%', '110%'], x2: ['0%', '100%'], y1: ['0%', '0%'], y2: ['0%', '0%'] }

  React.useEffect(() => {
    const update = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to) return
      const c = container.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      setSize({ width: c.width, height: c.height })
      const startX = a.left - c.left + a.width / 2 + startXOffset
      const startY = a.top - c.top + a.height / 2 + startYOffset
      const endX = b.left - c.left + b.width / 2 + endXOffset
      const endY = b.top - c.top + b.height / 2 + endYOffset
      const controlY = startY - curvature
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`)
    }
    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    update()
    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset])

  return (
    <svg
      fill="none"
      width={size.width}
      height={size.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('pointer-events-none absolute left-0 top-0 transform-gpu', className)}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
    >
      <path d={pathD} className="stroke-line-1" strokeWidth={pathWidth} strokeLinecap="round" />
      {reduced ? (
        <path d={pathD} className="stroke-brand-tint-18" strokeWidth={pathWidth} strokeLinecap="round" />
      ) : (
        <>
          <path d={pathD} strokeWidth={pathWidth} stroke={`url(#${id})`} strokeLinecap="round" />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
              animate={gradientCoordinates}
              transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0 }}
            >
              <stop stopColor="var(--color-brand)" stopOpacity="0" />
              <stop stopColor="var(--color-brand)" />
              <stop offset="32.5%" stopColor="var(--color-brand-strong)" />
              <stop offset="100%" stopColor="var(--color-brand-strong)" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  )
}
