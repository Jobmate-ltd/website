import { PLATFORM_LAUNCH } from '@/lib/brand'
import { activeNav, type NavConfig } from '@/lib/site'
import { HeaderPhase1 } from '@/components/site/header-phase-1'
import { PlatformHeader } from '@/components/site/platform-header'

/**
 * Header — the site header for the current build.
 *
 * With NEXT_PUBLIC_PLATFORM_LAUNCH off, production renders the Phase 1 header
 * exactly as before (components/site/header-phase-1.tsx). With it on, the
 * Phase 2 mega-menu renders (components/site/platform-header.tsx). The flag
 * is inlined at build time, so the unused header's code never reaches the
 * browser. Pass `nav` to override the config in either state.
 *
 * @example
 *   <Header />
 */
export function Header({ nav }: { nav?: NavConfig }) {
  if (PLATFORM_LAUNCH) return <PlatformHeader nav={nav ?? activeNav(true)} />
  return <HeaderPhase1 nav={nav} />
}

export default Header
