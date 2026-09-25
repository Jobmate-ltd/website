import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COMPARE_PAGES, PLATFORM_LAUNCH } from '@/lib/brand'
import { COMPARE_PATHS } from '@/lib/seo/links'
import { buildMetadata } from '@/lib/seo'
import { ComparePageTemplate } from '@/components/compare/compare-page'

/** Phase 3 comparison page; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH and NEXT_PUBLIC_COMPARE_PAGES are both on. */
export const metadata: Metadata = buildMetadata(COMPARE_PATHS.mitti)

export default function Page() {
  if (!PLATFORM_LAUNCH || !COMPARE_PAGES) notFound()
  return <ComparePageTemplate slug="mitti-safetyculture" />
}
