import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { formatDate, getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/insights'
import { OG_IMAGE, SIGNUP_TRIAL_URL, SITE_URL, canonicalFor } from '@/lib/brand'
import { blogPostingSchema, breadcrumbSchema, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PostBody } from '@/components/insights/post-body'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HeroBackdrop } from '@/components/ui/hero-backdrop'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { CtaBand } from '@/components/ui/cta-band'

// Render only the slugs we know about; 404 anything else.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return pageMetadata({
    path: `/insights/${post.slug}`,
    title: post.seoTitle ?? post.title,
    description: post.description,
    ogTitle: post.title,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    authors: [post.author],
  })
}

const linkClass = 'font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 hover:decoration-brand-strong'

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug)
  const path = `/insights/${post.slug}`
  const url = canonicalFor(path)

  const pageGraph = jsonLd(
    graph(
      blogPostingSchema({
        url,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        section: post.category,
        tags: post.keywords,
        author: post.author,
        image: `${SITE_URL}${OG_IMAGE.path}`,
      }),
      breadcrumbSchema([
        { name: 'Home', item: `${SITE_URL}/` },
        { name: 'Insights', item: `${SITE_URL}/insights` },
        { name: post.title, item: url },
      ]),
    ),
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
        <article>
          <header className="relative overflow-hidden border-b border-line-1 bg-canvas">
            <HeroBackdrop radial="right" beam={false} />
            <Container size="prose" className="relative pb-10 pt-10 md:pb-12 md:pt-14">
              <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Insights', href: '/insights' }, { name: post.title, href: path }]} className="mb-8" />
              <Eyebrow className="mb-4">{post.category}</Eyebrow>
              <h1 className="type-h2 text-ink-1 md:text-[48px]">{post.title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 type-small text-ink-5">
                <span>{post.author}</span>
                <span aria-hidden="true" className="text-grey-400">
                  •
                </span>
                <time dateTime={post.date} className="type-mono text-xs">
                  {formatDate(post.date)}
                </time>
                <span aria-hidden="true" className="text-grey-400">
                  •
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {post.readingTime} min read
                </span>
              </div>
            </Container>
          </header>

          <Container size="prose" className="pt-10">
            <PostBody blocks={post.content} />
          </Container>

          {post.sources.length > 0 ? (
            <Container size="prose" className="pb-4 pt-6">
              <Card className="p-6">
                <p className="type-eyebrow mb-4 text-ink-4">Sources and further reading</p>
                <ul className="flex flex-col gap-2.5">
                  {post.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm text-ink-3 transition-colors hover:text-ink-1">
                        <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                        <span>
                          {source.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </Container>
          ) : null}
        </article>

        <CtaBand
          placement="insights-article-cta"
          title="Record. Resolve. Prevent."
          copy="See how jobsafe captures incidents on the spot, online or off, and keeps every report audit-ready across your whole field team."
          secondary={{ label: 'Sign up now', href: SIGNUP_TRIAL_URL }}
          note={
            <Link href="/#how-it-works" className={linkClass}>
              See how it works
            </Link>
          }
        />

        {related.length > 0 ? (
          <Section>
            <Eyebrow className="mb-6">Keep reading</Eyebrow>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link href={`/insights/${rel.slug}`} className="group block h-full rounded-control">
                    <Card interactive className="flex h-full flex-col gap-3 p-6">
                      <Chip status="brand">{rel.category}</Chip>
                      <h3 className="type-h3 flex-1 text-ink-1">{rel.title}</h3>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong">
                        Read article
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
                      </span>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/insights" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink-4 transition-colors hover:text-ink-1">
              <ArrowLeft className="size-4" aria-hidden="true" />
              All insights
            </Link>
          </Section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
