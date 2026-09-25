'use client'

import * as React from 'react'
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * NumberTicker — Magic UI `number-ticker` (https://magicui.design/docs/components/number-ticker,
 * MIT), adapted: en-GB formatting, tabular figures in the current font, an
 * optional prefix/suffix rendered outside the animated span, and it re-runs
 * whenever `value` changes (a price toggle), not only on first view. Under
 * `prefers-reduced-motion` the number is set instantly.
 *
 * @example
 *   <NumberTicker value={monthly} decimalPlaces={2} prefix="£" />
 */
export interface NumberTickerProps extends React.ComponentPropsWithoutRef<'span'> {
  value: number
  startValue?: number
  delay?: number
  decimalPlaces?: number
  prefix?: string
  suffix?: string
}

export function NumberTicker({ value, startValue, delay = 0, className, decimalPlaces = 0, prefix, suffix, ...props }: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(startValue ?? value)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 140 })
  const isInView = useInView(ref, { once: true, margin: '0px' })
  const format = React.useMemo(
    () => new Intl.NumberFormat('en-GB', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }),
    [decimalPlaces],
  )

  React.useEffect(() => {
    if (!isInView) return
    if (reduced) {
      motionValue.jump(value)
      return
    }
    const timer = window.setTimeout(() => motionValue.set(value), delay * 1000)
    return () => window.clearTimeout(timer)
  }, [motionValue, isInView, delay, value, reduced])

  React.useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) ref.current.textContent = format.format(Number(latest.toFixed(decimalPlaces)))
      }),
    [springValue, decimalPlaces, format],
  )

  return (
    <span className={cn('inline-flex items-baseline tabular-nums', className)} {...props}>
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      <span ref={ref} aria-hidden="true">
        {format.format(startValue ?? value)}
      </span>
      {suffix ? <span aria-hidden="true">{suffix}</span> : null}
      {/* Assistive tech gets the final figure, not the ticking digits. */}
      <span className="sr-only">
        {prefix}
        {format.format(value)}
        {suffix}
      </span>
    </span>
  )
}
