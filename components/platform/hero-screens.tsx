'use client'

import * as React from 'react'
import Image, { getImageProps } from 'next/image'
import { FileBadge, Gavel, LayoutDashboard, Truck, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRODUCT_IMAGES, type ProductImageId } from '@/lib/product-images'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BorderBeam } from '@/components/ui/border-beam'

/**
 * HeroScreens — the tabbed product screenshot in the homepage hero, on the
 * shadcnblocks "Hero 195" pattern: a TabsList with icons on desktop, a wide
 * 16:10 capture with a hairline, a quiet shadow and a crimson border beam,
 * dashed ornamental frame lines, and a dot navigation with the active icon on
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
const SIZES = '(min-width: 1280px) 1152px, 100vw'
const FADE = 'pointer-events-none absolute -inset-x-[20%] h-px [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]'
const FADE_Y = 'pointer-events-none absolute -inset-y-[20%] w-px [mask-image:linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]'

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

        <div className="relative isolate">
          <div className="relative z-10">
            {SCREENS.map((screen) => {
              const image = PRODUCT_IMAGES[screen.id]
              return (
                <TabsContent key={screen.id} value={screen.id} className="relative mt-0 animate-fade-in rounded-frame bg-canvas">
                  <Image
                    src={image.webp}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    priority={screen.id === SCREENS[0].id}
                    sizes={SIZES}
                    className="block aspect-[2/1] w-full rounded-frame border border-line-1 object-cover object-top shadow-frame"
                  />
                  <BorderBeam duration={8} size={140} />
                </TabsContent>
              )
            })}
          </div>
          {/* Ornamental frame lines, in line-1 with a fade at each end. */}
          <span aria-hidden="true" className={cn(FADE, 'top-0 -z-10 bg-line-1')} />
          <span aria-hidden="true" className={cn(FADE, 'bottom-0 -z-10 bg-line-1')} />
          <span aria-hidden="true" className={cn(FADE, 'top-12 border-t border-dashed border-line-1')} />
          <span aria-hidden="true" className={cn(FADE, 'bottom-12 border-t border-dashed border-line-1')} />
          <span aria-hidden="true" className={cn(FADE_Y, 'left-[16.666%] border-r border-dashed border-line-1')} />
          <span aria-hidden="true" className={cn(FADE_Y, 'right-[16.666%] border-r border-dashed border-line-1')} />
        </div>

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
