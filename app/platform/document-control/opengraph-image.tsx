import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Document control software for health and safety"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Prevent",
    title: TITLE,
    subtitle: "The current version, in front of the people allowed to see it.",
  })
}
