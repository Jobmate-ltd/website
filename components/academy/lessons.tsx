import { Video } from 'lucide-react'
import { LESSONS, type AcademyLesson } from '@/lib/academy'
import { LessonPlayer } from '@/components/academy/lesson-player'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

/** A lesson is published once it has a recording. */
export function isRecorded(lesson: AcademyLesson): boolean {
  return Boolean(lesson.video.youtubeId || lesson.video.src)
}

/**
 * Lessons — the recorded chapters, in order. Unrecorded lessons are not
 * listed as cards; one line says more are on the way. The moment a lesson in
 * lib/academy.ts gets a `youtubeId` or `src` it appears here on its own.
 */
export function Lessons() {
  const recorded = LESSONS.filter(isRecorded)
  const pending = LESSONS.length - recorded.length

  return (
    <Section id="lessons" tone="grey" divider>
      <SectionHeading eyebrow="Lessons" title="Short recordings, exactly as your team will use it" lead="Watch a lesson, then do it yourself." tone="grey" />

      {recorded.length > 0 ? (
        <div className="mt-10 flex flex-col divide-y divide-line-1">
          {recorded.map((lesson) => (
            <article key={lesson.slug} id={lesson.slug} className="grid gap-8 py-12 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14">
              <div className="flex flex-col gap-4">
                <p className="type-mono text-sm font-medium text-brand-strong">{lesson.number}</p>
                <h3 className="type-h3 text-ink-1">{lesson.title}</h3>
                <p className="type-body text-ink-4">{lesson.promise}</p>
                <ol className="mt-2 flex flex-col gap-3">
                  {lesson.steps.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="type-mono mt-0.5 w-5 shrink-0 text-xs text-ink-5">{i + 1}</span>
                      <span>
                        <span className="block text-sm font-bold text-ink-1">{step.title}</span>
                        <span className="type-small block text-ink-5">{step.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <LessonPlayer video={lesson.video} title={lesson.title} />
            </article>
          ))}
        </div>
      ) : null}

      {pending > 0 ? (
        <p className="mt-10 flex items-center gap-3 rounded-control border border-line-1 bg-canvas p-5 type-body text-ink-4">
          <Video className="size-5 shrink-0 text-brand" aria-hidden="true" />
          More lessons are being recorded.
        </p>
      ) : null}
    </Section>
  )
}

export default Lessons
