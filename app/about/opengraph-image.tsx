import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'About jobsafe'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'About',
    title: TITLE,
    subtitle: 'UK workplace incident reporting, made by Jobmate Ltd in Wolverhampton.',
  })
}
