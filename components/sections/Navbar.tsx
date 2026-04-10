'use client'
import React from 'react'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const links = [
    { label: 'The Problem', href: '#the-problem' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Industries', href: '#industries' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <header className={cn(
      'sticky top-5 z-50',
      'mx-auto w-full max-w-5xl rounded-lg border border-white/10 shadow',
      'bg-black/40 backdrop-blur-lg supports-[backdrop-filter]:bg-black/40',
    )}>
      <nav className="mx-auto flex items-center justify-between p-1.5 px-4">
        <Image src="/images/jobsafe_logo-removebg-preview.png" alt="JobSafe" width={120} height={40} />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a key={link.href} className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white">Log In</Button>
          <Button size="sm" className="bg-[#e5342a] hover:bg-[#c42d24] text-white">Sign Up</Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="lg:hidden border-white/10">
              <MenuIcon className="size-4" />
            </Button>
            <SheetContent className="bg-black/90 backdrop-blur-lg border-white/10" side="left">
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {links.map((link) => (
                  <a key={link.href} className={buttonVariants({ variant: 'ghost', className: 'justify-start text-white' })} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
              <SheetFooter>
                <Button variant="outline" className="border-white/10 text-white">Log In</Button>
                <Button className="bg-[#e5342a] hover:bg-[#c42d24] text-white">Sign Up</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
