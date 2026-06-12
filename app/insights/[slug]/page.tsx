import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, ChevronRight } from 'lucide-react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PostBody from '@/components/insights/PostBody'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDate,
  SITE_URL,
} from '@/lib/insights'

// Render only the slugs we know about; 404 anything else.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${SITE_URL}/insights/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function InsightPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug)
  const url = `${SITE_URL}/insights/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        articleSection: post.category,
        keywords: post.keywords.join(', '),
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: `${SITE_URL}/images/og-image.png`,
        author: { '@type': 'Organization', name: 'jobsafe', url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: 'Jobmate Ltd',
          url: 'https://jobmate.cloud',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/jobsafe_logo-removebg-preview.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}/insights` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
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

      <article>
        {/* Header */}
        <header className="relative overflow-hidden">
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{
              width: '600px',
              height: '600px',
              background:
                'radial-gradient(circle at top right, rgba(229,52,42,0.14) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-10 md:pt-20">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-white/40 mb-8"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3" />
              <Link href="/insights" className="hover:text-white transition-colors">
                Insights
              </Link>
            </nav>

            <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-5">
              {post.category}
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
              <span>{post.author}</span>
              <span className="text-white/20">•</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" strokeWidth={1.5} />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-6 pb-4">
          <hr className="border-white/10 mb-10" />
          <PostBody blocks={post.content} />
        </div>

        {/* Sources */}
        {post.sources.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 pb-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-bold tracking-widest text-white/60 uppercase mb-4">
                Sources &amp; further reading
              </p>
              <ul className="space-y-2.5">
                {post.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-[#e5342a] transition-colors inline-flex items-start gap-2"
                    >
                      <ArrowRight className="size-3.5 mt-0.5 shrink-0 text-[#e5342a]" strokeWidth={2} />
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </article>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 text-center">
          <div
            className="absolute -bottom-20 -left-20 pointer-events-none"
            style={{
              width: '320px',
              height: '320px',
              background:
                'radial-gradient(circle, rgba(229,52,42,0.16) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              Record. Resolve. Prevent.
            </h2>
            <p className="text-white/50 max-w-md mx-auto mb-7 text-sm leading-relaxed">
              See how jobsafe captures incidents in seconds — online or off — and
              keeps every report audit-ready across your whole field team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={SIGNUP_TRIAL_URL}
                className="bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-7 py-3.5 rounded-md transition-colors"
              >
                Sign up now
              </a>
              <Link
                href="/#how-it-works"
                className="border border-white/20 hover:border-white/40 text-white font-bold text-sm px-7 py-3.5 rounded-md transition-colors"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-6">
            Keep reading
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/insights/${rel.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#e5342a]/50 hover:bg-white/[0.05]"
              >
                <span className="text-[11px] font-bold tracking-widest text-[#e5342a] uppercase mb-3">
                  {rel.category}
                </span>
                <h3 className="text-base font-bold text-white leading-snug mb-4 grow">
                  {rel.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#e5342a]">
                  Read article
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/insights"
            className="mt-10 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} />
            All insights
          </Link>
        </section>
      )}

      <Footer />
    </main>
  )
}
