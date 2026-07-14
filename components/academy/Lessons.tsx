'use client'
import * as React from 'react'
import { motion } from 'framer-motion'
import { LESSONS } from '@/lib/academy'
import LessonPlayer from '@/components/academy/LessonPlayer'

/**
 * The lesson chapters, with a sticky rail on desktop for jumping between
 * them. The rail highlights whichever lesson is currently in view via an
 * IntersectionObserver (never a scroll listener).
 */
export default function Lessons() {
  const [active, setActive] = React.useState<string>(LESSONS[0].slug)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // A narrow band around the upper third of the viewport: the lesson
      // whose heading crosses it becomes the active chapter.
      { rootMargin: '-25% 0px -65% 0px' },
    )
    for (const lesson of LESSONS) {
      const el = document.getElementById(lesson.slug)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative max-w-5xl mx-auto px-6 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
        {/* Chapter rail — sticky on desktop, hidden on mobile where the
            lessons simply stack in order. */}
        <nav aria-label="Lessons" className="hidden lg:block">
          <div className="sticky top-32 flex flex-col gap-1 border-l border-white/10">
            {LESSONS.map((lesson) => {
              const isActive = active === lesson.slug
              return (
                <a
                  key={lesson.slug}
                  href={`#${lesson.slug}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`-ml-px flex items-baseline gap-3 border-l-2 py-2.5 pl-4 text-sm transition-colors ${
                    isActive
                      ? 'border-brand text-white'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  <span
                    className={`text-xs font-bold tabular-nums ${isActive ? 'text-brand' : 'text-white/30'}`}
                  >
                    {lesson.number}
                  </span>
                  <span className="font-medium">{lesson.short}</span>
                </a>
              )
            })}
          </div>
        </nav>

        {/* Lessons */}
        <div className="flex flex-col">
          {LESSONS.map((lesson, i) => (
            <motion.article
              key={lesson.slug}
              id={lesson.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className={`scroll-mt-36 py-14 first:pt-0 last:pb-0 ${
                i > 0 ? 'border-t border-white/10' : ''
              }`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-sm font-bold text-brand tabular-nums shrink-0">
                  {lesson.number}
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                  {lesson.title}
                </h2>
              </div>

              <p className="text-white/50 leading-relaxed max-w-2xl mb-8">
                {lesson.promise}
              </p>

              <LessonPlayer video={lesson.video} title={lesson.title} />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {lesson.steps.map((step) => (
                  <div key={step.title}>
                    <p className="font-bold text-white text-sm mb-1.5">{step.title}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
