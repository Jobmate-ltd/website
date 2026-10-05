'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Slot } from '@radix-ui/react-slot'

/**
 * VideoDialog — a click-to-play YouTube film in a modal.
 *
 * The trigger is the only thing on the page until it is pressed: the modal
 * (Radix Dialog, the thumbnail, the nocookie embed) lives in
 * components/ui/video-modal.tsx and is fetched on the first click, so a
 * page with a "See how it works" button ships none of it up front.
 *
 * Pass one focusable element as `children`; it receives the click handler
 * and `aria-haspopup="dialog"` through Radix `Slot`, which also unwraps a
 * child that arrives from a server component as a lazy reference (React
 * Flight streams an element prop that way when it is outlined into its own
 * chunk; `React.cloneElement` on that reference produced an element with no
 * type and crashed the page).
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
  children: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  // Once opened, keep the modal mounted so a second press is instant.
  const [loaded, setLoaded] = React.useState(false)

  return (
    <>
      {/* Slot runs the child's own onClick first, then this one. */}
      <Slot
        onClick={() => {
          setLoaded(true)
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {children}
      </Slot>
      {loaded ? <VideoModal youtubeId={youtubeId} title={title} description={description} open={open} onOpenChange={setOpen} /> : null}
    </>
  )
}

export default VideoDialog
