import * as React from 'react'
import { cn } from '@/lib/utils'
import { GlassFrame } from '@/components/ui/glass-frame'

/**
 * BrowserFrame / PhoneFrame / MediaFrame — frames on a light ground, each
 * with an optional caption. The child is the image or video itself.
 *
 * Product screenshots go in glass: `BrowserFrame` and `PhoneFrame` are the
 * liquid-glass pane (GlassFrame) with its window bar or its phone bezel.
 * `MediaFrame` is for photography and footage: 8px radius, a line-1
 * hairline and the frame shadow.
 *
 * @example
 *   <BrowserFrame caption="The admin dashboard" url="app.jobsafe.cloud">
 *     <Image … />
 *   </BrowserFrame>
 */
interface FrameProps extends React.HTMLAttributes<HTMLElement> {
  caption?: React.ReactNode
  children: React.ReactNode
}

function Figure({ caption, className, children, ...props }: FrameProps) {
  return (
    <figure className={cn('flex flex-col gap-3', className)} {...props}>
      {children}
      {caption ? <figcaption className="type-small text-ink-5">{caption}</figcaption> : null}
    </figure>
  )
}

/** A photo or video in a hairlined frame. */
export function MediaFrame({ caption, className, children, ...props }: FrameProps) {
  return (
    <Figure caption={caption} className={className} {...props}>
      <div className="overflow-hidden rounded-frame border border-line-1 bg-canvas-muted shadow-frame [&>img]:block [&>img]:w-full [&>video]:block [&>video]:w-full">
        {children}
      </div>
    </Figure>
  )
}

/** A desktop screenshot in a liquid-glass window. */
export function BrowserFrame({
  caption,
  url,
  className,
  children,
  ...props
}: FrameProps & { url?: string }) {
  return (
    <Figure caption={caption} className={cn('gap-5', className)} {...props}>
      <GlassFrame url={url}>{children}</GlassFrame>
    </Figure>
  )
}

/** A phone screenshot in a liquid-glass bezel. `screenClassName` sets the screen's ground. */
export function PhoneFrame({ caption, className, screenClassName, children, ...props }: FrameProps & { screenClassName?: string }) {
  return (
    <Figure caption={caption} className={cn('items-center gap-5 [&>figcaption]:max-w-[360px] [&>figcaption]:text-center', className)} {...props}>
      <GlassFrame variant="phone" screenClassName={screenClassName}>
        {children}
      </GlassFrame>
    </Figure>
  )
}

export default MediaFrame
