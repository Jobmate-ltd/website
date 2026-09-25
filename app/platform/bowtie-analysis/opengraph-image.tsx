import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Bowtie analysis software and diagrams"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Prevent",
    title: TITLE,
    subtitle: "Threats, consequences and the barriers between them.",
  })
}
