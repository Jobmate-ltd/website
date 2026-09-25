import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Fleet and plant compliance software: MOT to LOLER"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Record",
    title: TITLE,
    subtitle: "Every statutory date on every vehicle, before it lapses.",
  })
}
