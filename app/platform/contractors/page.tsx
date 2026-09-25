import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ModulePageTemplate } from '@/components/platform/module-page'

/**
 * Gated on PHASE_3_INPUTS.contractorCrudShipped (lib/brand.ts): 404, out of the menu and the
 * sitemap until the product ships it. The template checks the gate.
 */
/** Phase 3 module page; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on (the template calls notFound()). */
export const metadata: Metadata = buildMetadata('/platform/contractors')

export default function Page() {
  return <ModulePageTemplate id="contractors" />
}
