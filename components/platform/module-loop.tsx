'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FAMILIES, MODULES, moduleById, type Family, type ModuleId } from '@/lib/platform'
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { PlatformIcon } from '@/components/platform/icons'

/**
 * ModuleLoop — the modules around one record, on Magic UI's orbiting-circles
 * (the ring) and animated-beam (the connections). Hover or focus a module
 * and the orbit pauses while beams show what it feeds; the same feeds are
 * listed in words underneath so nothing depends on a pointer or on motion.
 *
 * Feeds, from the product: a checklist failure raises an action; a hazard
 * raises an action; a permit checks the contractor and a live risk
 * assessment; an incident opens RIDDOR triage and raises actions.
 */
const FEEDS: readonly { from: ModuleId; to: readonly ModuleId[]; label: string }[] = [
  { from: 'checklists', to: ['actions'], label: 'A checklist failure raises an action.' },
  { from: 'risk', to: ['actions'], label: 'A hazard on a risk assessment raises an action.' },
  { from: 'permits', to: ['contractors', 'risk'], label: 'A permit checks the contractor record and requires a live risk assessment before it issues.' },
  { from: 'incidents', to: ['riddor', 'actions'], label: 'An incident opens RIDDOR triage and raises the actions from its investigation.' },
  { from: 'riddor', to: ['actions'], label: 'A RIDDOR verdict puts its deadline on the register and the follow-up on the board.' },
]

const FAMILY_TINT: Record<Family, string> = {
  record: 'bg-brand-tint-08 text-brand border-brand-tint-18',
  resolve: 'bg-info-tint text-info-text border-info-tint',
  prevent: 'bg-good-tint text-good-text border-good-tint',
}

export function ModuleLoop() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  // One stable RefObject per module, created once; the beams read them, never a ref during render.
  const nodeRefs = React.useMemo(() => Object.fromEntries(MODULES.map((m) => [m.id, React.createRef<HTMLButtonElement>()])) as Record<ModuleId, React.RefObject<HTMLButtonElement | null>>, [])
  const [active, setActive] = React.useState<ModuleId | null>(null)
  const [radius, setRadius] = React.useState(210)

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setRadius(mq.matches ? 210 : 132)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const feeds = active ? FEEDS.filter((f) => f.from === active) : []
  const targets = new Set(feeds.flatMap((f) => f.to))

  return (
    <div className="flex flex-col gap-8">
      <div
        ref={containerRef}
        data-paused={active !== null}
        className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[30rem] data-[paused=true]:[&_.animate-orbit]:[animation-play-state:paused]"
        onMouseLeave={() => setActive(null)}
      >
        <div className="absolute left-1/2 top-1/2 z-10 flex size-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-pill border border-line-1 bg-canvas text-center shadow-hover sm:size-36">
          <span className="type-eyebrow text-brand-strong">One</span>
          <span className="text-base font-extrabold leading-tight text-ink-1 sm:text-lg">record</span>
        </div>
        <OrbitingCircles radius={radius} duration={90} iconSize={radius > 150 ? 52 : 40} startAngle={-90}>
          {MODULES.map((module) => {
            const isActive = active === module.id
            const isTarget = targets.has(module.id)
            return (
              <button
                key={module.id}
                type="button"
                ref={nodeRefs[module.id]}
                aria-pressed={isActive}
                aria-label={`${module.name}: ${module.promise}`}
                onMouseEnter={() => setActive(module.id)}
                onFocus={() => setActive(module.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((current) => (current === module.id ? null : module.id))}
                className={cn(
                  'flex size-full items-center justify-center rounded-pill border shadow-rest transition-[transform,box-shadow] duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 [&>svg]:size-[45%]',
                  FAMILY_TINT[module.family],
                  (isActive || isTarget) && 'scale-110 shadow-hover ring-2 ring-brand ring-offset-2',
                )}
              >
                <PlatformIcon name={module.icon} />
              </button>
            )
          })}
        </OrbitingCircles>
        {feeds.flatMap((feed) => feed.to.map((to) => <AnimatedBeam key={`${feed.from}-${to}`} containerRef={containerRef} fromRef={nodeRefs[feed.from]} toRef={nodeRefs[to]} duration={2.5} pathWidth={2} />))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 type-small text-ink-4" aria-label="Legend">
          {(Object.keys(FAMILIES) as Family[]).map((family) => (
            <span key={family} className="inline-flex items-center gap-2">
              <span aria-hidden="true" className={cn('size-3 rounded-pill border', FAMILY_TINT[family])} />
              {FAMILIES[family].name}
            </span>
          ))}
        </div>
        <div aria-live="polite" className="min-h-6 text-sm font-semibold text-ink-1">
          {active ? (feeds.length ? feeds.map((f) => f.label).join(' ') : `${moduleById(active).name}: ${moduleById(active).promise}`) : 'Hover or focus a module to see what it feeds.'}
        </div>
        <ul className="grid gap-2 sm:grid-cols-2" aria-label="What feeds what">
          {FEEDS.map((feed) => (
            <li key={feed.from + feed.to.join()} className="flex items-start gap-2 rounded-control border border-line-1 bg-canvas p-3 text-sm text-ink-2">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill bg-brand-tint-08 text-brand [&>svg]:size-3.5">
                <PlatformIcon name={moduleById(feed.from).icon} />
              </span>
              <span>
                {feed.label}{' '}
                {moduleById(feed.from).path ? (
                  <Link href={moduleById(feed.from).path as string} className="font-bold text-brand-strong hover:underline">
                    {moduleById(feed.from).name} →
                  </Link>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ModuleLoop
