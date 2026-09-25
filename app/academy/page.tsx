import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { FEATURED_VIDEO, LESSONS } from '@/lib/academy'
import { SIGNUP_TRIAL_URL, SITE_URL, canonicalFor, trialSentence } from '@/lib/brand'
import { breadcrumbSchema, graph, itemListSchema, jsonLd, videoObjectSchema } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Lessons, isRecorded } from '@/components/academy/lessons'
import { LessonPlayer } from '@/components/academy/lesson-player'
import { youtubeThumbnail } from '@/lib/youtube'
import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/eyebrow'
import { CtaBand } from '@/components/ui/cta-band'

const PATH = '/academy'
const URL = canonicalFor(PATH)

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Academy: video lessons on using jobsafe',
  description:
    'Watch jobsafe on a real job, then learn to create incident and HSSE reports, resolve them, and read the admin dashboard in short video lessons.',
  ogTitle: 'jobsafe academy: watch it done',
})

export default function AcademyPage() {
  const featuredId = FEATURED_VIDEO.video.youtubeId
  const recorded = LESSONS.filter(isRecorded)

  const pageGraph = jsonLd(
    graph(
      breadcrumbSchema([
        { name: 'Home', item: `${SITE_URL}/` },
        { name: 'Academy', item: URL },
      ]),
      // The featured film is the only real video on the page today, so it is
      // the only thing that earns a VideoObject. Lessons join it as they land.
      ...(featuredId
        ? [
            videoObjectSchema({
              name: FEATURED_VIDEO.title,
              description: FEATURED_VIDEO.description,
              thumbnailUrl: youtubeThumbnail(featuredId),
              uploadDate: FEATURED_VIDEO.uploadDate,
              duration: FEATURED_VIDEO.duration,
              embedUrl: `https://www.youtube-nocookie.com/embed/${featuredId}`,
              url: URL,
            }),
          ]
        : []),
      // Only recorded lessons are listed; unrecorded ones are not content.
      ...(recorded.length
        ? [itemListSchema('jobsafe academy lessons', recorded.map((lesson) => ({ name: lesson.title, url: `${URL}#${lesson.slug}` })))]
        : []),
    ),
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Academy', href: PATH }]} />}
          eyebrow="jobsafe academy"
          title={
            <>
              Watch it <span className="text-brand">done</span>
            </>
          }
          lead="Short recordings of jobsafe, exactly as your team will use it. Watch a lesson, then do it yourself."
        />

        <Section id="featured">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14">
            <div className="flex flex-col gap-4">
              <Eyebrow>{FEATURED_VIDEO.eyebrow}</Eyebrow>
              <h2 className="type-h2 text-ink-1">{FEATURED_VIDEO.title}</h2>
              <p className="type-lead text-ink-4">{FEATURED_VIDEO.promise}</p>
            </div>
            <LessonPlayer video={FEATURED_VIDEO.video} title={FEATURED_VIDEO.title} />
          </div>
        </Section>

        <Lessons />

        <CtaBand
          tone="white"
          placement="academy-closing"
          title="Now try it yourself"
          copy={`Everything in these lessons is in the app from day one. ${trialSentence()}`}
          secondary={{ label: 'Sign up now', href: SIGNUP_TRIAL_URL }}
        />
      </main>
      <Footer />
    </>
  )
}
