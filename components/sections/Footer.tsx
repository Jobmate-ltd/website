import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'

type SvgProps = { size?: number; strokeWidth?: number; className?: string }

const FacebookIcon = ({ size = 24, strokeWidth = 1.5, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const XIcon = ({ size = 24, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedInIcon = ({ size = 24, strokeWidth = 1.5, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Industries', href: '#industries' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const socialLinks = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: XIcon, href: '#', label: 'X' },
  { icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand column */}
          <div className="md:col-span-2 flex flex-col gap-6 items-start">
            <Image
              src="/images/jobsafe_logo-removebg-preview.png"
              alt="jobsafe — Workplace Incident Reporting Software"
              width={160}
              height={52}
              className="h-12 w-auto"
            />
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Record. Resolve. Prevent. — Workplace incident reporting built for the field.
            </p>
            <a
              href="tel:03338000883"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors w-max"
            >
              <Phone className="size-4" strokeWidth={1.5} />
              0333 8000 883
            </a>
            <a
              href="mailto:sales@jobsafe.cloud"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors w-max"
            >
              <Mail className="size-4" strokeWidth={1.5} />
              sales@jobsafe.cloud
            </a>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav column */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest text-white/60 uppercase mb-1">
              Navigation
            </span>
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-white/50 hover:text-white transition-colors w-max"
              >
                {label}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/60 text-xs">
            © jobsafe {year}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="/privacy-policy" className="inline-flex items-center min-h-11 px-2 text-white/60 hover:text-white text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="inline-flex items-center min-h-11 px-2 text-white/60 hover:text-white text-xs transition-colors">
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
