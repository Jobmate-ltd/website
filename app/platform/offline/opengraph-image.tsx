import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'An offline health and safety app'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Works offline',
    title: TITLE,
    subtitle: 'For the yard, the basement and the cab. Saves to the phone first, syncs when signal returns.',
  })
}
