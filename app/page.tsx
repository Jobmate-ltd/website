import type { Metadata } from 'next'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata } from '@/lib/seo'
import { PlatformHomePage } from '@/components/platform/home-page'
import { HomePhase1 } from '@/components/home/home-phase-1'

/**
 * The homepage. With NEXT_PUBLIC_PLATFORM_LAUNCH off, production renders the
 * Phase 1 page exactly as before (components/home/home-phase-1.tsx). With it
 * on, the Phase 2 platform homepage renders. `buildMetadata('/')` picks the
 * pre-launch or post-launch row from the keyword map the same way.
 */
export const metadata: Metadata = buildMetadata('/', { ogTitle: PLATFORM_LAUNCH ? undefined : 'Record. Resolve. Prevent. — jobsafe' })

export default function Page() {
  return PLATFORM_LAUNCH ? <PlatformHomePage /> : <HomePhase1 />
}
