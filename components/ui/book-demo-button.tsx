'use client'

import * as React from 'react'
import { CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEMO_BOOKING_URL } from '@/lib/brand'
import { buttonVariants, type ButtonProps } from '@/components/ui/button'

/**
 * BookDemoButton — the site's only route to the sales calendar.
 *
 * Every "Book a demo" control renders this, so the label, the destination, the
 * new-tab behaviour and the analytics event are decided once. Opens in a new
 * tab so the visitor keeps the page they were reading, and says so to screen
 * readers. `placement` is required: a demo-click count that cannot say WHERE
 * the click came from cannot tell you which CTA to keep.
 *
 * @example
 *   <BookDemoButton placement="home-hero" size="lg" />
 */
export interface BookDemoButtonProps {
  placement: string
  variant?: NonNullable<ButtonProps['variant']>
  size?: NonNullable<ButtonProps['size']>
  block?: boolean
  children?: React.ReactNode
  /** The calendar glyph. Off for link-style buttons in prose. */
  icon?: boolean
  /** Runs after the analytics event. For dismissing a menu the CTA sits inside. */
  onClick?: () => void
  className?: string
}

/**
 * Fire-and-forget GA4 event. gtag only exists once analytics consent has been
 * given and the tag has loaded; otherwise this is a no-op, never an error and
 * never a blocked navigation.
 */
export function trackDemoClick(placement: string) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === 'function') {
    gtag('event', 'book_demo_click', { placement, destination: 'calendly' })
  }
}

export function BookDemoButton({
  placement,
  variant = 'primary',
  size = 'md',
  block = false,
  children = 'Book a demo',
  icon = variant !== 'link',
  onClick,
  className,
}: BookDemoButtonProps) {
  return (
    <a
      href={DEMO_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-demo-placement={placement}
      onClick={() => {
        trackDemoClick(placement)
        onClick?.()
      }}
      className={cn(buttonVariants({ variant, size, block }), 'group', className)}
    >
      {icon ? (
        <CalendarCheck
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100"
          strokeWidth={2}
        />
      ) : null}
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export default BookDemoButton
