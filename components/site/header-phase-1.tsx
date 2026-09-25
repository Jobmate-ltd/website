'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV, type NavConfig, type NavItem } from '@/lib/site'
import { Wordmark } from '@/components/ui/wordmark'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'

/**
 * Header — the site header, driven entirely by a NavConfig.
 *
 * Light: canvas at 85% with blur, a line-1 bottom border, sticky with
 * `top: env(safe-area-inset-top)`. Items with `children` render a disclosure
 * dropdown; items with `columns` render a multi-column panel (the Phase 2
 * mega-menu, which can swap in <NavigationMenu/> from components/ui when it
 * goes live). On small screens the same config renders as a full-screen
 * native <dialog>. Sign up and Log in point where they point today.
 *
 * Deliberately no Radix here: the header is on every page and above every
 * LCP element, so it carries only what a phone must parse before the hero
 * paints — a few hundred bytes of disclosure logic and the platform's own
 * modal dialog (focus trap, Escape, inert page) instead of ~30 KB of menu
 * primitives.
 *
 * @example
 *   <Header />               // today's nav
 *   <Header nav={PHASE2_NAV} />
 */
const SHOW_FROM = {
  always: '',
  lg: 'hidden lg:inline-flex',
  xl: 'hidden xl:inline-flex',
  '2xl': 'hidden 2xl:inline-flex',
} as const

const linkStyle =
  'inline-flex h-10 items-center rounded-control px-2.5 text-sm font-semibold text-ink-3 transition-colors duration-200 ease-out-expo hover:bg-line-3 hover:text-ink-1 focus-visible:bg-line-3 focus-visible:text-ink-1 xl:px-3'

function PanelLink({ href, title, children, onSelect }: { href: string; title: string; children?: React.ReactNode; onSelect: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onSelect}
        className="block rounded-control px-3 py-2 transition-colors duration-200 ease-out-expo hover:bg-line-3 focus-visible:bg-line-3"
      >
        <span className="block text-sm font-bold text-ink-1">{title}</span>
        {children ? <span className="mt-0.5 block text-[13px] leading-snug text-ink-5">{children}</span> : null}
      </Link>
    </li>
  )
}

/** A click-to-open disclosure with Escape, outside-click and focus-out to close. */
function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLLIElement>(null)
  const panelId = React.useId()
  const close = React.useCallback(() => setOpen(false), [])

  React.useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        ref.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const columns = item.columns?.length ? item.columns : null

  return (
    <li
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close()
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(linkStyle, 'gap-1', open && 'bg-line-3 text-ink-1')}
      >
        {item.label}
        <ChevronDown aria-hidden="true" className={cn('size-3.5 transition-transform duration-200 ease-out-expo', open && 'rotate-180')} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          'absolute left-0 top-full z-50 mt-2 rounded-frame border border-line-1 bg-canvas p-2 shadow-hover',
          columns ? 'w-[min(56rem,calc(100vw-2rem))]' : 'w-[320px]',
          open && 'animate-menu-in',
        )}
      >
        {columns ? (
          <div className="grid gap-6 p-2 md:grid-flow-col md:auto-cols-[minmax(220px,1fr)]">
            {columns.map((column) => (
              <div key={column.heading}>
                <p className="type-eyebrow px-3 pb-2 text-ink-4">{column.heading}</p>
                <ul className="grid gap-1">
                  {column.items.map((child) => (
                    <PanelLink key={child.href} href={child.href} title={child.label} onSelect={close}>
                      {child.description}
                    </PanelLink>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid gap-1">
            <li className="border-b border-line-1 px-3 pb-2 pt-1">
              <Link href={item.href} onClick={close} className="text-[13px] font-bold text-brand-strong hover:underline">
                All industries
              </Link>
            </li>
            {item.children?.map((child) => (
              <PanelLink key={child.href} href={child.href} title={child.label} onSelect={close}>
                {child.description}
              </PanelLink>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function DesktopItem({ item }: { item: NavItem }) {
  if (item.columns?.length || item.children?.length) return <DesktopDropdown item={item} />
  return (
    <li>
      <Link href={item.href} className={linkStyle}>
        {item.label}
      </Link>
    </li>
  )
}

/** The small-screen menu: a native modal dialog, so the platform supplies the focus trap, Escape and the inert page. */
function MobileMenu({ nav, open, onClose }: { nav: NavConfig; open: boolean; onClose: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      aria-label="Navigation"
      onClose={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-canvas p-0 text-ink-2 backdrop:bg-transparent lg:hidden"
    >
      {open ? (
        <div className="flex min-h-full flex-col animate-sheet-down">
          <div className="flex h-16 items-center justify-between border-b border-line-1 px-4 sm:px-6">
            <Link href="/" aria-label="jobsafe home" onClick={onClose}>
              <Wordmark height={36} />
            </Link>
            <Button variant="secondary" size="icon" aria-label="Close menu" onClick={onClose}>
              <X aria-hidden="true" />
            </Button>
          </div>

          <nav aria-label="Primary" className="flex-1 px-4 pt-2 sm:px-6">
            <ol className="divide-y divide-line-1">
              {nav.items.map((item, i) => (
                <li key={item.href} className="py-1">
                  <Link href={item.href} onClick={onClose} className="flex items-baseline gap-4 py-3">
                    <span className="w-6 shrink-0 type-mono text-xs font-medium text-brand-strong">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-2xl font-extrabold tracking-[-0.025em] text-ink-1">{item.label}</span>
                  </Link>
                  {item.children?.length ? (
                    <ul className="pb-3 pl-10">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={onClose} className="block py-2 text-base font-semibold text-ink-3 hover:text-ink-1">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.columns?.length
                    ? item.columns.map((column) => (
                        <ul key={column.heading} className="pb-3 pl-10">
                          <li className="type-eyebrow py-2 text-ink-4">{column.heading}</li>
                          {column.items.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href} onClick={onClose} className="block py-2 text-base font-semibold text-ink-3 hover:text-ink-1">
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))
                    : null}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-3 border-t border-line-1 px-4 pb-8 pt-5 sm:px-6" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
            {nav.actions.map((action) => {
              if (action.kind === 'demo') {
                return <BookDemoButton key={action.kind} placement="mobile-menu" size="lg" block onClick={onClose} />
              }
              return (
                <Button key={action.kind} variant={action.kind === 'signup' ? 'secondary' : 'ghost'} size="lg" block asChild>
                  <a href={action.href}>
                    {action.kind === 'phone' ? <Phone aria-hidden="true" /> : null}
                    {action.label}
                  </a>
                </Button>
              )
            })}
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

export function HeaderPhase1({ nav = NAV }: { nav?: NavConfig }) {
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
          <ul className="flex items-center gap-0.5">
            {nav.items.map((item) => (
              <DesktopItem key={item.href} item={item} />
            ))}
          </ul>
        </nav>

        {/* Actions in ascending weight left to right. "Book a demo" is the one
            control shown at every width; everything dropped at a given width is
            in the menu, the footer, or both. */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {nav.actions.map((action) => {
            if (action.kind === 'demo') {
              return <BookDemoButton key={action.kind} placement={action.placement ?? 'navbar'} size="sm" />
            }
            const variant = action.kind === 'signup' ? 'secondary' : 'ghost'
            return (
              <Button key={action.kind} variant={variant} size="sm" asChild className={SHOW_FROM[action.showFrom]}>
                <a href={action.href}>
                  {action.kind === 'phone' ? <Phone aria-hidden="true" /> : null}
                  {action.label}
                </a>
              </Button>
            )
          })}

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu aria-hidden="true" />
          </Button>
          <MobileMenu nav={nav} open={open} onClose={close} />
        </div>
      </div>
    </header>
  )
}

export default HeaderPhase1
