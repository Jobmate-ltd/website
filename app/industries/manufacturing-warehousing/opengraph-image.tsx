import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Warehouse and manufacturing safety software"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Industries",
    title: TITLE,
    subtitle: "Lines, high bays and forklifts: the 5\u00d75, the plant register and the bowtie on one record.",
  })
}
