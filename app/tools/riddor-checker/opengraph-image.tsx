import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Is it RIDDOR reportable? Free RIDDOR checker'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Free tools',
    title: TITLE,
    subtitle: 'The category, the reasons and the date the report must reach HSE, from the product’s own triage.',
  })
}
