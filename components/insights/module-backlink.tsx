import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { MODULES } from '@/lib/platform'
import { linksFrom, moduleFor } from '@/lib/seo/links'
import { FREE_TOOL_LINKS } from '@/lib/site'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { PlatformIcon } from '@/components/platform/icons'

/**
 * ModuleBacklink — the contextual link from an article (or the toolkit) back
 * to the module it clusters around, per lib/seo/links.ts, and (Phase 3) to
 * the free tool that runs the same logic when the registry lists one. Renders
 * nothing at all (not even its wrapper) while the launch flag is off, because
 * the module pages do not exist then and the flag-off HTML must not change.
 *
 * @example
 *   <ModuleBacklink path="/insights/riddor-reporting-explained" />
 *   <ModuleBacklink path="/toolkit" bare />
 */
export function ModuleBacklink({ path, bare = false }: { path: string; bare?: boolean }) {
  if (!PLATFORM_LAUNCH) return null
  const href = moduleFor(path)
  const mod = MODULES.find((m) => m.path === href)
  if (!href || !mod) return null
  const toolHref = linksFrom(path).find((link) => link.startsWith('/tools'))
  const tool = FREE_TOOL_LINKS.find((link) => link.href === toolHref)
  const card = (
    <div className="flex flex-col gap-4">
    <Card className="flex flex-col gap-3 border-brand-tint-18 bg-brand-tint-04 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-canvas text-brand shadow-rest">
          <PlatformIcon name={mod.icon} className="size-5" />
        </span>
        <div>
          <p className="type-eyebrow text-brand-strong">In the platform</p>
          <p className="mt-1 text-base font-bold text-ink-1">{mod.name}</p>
          <p className="type-small text-ink-4">{mod.promise}</p>
        </div>
      </div>
      <Link href={href} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-bold text-brand-strong hover:underline focus-visible:outline-none focus-visible:underline">
        See the module
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Card>
    {tool ? (
      <Card className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
            <Calculator className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="type-eyebrow text-brand-strong">Free tool</p>
            <p className="mt-1 text-base font-bold text-ink-1">{tool.label}</p>
            <p className="type-small text-ink-4">{tool.description}</p>
          </div>
        </div>
        <Link href={tool.href} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-bold text-brand-strong hover:underline focus-visible:outline-none focus-visible:underline">
          Open the tool
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Card>
    ) : null}
    </div>
  )
  return bare ? card : <Container size="prose" className="pt-8">{card}</Container>
}

export default ModuleBacklink
