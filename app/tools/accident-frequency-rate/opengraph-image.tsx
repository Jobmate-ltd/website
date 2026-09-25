import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Accident frequency rate calculator (AFR)'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Free tools',
    title: TITLE,
    subtitle: 'Reportable injuries against hours worked, per 100,000 hours, with the working shown for PQQs and tenders.',
  })
}
