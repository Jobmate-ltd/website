import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { formatDate, getAllPosts } from '@/lib/insights'
import { BRAND, OG_IMAGE, SITE_URL, canonicalFor } from '@/lib/brand'
import { blogSchema, breadcrumbSchema, graph, jsonLd } from '@/lib/schema'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Reveal } from '@/components/ui/reveal'

const PATH = '/insights'
const URL = canonicalFor(PATH)

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Insights: incident reporting, RIDDOR and field safety',
  description:
    'Practical guidance on workplace incident reporting, HSSE compliance, RIDDOR, near misses and lone worker safety, written for field service, construction and industrial teams.',
  ogTitle: 'Safety insights from the field | jobsafe',
})

export default function InsightsIndex() {
  const posts = getAllPosts()

  const pageGraph = jsonLd(
    graph(
      blogSchema(
        URL,
        posts.map((post) => ({
          url: `${SITE_URL}/insights/${post.slug}`,
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          section: post.category,
          tags: post.keywords,
          author: post.author,
          image: `${SITE_URL}${OG_IMAGE.path}`,
        })),
      ),
      breadcrumbSchema([
        { name: 'Home', item: `${SITE_URL}/` },
        { name: 'Insights', item: URL },
      ]),
    ),
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
        <PageHero
          breadcrumbs={<Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Insights', href: PATH }]} />}
          eyebrow="Insights"
          title={
            <>
              Safety insights <span className="text-brand">from the field</span>
            </>
          }
          lead={`Practical, no-nonsense guidance on incident reporting, HSSE compliance and protecting the people who do the work. Written by the ${BRAND} team for the teams who cannot afford to get it wrong.`}
        />

        <Section>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.slug} index={i % 3}>
                <Link href={`/insights/${post.slug}`} className="group block h-full rounded-control">
                  <Card interactive className="flex h-full flex-col gap-4 p-6">
                    <Chip status="brand">{post.category}</Chip>
                    <h2 className="type-h3 text-ink-1">{post.title}</h2>
                    <p className="type-small flex-1 text-ink-5">{post.excerpt}</p>
                    <div className="flex items-center justify-between border-t border-line-1 pt-4 type-small text-ink-5">
                      <time dateTime={post.date} className="type-mono text-xs">
                        {formatDate(post.date)}
                      </time>
                      <span className="flex items-center gap-1.5 text-xs">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {post.readingTime} min read
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong">
                      Read article
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  )
}
