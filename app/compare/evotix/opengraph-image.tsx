import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "jobsafe vs Evotix: a UK comparison"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Compare",
    title: TITLE,
    subtitle: "15 rows, every claim sourced and dated.",
  })
}
