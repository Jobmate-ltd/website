'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navPromo, type NavConfig, type NavItem } from '@/lib/site'
import { Wordmark } from '@/components/ui/wordmark'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuListItem,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

/**
 * PlatformHeader — the Phase 2 header: the mega-menu on shadcn/ui
 * NavigationMenu (21st.dev navigation-menu-06 as the visual reference), a
 * full-height Sheet with accordion groups on small screens, the unchanged
 * Log in / Sign up links and Book a demo as the primary action.
 *
 * It renders whatever NavConfig it is given; `activeNav()` in lib/site.ts
 * has already removed every link whose page does not exist, so nothing here
 * can point at a 404. Only rendered when NEXT_PUBLIC_PLATFORM_LAUNCH is on.
 *
 * @example
 *   <PlatformHeader nav={activeNav()} />
 */
const SHOW_FROM = {
  always: '',
  lg: 'hidden lg:inline-flex',
  xl: 'hidden xl:inline-flex',
  '2xl': 'hidden 2xl:inline-flex',
} as const

function PromoCard({ label }: { label: string }) {
  const promo = navPromo(label)
  if (!promo) return null
  return (
    <NavigationMenuLink asChild>
      <Link
        href={promo.href}
        className="flex h-full flex-col justify-between rounded-control border border-line-1 bg-bg p-4 no-underline outline-none transition-colors duration-200 hover:border-grey-400 focus:border-grey-400"
      >
        <div>
          <p className="type-eyebrow text-brand-strong">{promo.eyebrow}</p>
          <p className="mt-2 text-base font-bold leading-snug text-ink-1">{promo.title}</p>
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong">
          {promo.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </NavigationMenuLink>
  )
}

function DesktopItem({ item }: { item: NavItem }) {
  if (item.columns?.length) {
    const promo = navPromo(item.label)
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className={cn('grid w-[min(64rem,calc(100vw-2rem))] gap-2 p-3', promo ? 'grid-cols-[repeat(3,minmax(0,1fr))_15rem]' : 'grid-cols-3')}>
            {item.columns.map((column) => (
              <div key={column.heading}>
                <p className="type-eyebrow px-3 pb-2 pt-1 text-ink-4">{column.heading}</p>
                <ul className="grid gap-0.5">
                  {column.items.map((child) => (
                    <NavigationMenuListItem key={child.href} href={child.href} title={child.label}>
                      {child.description}
                    </NavigationMenuListItem>
                  ))}
                </ul>
              </div>
            ))}
            {promo ? <PromoCard label={item.label} /> : null}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }
  if (item.children?.length) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[340px] gap-0.5 p-2">
            {item.children.map((child) => (
              <NavigationMenuListItem key={child.href} href={child.href} title={child.label}>
                {child.description}
              </NavigationMenuListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), 'px-2.5 xl:px-3')}>
        <Link href={item.href}>{item.label}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

function MobileGroup({ item, onSelect }: { item: NavItem; onSelect: () => void }) {
  const groups = item.columns?.length ? item.columns : item.children?.length ? [{ heading: '', items: item.children }] : []
  if (!groups.length) {
    return (
      <li className="border-b border-line-1">
        <Link href={item.href} onClick={onSelect} className="flex min-h-14 items-center text-xl font-extrabold tracking-[-0.02em] text-ink-1">
          {item.label}
        </Link>
      </li>
    )
  }
  return (
    <AccordionItem value={item.label} className="border-line-1">
      <AccordionTrigger className="min-h-14 text-xl font-extrabold tracking-[-0.02em]">{item.label}</AccordionTrigger>
      <AccordionContent className="pb-4">
        {groups.map((group) => (
          <div key={group.heading || item.label} className="mb-3 last:mb-0">
            {group.heading ? <p className="type-eyebrow pb-1 pt-2 text-ink-4">{group.heading}</p> : null}
            <ul>
              {group.items.map((child) => (
                <li key={child.href}>
                  <Link href={child.href} onClick={onSelect} className="flex min-h-11 items-center text-base font-semibold text-ink-3 hover:text-ink-1">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export function PlatformHeader({ nav }: { nav: NavConfig }) {
  const [open, setOpen] = React.useState(false)
  const close = React.useCallback(() => setOpen(false), [])

  return (
    <header
      className="sticky z-50 border-b border-line-1 bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/85"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="jobsafe home" className="flex shrink-0 items-center rounded-control">
          <Wordmark height={36} priority />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              {nav.items.map((item) => (
                <DesktopItem key={item.label} item={item} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {nav.actions.map((action) => {
            if (action.kind === 'demo') {
              return <BookDemoButton key={action.kind} placement={action.placement ?? 'navbar'} size="sm" />
            }
            return (
              <Button key={action.kind} variant={action.kind === 'signup' ? 'secondary' : 'ghost'} size="sm" asChild className={SHOW_FROM[action.showFrom]}>
                <a href={action.href}>{action.label}</a>
              </Button>
            )
          })}

          <Sheet open={open} onOpenChange={setOpen}>
            <Button variant="secondary" size="icon" onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open menu" aria-expanded={open}>
              <Menu aria-hidden="true" />
            </Button>
            <SheetContent side="top" hideClose aria-describedby={undefined} className="inset-0 h-dvh w-full max-w-none overflow-y-auto border-none p-0 lg:hidden">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex min-h-full flex-col">
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-line-1 px-4 sm:px-6">
                  <Link href="/" aria-label="jobsafe home" onClick={close}>
                    <Wordmark height={36} />
                  </Link>
                  <SheetClose asChild>
                    <Button variant="secondary" size="icon" aria-label="Close menu">
                      <X aria-hidden="true" />
                    </Button>
                  </SheetClose>
                </div>

                <nav aria-label="Primary" className="flex-1 px-4 pt-2 sm:px-6">
                  <Accordion type="multiple" asChild>
                    <ul>
                      {nav.items.map((item) => (
                        <MobileGroup key={item.label} item={item} onSelect={close} />
                      ))}
                    </ul>
                  </Accordion>
                </nav>

                <div
                  className="sticky bottom-0 flex flex-col gap-3 border-t border-line-1 bg-canvas px-4 pt-4 sm:px-6"
                  style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
                >
                  {nav.actions.map((action) => {
                    if (action.kind === 'demo') {
                      return <BookDemoButton key={action.kind} placement="mobile-menu" size="lg" block onClick={close} />
                    }
                    return (
                      <Button key={action.kind} variant={action.kind === 'signup' ? 'secondary' : 'ghost'} size="lg" block asChild>
                        <a href={action.href}>{action.label}</a>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default PlatformHeader
