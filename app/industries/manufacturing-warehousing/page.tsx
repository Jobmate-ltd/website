import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { IndustryPageTemplate } from '@/components/industries/industry-page'
import { manufacturingWarehousing } from '@/lib/industries/manufacturing-warehousing'

/** Phase 3 industry page; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on (the template calls notFound()). */
export const metadata: Metadata = buildMetadata('/industries/manufacturing-warehousing')

export default function Page() {
  return <IndustryPageTemplate content={manufacturingWarehousing} />
}
