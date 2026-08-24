'use client'

import * as React from 'react'
import { PiCalendarCheck as CalendarCheck } from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { DEMO_BOOKING_URL } from '@/lib/links'

/**
 * BookDemoButton — the site's only route to the sales calendar.
 *
 * Every "Book a demo" control renders this, so the label, the destination, the
 * new-tab behaviour and the analytics event are decided once. Before this
 * existed the CTA appeared three times under three spellings ("Book a Demo",
 * "Book a demo", "Book a demo: 0333 8000 883") and all three pointed at `tel:`.
 *
 * Opens in a new tab deliberately: the visitor keeps the page they were reading,
 * and Calendly's own confirmation flow does not have to fight the back button.
 * Announced to screen readers, because an unannounced new tab is disorienting.
 *
 * `placement` is required, not optional. It is the whole point of the event: a
 * demo-click count with no idea WHERE the click came from cannot tell you which
 * CTA to keep.
 */

const VARIANTS = {
  /** The brand-red fill. One per view, on the action we most want taken. */
  primary:
    'bg-brand hover:bg-brand-hover text-white shadow-[0_10px_30px_-12px_rgb(var(--brand-rgb)/0.9)] hover:shadow-[0_14px_38px_-12px_rgb(var(--brand-rgb)/1)]',
  /** Hairline on dark. Pairs with a primary sign-up button beside it. */
  secondary:
    'border border-white/25 hover:border-white/50 hover:bg-white/[0.04] text-white',
  /**
   * Filled white. For use ON brand-red surfaces, where red-on-red would vanish.
   * The label is `brand-deep`, not `brand`: #e5342a on white measures 4.33:1,
   * which fails AA for a 14px bold label. #7f1010 measures 10.6:1.
   */
  inverse: 'bg-white hover:bg-white/90 text-brand-deep',
  /** No chrome. For dense footers and in-body prose. */
  quiet: 'text-white/70 hover:text-white underline decoration-white/25 underline-offset-4 hover:decoration-brand',
} as const

const SIZES = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-sm px-8 py-4',
} as const

export type BookDemoVariant = keyof typeof VARIANTS
export type BookDemoSize = keyof typeof SIZES

export interface BookDemoButtonProps {
  placement: string
  variant?: BookDemoVariant
  size?: BookDemoSize
  /** Full-width. For mobile stacks and card footers. */
  block?: boolean
  /** Defaults to the one canonical label. Override only with good reason. */
  children?: React.ReactNode
  /** The calendar glyph. Off for quiet/in-prose links. */
  icon?: boolean
  /** Runs after the analytics event. For dismissing a menu the CTA sits inside. */
  onClick?: () => void
  className?: string
}

/**
 * Fire-and-forget GA4 event. gtag is loaded `afterInteractive` from the root
 * layout, so on a fast click it may genuinely not be there yet; that is a lost
 * event, never a thrown error and never a blocked navigation.
 */
function trackDemoClick(placement: string) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === 'function') {
    gtag('event', 'book_demo_click', { placement, destination: 'calendly' })
  }
}

export function BookDemoButton({
  placement,
  variant = 'primary',
  size = 'lg',
  block = false,
  children = 'Book a demo',
  icon = variant !== 'quiet',
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
      className={cn(
        'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold',
        'transition-[background-color,border-color,box-shadow,transform,color] duration-200',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.97] motion-reduce:hover:translate-y-0',
        VARIANTS[variant],
        variant === 'quiet' ? 'font-semibold' : SIZES[size],
        block && 'w-full',
        className,
      )}
    >
      {icon && (
        <CalendarCheck
          aria-hidden="true"
          className="size-[1.15em] shrink-0 transition-transform duration-200 group-hover:scale-110 motion-reduce:group-hover:scale-100"
          strokeWidth={2}
        />
      )}
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export default BookDemoButton
