import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Health and safety management software, in one record'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'The platform',
    title: TITLE,
    subtitle: 'Incidents, RIDDOR, risk and bowtie, permits, checklists, fleet, training and documents. Offline.',
  })
}
