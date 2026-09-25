import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Free health and safety tools'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Free tools',
    title: TITLE,
    subtitle: 'A RIDDOR checker, a 5×5 risk matrix and an accident frequency rate calculator, built from the product.',
  })
}
