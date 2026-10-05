'use client'

import * as React from 'react'
import Image, { getImageProps } from 'next/image'
import { FileBadge, Gavel, LayoutDashboard, Truck, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRODUCT_IMAGES, type ProductImageId } from '@/lib/product-images'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BorderBeam } from '@/components/ui/border-beam'
import { GlassFrame } from '@/components/ui/glass-frame'

/**
 * HeroScreens — the tabbed product screenshot in the homepage hero, on the
 * shadcnblocks "Hero 195" pattern: a TabsList with icons on desktop, a wide
 * 2:1 capture in a liquid-glass pane (GlassFrame) with a crimson border beam
 * running round the glass, and a dot navigation with the active icon on
 * small screens.
 *
 * Four real screens cycle every four seconds (dashboard → RIDDOR verdict →
 * permit gate → fleet); tabs switch by hand; cycling pauses while the block
 * is hovered or focused and never runs under `prefers-reduced-motion`. Only
 * the current screen is in the DOM (the first is the LCP candidate); the
 * others are prefetched once the page has settled.
 */
const SCREENS: readonly { id: ProductImageId; title: string; icon: LucideIcon }[] = [
  { id: 'dashboard-hero-desktop', title: 'Dashboard', icon: LayoutDashboard },
  { id: 'riddor-verdict-desktop', title: 'RIDDOR verdict', icon: Gavel },
  { id: 'permits-gate-desktop', title: 'Permit gate', icon: FileBadge },
  { id: 'fleet-cards-desktop', title: 'Fleet', icon: Truck },
]

const INTERVAL_MS = 4000
const SIZES = '(min-width: 1536px) 1360px, 100vw'

export function HeroScreens() {
  const [active, setActive] = React.useState<ProductImageId>(SCREENS[0].id)
  const [paused, setPaused] = React.useState(false)
  const [reduced, setReduced] = React.useState(true)
  const index = Math.max(0, SCREENS.findIndex((s) => s.id === active))
  const ActiveIcon = SCREENS[index].icon

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  React.useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => setActive((current) => SCREENS[(SCREENS.findIndex((s) => s.id === current) + 1) % SCREENS.length].id), INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduced, paused])

  React.useEffect(() => {
    const run = () => {
      for (const screen of SCREENS.slice(1)) {
        const image = PRODUCT_IMAGES[screen.id]
        const { props } = getImageProps({ src: image.webp, alt: '', width: image.width, height: image.height, sizes: SIZES })
        const img = new window.Image()
        if (props.srcSet) img.srcset = props.srcSet
        if (props.sizes) img.sizes = props.sizes
        img.src = props.src
      }
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(run, 2000)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      <Tabs value={active} onValueChange={(value) => setActive(value as ProductImageId)}>
        <div className="hidden md:flex md:justify-center">
          <TabsList aria-label="Product screens" className="mb-6 h-auto flex-wrap gap-1 lg:gap-2">
            {SCREENS.map((screen) => {
              const Icon = screen.icon
              return (
                <TabsTrigger key={screen.id} value={screen.id} className="gap-2 px-3 py-2 lg:text-[15px]">
                  <Icon aria-hidden="true" />
                  {screen.title}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <GlassFrame url="app.jobsafe.cloud" adornment={<BorderBeam duration={10} size={180} />} screenAspect="2 / 1">
          {SCREENS.map((screen) => {
            const image = PRODUCT_IMAGES[screen.id]
            return (
              <TabsContent key={screen.id} value={screen.id} className="mt-0 size-full animate-fade-in">
                <Image src={image.webp} alt={image.alt} width={image.width} height={image.height} priority={screen.id === SCREENS[0].id} sizes={SIZES} />
              </TabsContent>
            )
          })}
        </GlassFrame>

        {/* Small screens: dots plus the active screen's icon and name. */}
        <nav className="mt-6 flex flex-col items-center gap-3 md:hidden" aria-label="Product screens">
          <div className="flex items-center" role="tablist">
            {SCREENS.map((screen) => {
              const selected = screen.id === active
              return (
                <button
                  key={screen.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={screen.title}
                  onClick={() => setActive(screen.id)}
                  className="flex min-h-11 min-w-11 items-center justify-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <span aria-hidden="true" className={cn('block h-1.5 rounded-pill transition-[width,background-color] duration-200 ease-out-expo', selected ? 'w-8 bg-ink-1' : 'w-1.5 bg-grey-400')} />
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2 rounded-control border border-line-1 bg-bg px-3 py-2 text-sm font-bold text-ink-1">
            <ActiveIcon className="size-4 text-brand" aria-hidden="true" />
            {SCREENS[index].title}
          </div>
        </nav>
      </Tabs>
      <span className="sr-only" aria-live="polite">
        Showing {SCREENS[index].title}
      </span>
    </div>
  )
}

export default HeroScreens
