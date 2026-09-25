'use client'

import * as React from 'react'
import { Play } from 'lucide-react'
import { youtubeEmbedUrl, youtubeThumbnail } from '@/lib/youtube'

/**
 * YouTubeEmbed — click-to-play facade. Nothing from YouTube is requested until
 * the viewer presses play, only the thumbnail, so a page of lessons stays as
 * light as a page of images. The thumbnail is hqdefault, which YouTube
 * generates for every upload (maxresdefault 404s for many, including ours).
 * Playback uses the privacy-enhanced youtube-nocookie.com domain.
 */
export function YouTubeEmbed({ id, title, caption, poster }: { id: string; title: string; caption: string; poster?: string }) {
  const [playing, setPlaying] = React.useState(false)

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-frame border border-line-1 bg-ink-1 shadow-frame">
        {playing ? (
          <iframe
            className="aspect-video w-full"
            src={youtubeEmbedUrl(id)}
            title={title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video. ${caption}`} className="group relative block aspect-video w-full cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element -- remote thumbnail behind a click-to-play facade */}
            <img src={poster ?? youtubeThumbnail(id)} alt="" loading="lazy" className="size-full object-cover" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-pill bg-brand-strong text-canvas shadow-hover transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                <Play className="size-7 translate-x-0.5 fill-current" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="type-small text-ink-5">{caption}</figcaption>
    </figure>
  )
}

export default YouTubeEmbed
