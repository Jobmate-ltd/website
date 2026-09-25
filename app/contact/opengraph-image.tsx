import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Contact jobsafe'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Contact',
    title: TITLE,
    subtitle: 'Sales, support and a phone number that is answered. Made by Jobmate Ltd, Wolverhampton.',
  })
}
