'use client'
import React from 'react'
import { PiList as MenuIcon, PiPhone as Phone, PiX as XIcon } from 'react-icons/pi'
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SIGNUP_TRIAL_URL, LOGIN_URL } from '@/lib/links'
import Image from 'next/image'

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
      'sticky top-12 z-50',
      'mx-auto w-full max-w-5xl rounded-lg border border-white/10',
      'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]',
      'bg-black/50 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-black/40',
    )}>
      <nav className="mx-auto flex items-center justify-between p-1.5 px-4">
        <Image src="/images/jobsafe_logo-removebg-preview.png" alt="jobsafe — Workplace Incident Reporting Software" width={160} height={52} className="h-10 w-auto" />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a key={link.href} className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Phone moves to xl: with eight nav links the row overflows a 1024px
              viewport; the number stays in the mobile menu and the footer. */}
          <a href="tel:03338000883" className="hidden xl:flex items-center gap-2 whitespace-nowrap text-sm text-white/90 hover:text-white transition-colors font-medium">
            <Phone className="size-4" strokeWidth={1.5} />
            0333 8000 883
          </a>
          <a href={LOGIN_URL} className="hidden lg:inline-flex items-center whitespace-nowrap bg-white hover:bg-white/90 text-brand font-bold text-sm px-4 py-2 rounded-md transition-all duration-200 hover:scale-105 animate-login-pulse motion-reduce:animate-none motion-reduce:hover:scale-100">
            Log in
          </a>
          <a href={SIGNUP_TRIAL_URL} className="whitespace-nowrap bg-brand hover:bg-brand-hover text-white font-bold text-sm px-4 py-2 rounded-md transition active:scale-[0.97]">
            Sign up now
          </a>
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
                    <a
                      href={SIGNUP_TRIAL_URL}
                      className="w-full rounded-md bg-brand px-8 py-4 text-center text-sm font-bold whitespace-nowrap text-white transition active:scale-[0.97] hover:bg-brand-hover"
                    >
                      Sign up now
                    </a>
                    <a
                      href={LOGIN_URL}
                      className="w-full rounded-md bg-white px-8 py-4 text-center text-sm font-bold whitespace-nowrap text-brand transition-all duration-200 hover:bg-white/90"
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
