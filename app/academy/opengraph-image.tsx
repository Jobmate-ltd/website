import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Watch it done'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({ eyebrow: 'jobsafe academy', title: TITLE, subtitle: 'Short recordings of jobsafe, exactly as your team will use it.' })
}
