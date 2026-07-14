import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Lessons from '@/components/academy/Lessons'
import AcademyCta from '@/components/academy/AcademyCta'
import { LESSONS } from '@/lib/academy'
import { SITE_URL } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Academy',
  description:
    'Short video lessons on using jobsafe: create incident and HSSE reports, resolve them, and read the admin dashboard. Each one done in seconds.',
  alternates: {
    canonical: `${SITE_URL}/academy`,
  },
  openGraph: {
    title: 'Academy | jobsafe',
    description:
      'Short video lessons on using jobsafe, from your first incident report to the admin dashboard.',
    url: `${SITE_URL}/academy`,
    type: 'website',
  },
}

export default function AcademyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Academy', item: `${SITE_URL}/academy` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'jobsafe academy lessons',
        itemListElement: LESSONS.map((lesson, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: lesson.title,
          url: `${SITE_URL}/academy#${lesson.slug}`,
        })),
      },
    ],
  }

  return (
    <main className="bg-surface-0 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Header — editorial, matching the insights index */}
      <section className="relative overflow-hidden">
        {/* Red glow — top right, matching the hero */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle at top right, rgb(var(--brand-rgb) / 0.16) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-14 md:pt-24 md:pb-16">
          <p className="text-xs font-bold tracking-widest text-brand uppercase mb-5">
            jobsafe academy
          </p>
          <h1
            className="font-black uppercase leading-none tracking-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)' }}
          >
            Watch it done<br />
            <span className="text-brand">in seconds</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
            Short recordings of jobsafe, exactly as your team will use it.
            Watch a lesson, then do it yourself.
          </p>
        </div>
      </section>

      <Lessons />
      <AcademyCta />
      <Footer />
    </main>
  )
}
