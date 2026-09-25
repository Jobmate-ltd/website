'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

/**
 * VideoDialog — a click-to-play YouTube film in a modal.
 *
 * The trigger is the only thing on the page until it is pressed: the modal
 * (Radix Dialog, the thumbnail, the nocookie embed) lives in
 * components/ui/video-modal.tsx and is fetched on the first click, so a
 * page with a "See how it works" button ships none of it up front.
 *
 * Pass one focusable element as `children`; it receives the click handler
 * and `aria-haspopup="dialog"`.
 *
 * @example
 *   <VideoDialog youtubeId="…" title="jobsafe — how it works" description="…">
 *     <Button variant="secondary">See how it works</Button>
 *   </VideoDialog>
 */
const VideoModal = dynamic(() => import('./video-modal').then((m) => m.VideoModal), { ssr: false })

export function VideoDialog({
  youtubeId,
  title,
  description,
  children,
}: {
  youtubeId: string
  title: string
  description: string
  children: React.ReactElement<{ onClick?: React.MouseEventHandler; 'aria-haspopup'?: React.AriaAttributes['aria-haspopup']; 'aria-expanded'?: boolean }>
}) {
  const [open, setOpen] = React.useState(false)
  // Once opened, keep the modal mounted so a second press is instant.
  const [loaded, setLoaded] = React.useState(false)

  const trigger = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e)
      setLoaded(true)
      setOpen(true)
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
  })

  return (
    <>
      {trigger}
      {loaded ? <VideoModal youtubeId={youtubeId} title={title} description={description} open={open} onOpenChange={setOpen} /> : null}
    </>
  )
}

export default VideoDialog
