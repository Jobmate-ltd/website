import type { LessonVideo } from '@/lib/academy'
import { YouTubeEmbed } from '@/components/academy/youtube-embed'
import { MediaFrame } from '@/components/ui/frame'

/**
 * LessonPlayer — the lesson's video slot. Renders a YouTube facade when
 * `video.youtubeId` is set in lib/academy.ts and a native player when
 * `video.src` is. A lesson with neither is not rendered at all; the academy
 * page says "More lessons are being recorded." once, honestly, instead.
 */
export function LessonPlayer({ video, title }: { video: LessonVideo; title: string }) {
  if (video.youtubeId) {
    return <YouTubeEmbed id={video.youtubeId} title={title} caption={video.caption} poster={video.poster} />
  }
  if (video.src) {
    return (
      <MediaFrame>
        <video controls playsInline preload="metadata" poster={video.poster} className="aspect-video w-full bg-ink-1" aria-label={video.caption}>
          <source src={video.src} type="video/mp4" />
        </video>
      </MediaFrame>
    )
  }
  return null
}

export default LessonPlayer
