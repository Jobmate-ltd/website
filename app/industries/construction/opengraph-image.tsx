import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Construction health and safety software"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Industries",
    title: TITLE,
    subtitle: "Sites, principal contractors and the trades: the permit gate, the RAMS and the RIDDOR verdict on one record.",
  })
}
