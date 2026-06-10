import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import { getAllPosts, formatDate, SITE_URL } from '@/lib/insights'

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Practical guidance on workplace incident reporting, HSSE compliance, RIDDOR, near misses and lone worker safety — written for field service, construction and industrial teams.',
  alternates: {
    canonical: `${SITE_URL}/insights`,
  },
  openGraph: {
    title: 'Insights | jobsafe',
    description:
      'Practical guidance on incident reporting, compliance and protecting the people who do the work.',
    url: `${SITE_URL}/insights`,
    type: 'website',
  },
}

export default function InsightsIndex() {
  const posts = getAllPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/insights`,
        name: 'jobsafe Insights',
        description:
          'Practical guidance on workplace incident reporting, HSSE compliance and field safety.',
        url: `${SITE_URL}/insights`,
        publisher: {
          '@type': 'Organization',
          name: 'Jobmate Ltd',
          url: 'https://jobmate.cloud',
        },
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          url: `${SITE_URL}/insights/${post.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}/insights` },
        ],
      },
    ],
  }

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden">
        {/* Red glow — top right, matching the hero */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle at top right, rgba(229,52,42,0.16) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-5">
            Insights
          </p>
          <h1
            className="font-black uppercase leading-none tracking-tight text-white mb-6"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)' }}
          >
            Safety insights<br />
            <span className="text-[#e5342a]">from the field</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
            Practical, no-nonsense guidance on incident reporting, HSSE compliance
            and protecting the people who do the work — written for the teams who
            can&apos;t afford to get it wrong.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/insights/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#e5342a]/50 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-bold tracking-widest text-[#e5342a] uppercase">
                  {post.category}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white leading-snug mb-3 group-hover:text-white">
                {post.title}
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mb-6 grow">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-white/40">
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <Clock className="size-3.5" strokeWidth={1.5} />
                  {post.readingTime} min read
                </span>
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#e5342a]">
                Read article
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
