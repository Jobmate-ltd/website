'use client'
import * as React from 'react'
import { PiPlayFill as Play } from 'react-icons/pi'

/** Swap a dud thumbnail for the one YouTube always has. Guarded against looping. */
function swapToFallback(img: HTMLImageElement, id: string) {
  const fallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  if (img.src !== fallback) img.src = fallback
}

/**
 * Click-to-play YouTube facade. Nothing from youtube.com is requested until
 * the viewer presses play — only the thumbnail — so a page of lessons stays as
 * light as a page of images. Mirrors the hero's how-it-works player, minus the
 * modal: on the academy the video is the content, so it plays in place.
 */
export default function YouTubeEmbed({
  id,
  title,
  caption,
  poster,
}: {
  id: string
  title: string
  caption: string
  /** Optional custom frame. Falls back to YouTube's own thumbnail. */
  poster?: string
}) {
  const [playing, setPlaying] = React.useState(false)

  if (playing) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </figure>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video. ${caption}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black"
    >
      <img
        src={poster ?? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        className="size-full object-cover"
        // maxres isn't generated for every upload, and YouTube does not 404 in
        // a way the browser reports: it serves a decodable 120x90 grey tile, so
        // `onLoad` fires and the frame silently renders as a grey box. Detecting
        // that tile by its size is the only reliable signal. hqdefault always
        // exists; object-cover crops the letterbox bars it ships with.
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth <= 120) swapToFallback(e.currentTarget, id)
        }}
        onError={(e) => swapToFallback(e.currentTarget, id)}
      />
      <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand text-white shadow-lg transition group-hover:scale-105 motion-reduce:group-hover:scale-100">
          <Play className="size-7 translate-x-0.5 fill-current" />
        </span>
      </span>
    </button>
  )
}
