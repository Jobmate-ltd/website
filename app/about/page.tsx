import type { Metadata } from 'next'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata } from '@/lib/seo'
import { AboutPhase1 } from '@/components/about/about-phase-1'
import { AboutPlatform } from '@/components/about/about-platform'

/**
 * /about. With the launch flag off it is the Phase 1 page, unchanged
 * (components/about/about-phase-1.tsx). With it on, the rewrite: from
 * incident reporting to a platform, the true short list of what jobsafe does
 * not do, the disambiguation section kept, the maker and hosting lines.
 */
export const metadata: Metadata = buildMetadata('/about', { ogTitle: PLATFORM_LAUNCH ? undefined : 'About jobsafe' })

export default function Page() {
  return PLATFORM_LAUNCH ? <AboutPlatform /> : <AboutPhase1 />
}
