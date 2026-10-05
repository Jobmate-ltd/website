import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * GlassFrame — the liquid-glass pane every product screenshot sits in.
 *
 * A translucent, blurred pane with a specular rim and its own soft aura
 * behind it (the `liquid-glass`, `glass-screen` and `glass-aura` rules in
 * app/globals.css). The screen inside is concentric with the pane: its radius
 * is the pane's radius minus the pane's thickness, so the two curves run
 * parallel at every breakpoint.
 *
 * - `desktop` (default): 28px pane (20px under 640px) with a slim window bar
 *   (three dots and an optional address) in the glass above the screen.
 * - `phone`: a 54px glass bezel around a phone capture; no bar. Centred, and
 *   at most 360px wide or as wide as keeps the whole phone inside the
 *   viewport (`PHONE_GLASS_WIDTH`), whichever is smaller, so a phone in a
 *   sticky column is never cut off.
 * - `bare`: the desktop pane with no bar, for a screen that brings its own.
 *
 * `screenAspect` fixes the screen's aspect ratio (the child is cropped to it
 * with `object-cover object-top`); without it the screen takes the child's own
 * height. `overlay` renders over the screen in the same box, for anything
 * positioned in screen percentages (the product tour's spotlights). Purely
 * presentational, so it stays a server component.
 *
 * @example
 *   <GlassFrame url="app.jobsafe.cloud/riddor"><Image … /></GlassFrame>
 *   <GlassFrame variant="phone" className="max-w-[360px]"><Image … /></GlassFrame>
 */
export interface GlassFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'desktop' | 'phone' | 'bare'
  /** Address shown in the window bar (desktop only). */
  url?: string
  /** e.g. `12 / 7`. Crops the child to this ratio, anchored at the top. */
  screenAspect?: string
  /** Rendered over the screen, in the screen's own coordinate box. */
  overlay?: React.ReactNode
  /** Extra classes for the screen box. */
  screenClassName?: string
  /** Rendered inside the pane after the screen (e.g. a `BorderBeam`). */
  adornment?: React.ReactNode
  children: React.ReactNode
}

/**
 * Phone width: 360px, or less when the viewport is short. The bezel's height
 * is about 2.16 × its width; 46.2dvh − 56px keeps it clear of the sticky
 * header with room to spare. Never below 240px.
 */
export const PHONE_GLASS_WIDTH = 'max-w-[min(360px,max(240px,calc(46.2dvh-56px)))]'

export function GlassFrame({ variant = 'desktop', url, screenAspect, overlay, screenClassName, adornment, className, children, ...props }: GlassFrameProps) {
  const bar = variant === 'desktop'
  return (
    <div className={cn('relative isolate w-full', variant === 'phone' && cn('mx-auto', PHONE_GLASS_WIDTH), className)} {...props}>
      <div aria-hidden="true" className="glass-aura" />
      <div className="liquid-glass" data-variant={variant === 'phone' ? 'phone' : undefined}>
        {bar ? (
          <div aria-hidden="true" className="relative z-[1] flex h-6 items-center gap-3 px-1.5 pb-1.5 sm:h-7 sm:pb-2">
            <span className="flex shrink-0 gap-1.5">
              <span className="size-2.5 rounded-pill bg-canvas/80 ring-1 ring-inset ring-ink-1/10" />
              <span className="size-2.5 rounded-pill bg-canvas/80 ring-1 ring-inset ring-ink-1/10" />
              <span className="size-2.5 rounded-pill bg-canvas/80 ring-1 ring-inset ring-ink-1/10" />
            </span>
            {url ? (
              <span className="mx-auto hidden min-w-0 max-w-[50%] truncate rounded-pill bg-canvas/70 px-3 py-0.5 text-center type-mono text-[11px] leading-4 text-ink-5 ring-1 ring-inset ring-ink-1/[6%] sm:block">
                {url}
              </span>
            ) : null}
            {/* Balances the dots so the address sits dead centre. */}
            {url ? <span className="hidden w-[46px] shrink-0 sm:block" /> : null}
          </div>
        ) : null}
        <div
          className={cn('glass-screen [&>img]:block [&>img]:w-full', screenAspect && '[&_img]:size-full [&_img]:object-cover [&_img]:object-top', screenClassName)}
          style={screenAspect ? { aspectRatio: screenAspect } : undefined}
        >
          {children}
          {overlay}
        </div>
        {adornment}
      </div>
    </div>
  )
}

export default GlassFrame
