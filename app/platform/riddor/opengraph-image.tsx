import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "RIDDOR reporting software"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Record",
    title: TITLE,
    subtitle: "Whether it is reportable, and by when, before you have finished typing.",
  })
}
