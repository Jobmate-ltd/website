import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ModulePageTemplate } from '@/components/platform/module-page'

/** Phase 3 module page; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on (the template calls notFound()). */
export const metadata: Metadata = buildMetadata('/platform/training-competence')

export default function Page() {
  return <ModulePageTemplate id="training" />
}
