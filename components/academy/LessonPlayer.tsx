import Image from 'next/image'
import type { LessonVideo } from '@/lib/academy'

/**
 * The lesson's video slot. Renders a native player once `video.src` is set in
 * lib/academy.ts; until then, a composed placeholder that says exactly what is
 * coming. Server-safe: no client JS beyond the native <video> element.
 */
export default function LessonPlayer({ video, title }: { video: LessonVideo; title: string }) {
  if (video.src) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          poster={video.poster}
          className="aspect-video w-full"
          aria-label={video.caption}
        >
          <source src={video.src} type="video/mp4" />
        </video>
      </figure>
    )
  }

  return (
    <div
      role="img"
      aria-label={`${title}: lesson recording coming soon`}
      className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-surface-1"
    >
      {/* Faint brand wash so the empty frame still reads as jobsafe */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at bottom right, rgb(var(--brand-rgb) / 0.10) 0%, transparent 60%)',
        }}
      />
      <Image
        src="/images/jobsafe-js-mark.png"
        alt=""
        width={56}
        height={56}
        className="h-12 w-12 mix-blend-screen opacity-90 sm:h-14 sm:w-14"
      />
      <div className="relative z-10 text-center px-6">
        <p className="text-sm font-bold text-white">Recording in production</p>
        <p className="mt-1 text-xs leading-relaxed text-white/40">
          This walkthrough is being captured in the live app and will appear here.
        </p>
      </div>
    </div>
  )
}
