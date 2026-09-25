import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Your safety records stay in the UK'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Security',
    title: TITLE,
    subtitle: 'London hosting, each organisation walled off, six role levels, CSV export.',
  })
}
