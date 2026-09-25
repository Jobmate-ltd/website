import { getAllPosts, getPostBySlug } from '@/lib/insights'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return ogImage({
    eyebrow: post?.category ?? 'Insights',
    title: post?.seoTitle ?? post?.title ?? 'Insights',
    subtitle: post ? `${post.readingTime} min read` : undefined,
  })
}
