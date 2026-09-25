import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

export const alt = ogAlt('Record. Resolve. Prevent.')
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Incident reporting software',
    title: 'Record. Resolve. Prevent.',
    subtitle: 'Mobile incident reporting for UK field teams, transport operators and industrial sites.',
  })
}
