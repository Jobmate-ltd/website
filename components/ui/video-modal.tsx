'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Play, X } from 'lucide-react'
import { youtubeEmbedUrl, youtubeThumbnail } from '@/lib/youtube'

/**
 * VideoModal — the opened state of <VideoDialog/>. Loaded on demand the first
 * time a visitor opens a film, so Radix Dialog is not in the initial bundle
 * of every page that has a "See how it works" button.
 *
 * Nothing from YouTube loads until the visitor presses play inside the
 * dialog; until then it shows the (always-available) hqdefault thumbnail.
 * Uses the privacy-enhanced youtube-nocookie.com embed so no advertising
 * cookies are set by the player.
 */
export function VideoModal({
  youtubeId,
  title,
  description,
  open,
  onOpenChange,
}: {
  youtubeId: string
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [playing, setPlaying] = React.useState(false)

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setPlaying(false)
        onOpenChange(next)
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-1/60 data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-frame border border-line-1 bg-canvas p-2 shadow-frame data-[state=open]:animate-rise-in"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
          <div className="relative aspect-video w-full overflow-hidden rounded-[6px] bg-ink-1">
            {playing ? (
              <iframe
                className="absolute inset-0 size-full"
                src={youtubeEmbedUrl(youtubeId)}
                title={title}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${title}`}
                className="group absolute inset-0 flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- a remote thumbnail; loaded lazily and only inside an opened dialog */}
                <img src={youtubeThumbnail(youtubeId)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                <span className="relative grid size-16 place-items-center rounded-pill bg-brand-strong text-canvas shadow-hover transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                  <Play className="size-7 translate-x-0.5 fill-current" aria-hidden="true" />
                </span>
              </button>
            )}
          </div>
          <DialogPrimitive.Close className="absolute -top-3 -right-3 grid size-11 place-items-center rounded-pill border border-line-1 bg-canvas text-ink-3 shadow-hover transition-colors hover:text-ink-1">
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default VideoModal
