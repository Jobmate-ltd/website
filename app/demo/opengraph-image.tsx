import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'See jobsafe working'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Book a demo',
    title: TITLE,
    subtitle: 'A 30-minute walkthrough on a UK haulier’s setup, live, by someone who knows the product.',
  })
}
