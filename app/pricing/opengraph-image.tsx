import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = 'Health and safety software pricing'

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: 'Pricing',
    title: TITLE,
    subtitle: 'In pounds, VAT shown, per user per month. Essentials, Professional and Enterprise.',
  })
}
