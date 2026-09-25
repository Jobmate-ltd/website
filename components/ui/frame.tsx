import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * BrowserFrame / PhoneFrame / MediaFrame — frames for product screenshots and
 * photography on a light ground: 8px radius, a line-1 hairline, the frame
 * shadow and an optional caption. The child is the image or video itself.
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

/** A browser window chrome around a desktop screenshot. */
export function BrowserFrame({
  caption,
  url,
  className,
  children,
  ...props
}: FrameProps & { url?: string }) {
  return (
    <Figure caption={caption} className={className} {...props}>
      <div className="overflow-hidden rounded-frame border border-line-1 bg-canvas shadow-frame">
        <div className="flex items-center gap-2 border-b border-line-1 bg-canvas-muted px-3 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-pill border border-grey-400" />
            <span className="size-2.5 rounded-pill border border-grey-400" />
            <span className="size-2.5 rounded-pill border border-grey-400" />
          </span>
          {url ? (
            <span className="ml-2 flex-1 truncate rounded-control border border-line-1 bg-canvas px-2 py-0.5 type-mono text-[11px] text-ink-5">
              {url}
            </span>
          ) : null}
        </div>
        <div className="[&>img]:block [&>img]:w-full">{children}</div>
      </div>
    </Figure>
  )
}

/** A phone bezel around a mobile screenshot. Deliberately plain: hairline, not gloss. */
export function PhoneFrame({ caption, className, children, ...props }: FrameProps) {
  return (
    <Figure caption={caption} className={cn('items-center', className)} {...props}>
      <div className="w-full max-w-[300px] rounded-[28px] border border-line-1 bg-canvas p-2 shadow-frame">
        <div className="overflow-hidden rounded-[20px] border border-line-1 bg-ink-1 [&>img]:block [&>img]:w-full">
          {children}
        </div>
      </div>
    </Figure>
  )
}

export default MediaFrame
