'use client'
import React from 'react'
import { PiCaretDown as CaretDown, PiList as MenuIcon, PiPhone as Phone, PiX as XIcon } from 'react-icons/pi'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SIGNUP_TRIAL_URL, LOGIN_URL } from '@/lib/links'
import BookDemoButton from '@/components/ui/book-demo-button'
import Image from 'next/image'
import Link from 'next/link'

/** Industry landing pages. Add new ones here; the desktop dropdown and the
    mobile menu both render from this list. */
const industryLinks = [
  { label: 'Window & Door Fitters', href: '/industries/window-door-fitters' },
]

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const links = [
    { label: 'Home', href: '/#hero' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Insights', href: '/insights' },
    { label: 'Academy', href: '/academy' },
    { label: 'About', href: '/about' },
  ]
  return (
    <header className={cn(
      'sticky top-3 z-50',
      // The bar is a centred pill, so its width — not the viewport's — is the
      // budget, and it was already full before "Book a demo" existed. It grows
      // on wider screens rather than the nav wrapping onto a second line.
      'mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl rounded-lg border border-white/10',
      'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]',
      'bg-black/50 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-black/40',
    )}>
      <nav className="mx-auto flex items-center justify-between p-1.5 px-4">
        <Image src="/images/jobsafe_logo-removebg-preview.png" alt="jobsafe — Workplace Incident Reporting Software" width={160} height={52} className="h-10 w-auto" />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) =>
            link.label === 'Industries' ? (
              /* Hover/focus dropdown listing the industry landing pages. The
                 top-level link still jumps to the homepage industries section;
                 the panel stays open across the pt-2 hover bridge. */
              <div key={link.href} className="group relative">
                <a
                  href={link.href}
                  aria-haspopup="true"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1 px-2 xl:px-3')}
                >
                  {link.label}
                  <CaretDown
                    className="size-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                    strokeWidth={2}
                  />
                </a>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  <div className="min-w-60 rounded-lg border border-white/10 bg-black/80 p-1.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                    {industryLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block rounded-md px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a key={link.href} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'px-2 xl:px-3')} href={link.href}>
                {link.label}
              </a>
            ),
          )}
        </div>
        {/* Action cluster, in ascending weight left to right: log in (text),
            sign up (white fill), book a demo (brand fill). "Book a demo" holds
            the red slot because it is the action with the highest intent and
            the one this navbar previously had no room for at all.

            Breakpoints are set by what fits on one line, which the nav must do:
            the phone number needs 2xl, "Sign up now" needs xl, and "Log in"
            appears with the link row at lg. "Book a demo" is the one control
            shown at every width, including the smallest phones, where the bar
            is logo + demo + menu. Everything dropped at a given width is in the
            menu sheet, the footer, or both. */}
        <div className="flex items-center gap-2">
          <a href="tel:03338000883" className="hidden 2xl:flex items-center gap-2 whitespace-nowrap text-sm text-white/90 hover:text-white transition-colors font-medium">
            <Phone className="size-4" strokeWidth={1.5} />
            0333 8000 883
          </a>
          <a href={LOGIN_URL} className="hidden lg:inline-flex items-center whitespace-nowrap px-2 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
            Log in
          </a>
          <a href={SIGNUP_TRIAL_URL} className="hidden xl:inline-flex items-center whitespace-nowrap bg-white hover:bg-white/90 text-brand-deep font-bold text-sm px-4 py-2 rounded-md transition active:scale-[0.97]">
            Sign up now
          </a>
          <BookDemoButton
            placement="navbar"
            size="sm"
            className="animate-cta-pulse motion-reduce:animate-none"
          />
          <Sheet open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="lg:hidden border-white/10" aria-label="Open menu">
              <MenuIcon className="size-4" />
            </Button>

            {/* Full-screen editorial menu. Drops from the top as a curtain
                rather than sliding in from the side; Radix keeps the focus
                trap, Escape handling and scroll lock. */}
            <SheetContent
              side="top"
              hideClose
              aria-describedby={undefined}
              className="inset-0 z-[70] h-dvh w-full max-w-none border-none bg-surface-0 p-0 lg:hidden"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>

              {/* Brand glow — top right, matching the page headers */}
              <div
                className="pointer-events-none absolute top-0 right-0 h-[420px] w-[420px]"
                style={{
                  background:
                    'radial-gradient(circle at top right, rgb(var(--brand-rgb) / 0.16) 0%, transparent 70%)',
                }}
              />

              <div className="relative flex h-full flex-col">
                {/* Top row: logo + close, mirroring the collapsed bar */}
                <div className="flex items-center justify-between px-5 pt-5 pb-2">
                  <Image
                    src="/images/jobsafe_logo-removebg-preview.png"
                    alt="jobsafe"
                    width={160}
                    height={52}
                    className="h-10 w-auto"
                  />
                  <SheetClose
                    aria-label="Close menu"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <XIcon className="size-5" />
                  </SheetClose>
                </div>

                {/* Editorial link stack: numbered, hairline-divided, staggered in */}
                <nav aria-label="Site" className="flex-1 overflow-y-auto px-5 pt-4">
                  <ul className="divide-y divide-white/10">
                    {links.map((link, i) => (
                      <li
                        key={link.href}
                        className="animate-menu-item motion-reduce:animate-none"
                        style={{ animationDelay: `${60 + i * 45}ms` }}
                      >
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-4 py-4 active:bg-white/[0.03]"
                        >
                          <span className="w-6 shrink-0 text-xs font-bold tabular-nums text-brand">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-2xl font-black uppercase tracking-tight text-white transition-colors group-active:text-white/80">
                            {link.label}
                          </span>
                        </a>
                        {link.label === 'Industries' && (
                          <ul className="pb-3 pl-10">
                            {industryLinks.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  onClick={() => setOpen(false)}
                                  className="block py-1.5 text-base font-bold uppercase tracking-tight text-white/60 transition-colors hover:text-white active:text-white/80"
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Pinned actions */}
                <div
                  className="animate-menu-item motion-reduce:animate-none border-t border-white/10 px-5 pb-8 pt-5"
                  style={{ animationDelay: `${60 + links.length * 45}ms` }}
                >
                  <div className="flex flex-col gap-3">
                    <BookDemoButton placement="mobile-menu" block onClick={() => setOpen(false)} />
                    <a
                      href={SIGNUP_TRIAL_URL}
                      className="w-full rounded-md bg-white px-8 py-4 text-center text-sm font-bold whitespace-nowrap text-brand-deep transition-all duration-200 hover:bg-white/90"
                    >
                      Sign up now
                    </a>
                    <a
                      href={LOGIN_URL}
                      className="w-full rounded-md border border-white/25 px-8 py-4 text-center text-sm font-bold whitespace-nowrap text-white transition hover:border-white/50 hover:bg-white/[0.04] active:scale-[0.97]"
                    >
                      Log in
                    </a>
                    <a
                      href="tel:03338000883"
                      className="flex min-h-11 items-center justify-center gap-2 pt-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                      <Phone className="size-4" strokeWidth={1.5} />
                      0333 8000 883
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
