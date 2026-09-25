import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Free 5x5 risk matrix calculator'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Free tools',
    title: TITLE,
    subtitle: 'Likelihood against severity, the band and the action, with the hierarchy of control beside it.',
  })
}
