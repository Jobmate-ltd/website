'use client'

import * as React from 'react'
import { PiPlayFill as Play } from 'react-icons/pi'
import { cn } from '@/lib/utils'
import {
   VideoModal,
   VideoModalTrigger,
   VideoModalContent,
   VideoModalTitle,
   VideoModalDescription,
   VideoPreview,
   VideoPlayButton,
} from '@/components/ui/video-modal'

/* ── Video config ─────────────────────────────────────────────────────── */
const YOUTUBE_ID = 'CqywS1hnPvw'
// Defaults to YouTube's auto thumbnail. To use a custom one instead, drop an
// image in /public and set: const POSTER_SRC = '/how-it-works-poster.jpg'
const POSTER_SRC = `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`
/* ─────────────────────────────────────────────────────────────────────── */

export function HowItWorksVideo({ children }: { children: React.ReactNode }) {
   const [playing, setPlaying] = React.useState(false)

   return (
      <VideoModal
         onOpenChange={(open) => {
            if (!open) setPlaying(false) // reset to thumbnail whenever it closes
         }}
      >
         {/* The existing hero button becomes the trigger */}
         <VideoModalTrigger asChild>{children}</VideoModalTrigger>

         <VideoModalContent>
            {/* Required by Radix for accessibility; visually hidden */}
            <VideoModalTitle className="sr-only">
               JobSafe — how it works
            </VideoModalTitle>
            <VideoModalDescription className="sr-only">
               A short walkthrough of capturing, reviewing, forwarding and
               analysing incidents in JobSafe.
            </VideoModalDescription>

            <div
               className={cn(
                  'group relative mx-auto aspect-video w-full max-w-4xl cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black',
                  playing && 'playing',
               )}
               onClick={() => setPlaying(true)}
            >
               {/* Thumbnail — fades out once playing */}
               <VideoPreview>
                  <img
                     src={POSTER_SRC}
                     alt=""
                     className="size-full object-cover"
                     onError={(e) => {
                        // maxres frame missing for some videos — fall back
                        e.currentTarget.src = `https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`
                     }}
                  />
                  <span className="absolute inset-0 bg-black/20" />
               </VideoPreview>

               {/* Play button — fades out once playing */}
               <VideoPlayButton>
                  <span className="grid size-16 place-items-center rounded-full bg-brand text-white shadow-lg transition group-hover:scale-105">
                     <Play className="size-7 translate-x-0.5 fill-current" />
                  </span>
               </VideoPlayButton>

               {/* The video — only mounts (and autoplays) after the play click */}
               {playing && (
                  <iframe
                     className="absolute inset-0 z-30 size-full"
                     src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                     title="JobSafe — how it works"
                     allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                     allowFullScreen
                  />
               )}
            </div>
         </VideoModalContent>
      </VideoModal>
   )
}
