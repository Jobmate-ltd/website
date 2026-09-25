import type { Metadata } from 'next'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata } from '@/lib/seo'
import { IndustryPage } from '@/components/site/industry-page'
import { IndustryPageTemplate } from '@/components/industries/industry-page'
import { care } from '@/lib/industries/care'
import { content as phase1, metadata as phase1Metadata } from './phase-1'

/**
 * With NEXT_PUBLIC_PLATFORM_LAUNCH off this page renders its Phase 1 version
 * exactly as before (./phase-1.tsx, metadata included). With it on, the
 * Phase 3 industry page renders from lib/industries/care.ts with the
 * launch row of the keyword map.
 */
export const metadata: Metadata = PLATFORM_LAUNCH ? buildMetadata('/industries/healthcare') : phase1Metadata

export default function HealthcarePage() {
  return PLATFORM_LAUNCH ? <IndustryPageTemplate content={care} /> : <IndustryPage content={phase1} />
}
