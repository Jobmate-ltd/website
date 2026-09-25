import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Safety insights from the field'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({ eyebrow: 'Insights', title: TITLE, subtitle: 'Incident reporting, RIDDOR, near misses and lone worker safety, in plain English.' })
}
