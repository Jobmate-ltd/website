import { OG_CONTENT_TYPE, OG_SIZE, ogAlt, ogImage } from '@/lib/og'

const TITLE = "Contractor management software for UK sites"

export const alt = ogAlt(TITLE)
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogImage({
    eyebrow: "Resolve",
    title: TITLE,
    subtitle: "Insurance, RAMS, accreditation and the last audit, checked at the gate.",
  })
}
