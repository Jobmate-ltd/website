'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * LazyVideo — a silent looping hero clip that costs nothing until the page
 * has settled.
 *
 * The poster is a real `next/image` (sized, AVIF/WebP, preloaded when
 * `priority`) so the frame paints with the page. The `<video>` gets its
 * `src` only once the browser is idle, then fades in over the poster when it
 * can play. Under `prefers-reduced-motion` the clip is never fetched and the
 * poster stays; the alt text describes the scene either way.
 *
 * @example
 *   <LazyVideo src="/videos/healthcare-hero.mp4" poster="/videos/healthcare-hero-poster.jpg" alt="A carer …" priority />
 */
export function LazyVideo({
  src,
  poster,
  alt,
  priority = false,
  sizes = '(min-width: 1024px) 560px, 100vw',
  className,
}: {
  src: string
  poster: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}) {
  const [videoSrc, setVideoSrc] = React.useState<string | null>(null)
  const [playing, setPlaying] = React.useState(false)

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = () => setVideoSrc(src)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(start, 1500)
    return () => window.clearTimeout(id)
  }, [src])

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden', className)}>
      <Image src={poster} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={cn('absolute inset-0 size-full object-cover transition-opacity duration-200 ease-out-expo', playing ? 'opacity-100' : 'opacity-0')}
        />
      ) : null}
    </div>
  )
}
