import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Facilities management health and safety software"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Industries",
    title: TITLE,
    subtitle: "Occupied buildings, contractors and the public: permits, incidents and the estate on one dashboard.",
  })
}
