import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Risk assessment software"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Prevent",
    title: TITLE,
    subtitle: "Scored on a 5×5, controlled by hierarchy, approved before it goes live.",
  })
}
