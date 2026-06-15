'use client'
import React from 'react'
import { MenuIcon, Phone } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet'
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
  ]
  return (
    <header className={cn(
      'sticky top-5 z-50',
      'mx-auto w-full max-w-5xl rounded-lg border border-white/10 shadow',
      'bg-black/40 backdrop-blur-lg supports-[backdrop-filter]:bg-black/40',
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
          <a href="tel:03338000883" className="hidden lg:flex items-center gap-2 whitespace-nowrap text-sm text-white/90 hover:text-white transition-colors font-medium">
            <Phone className="size-4" strokeWidth={1.5} />
            0333 8000 883
          </a>
          <a href={LOGIN_URL} className="hidden lg:inline-flex items-center whitespace-nowrap bg-white hover:bg-white/90 text-[#e5342a] font-bold text-sm px-4 py-2 rounded-md transition-all duration-200 hover:scale-105 animate-login-pulse motion-reduce:animate-none motion-reduce:hover:scale-100">
            Log in
          </a>
          <a href={SIGNUP_TRIAL_URL} className="whitespace-nowrap bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-4 py-2 rounded-md transition-colors">
            Sign up now
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="lg:hidden border-white/10">
              <MenuIcon className="size-4" />
            </Button>
            <SheetContent className="bg-black/90 backdrop-blur-lg border-white/10" side="left">
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {links.map((link) => (
                  <a key={link.href} className={buttonVariants({ variant: 'ghost', className: 'justify-start text-white min-h-11' })} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
              <SheetFooter>
                <a href={LOGIN_URL} className="w-full text-center bg-white hover:bg-white/90 text-[#e5342a] font-bold text-sm px-6 py-3 rounded-md transition-all duration-200 animate-login-pulse motion-reduce:animate-none">
                  Log in
                </a>
                <a href={SIGNUP_TRIAL_URL} className="w-full text-center bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-6 py-3 rounded-md transition-colors">
                  Sign up now
                </a>
                <a href="tel:03338000883" className="flex items-center justify-center gap-2 w-full text-sm text-white/90 hover:text-white transition-colors font-medium py-2">
                  <Phone className="size-4" strokeWidth={1.5} />
                  0333 8000 883
                </a>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
