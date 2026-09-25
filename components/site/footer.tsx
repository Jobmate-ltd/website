import Link from 'next/link'
import { Download, ExternalLink, Mail, Phone } from 'lucide-react'
import { activeFooter, type FooterConfig, type FooterLink } from '@/lib/site'
import { Container } from '@/components/ui/container'
import { Wordmark } from '@/components/ui/wordmark'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { NewsletterSignup } from '@/components/site/newsletter-signup'
import { CookieSettingsLink } from '@/components/site/cookie-settings-link'

/**
 * Footer — light, on bg, driven by a FooterConfig.
 *
 * Newsletter band, brand column with contacts and social, link columns, then
 * the legal row with "Cookie settings" and the "Made by Jobmate Ltd,
 * Wolverhampton" line. The footer is the one section on every route, so it
 * carries the demo ask for the pages that have no CTA of their own.
 *
 * @example
 *   <Footer />
 */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const SOCIAL_ICONS = {
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  X: XIcon,
} as const

function contactIcon(link: FooterLink) {
  if (link.href.startsWith('tel:')) return Phone
  if (link.href.startsWith('mailto:')) return Mail
  if (link.download) return Download
  if (link.external) return ExternalLink
  return null
}

const linkClass = 'inline-flex min-h-8 items-center gap-2 text-sm text-ink-4 transition-colors hover:text-ink-1'

export function Footer({ config = activeFooter() }: { config?: FooterConfig & { readonly addressLine?: string } }) {
  const year = new Date().getFullYear()
  // The three-column form is the Phase 1 string exactly, so the flag-off HTML does not change.
  const columnsClass = config.columns.length > 3 ? 'md:grid-cols-2 md:gap-8 lg:grid-cols-[1.3fr_repeat(5,minmax(0,1fr))]' : 'md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8'

  return (
    <footer className="border-t border-line-1 bg-bg">
      <Container size="wide" className="py-14 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-8 border-b border-line-1 pb-12 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-2">
            <p className="type-eyebrow text-ink-4">{config.newsletter.eyebrow}</p>
            <p className="type-h3 text-ink-1">{config.newsletter.title}</p>
            <p className="type-small max-w-sm text-ink-5">{config.newsletter.blurb}</p>
          </div>
          <NewsletterSignup />
        </div>

        <div className={`grid grid-cols-1 gap-12 ${columnsClass}`}>
          <div className="flex flex-col items-start gap-5">
            <Link href="/" aria-label="jobsafe home">
              <Wordmark height={40} />
            </Link>
            <p className="type-small max-w-sm text-ink-4">{config.brand.blurb}</p>
            <BookDemoButton placement="footer" size="md" />
            <ul className="flex flex-col gap-1">
              {config.contacts.map((link) => {
                const Icon = contactIcon(link)
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={linkClass}
                      {...(link.download ? { download: true } : {})}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {Icon ? <Icon className="size-4 text-ink-5" aria-hidden="true" /> : null}
                      {link.label}
                      {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                    </a>
                  </li>
                )
              })}
            </ul>
            <ul className="flex items-center gap-2" aria-label="Social">
              {config.social.map((social) => {
                const Icon = SOCIAL_ICONS[social.label]
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${social.label} (opens in a new tab)`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 items-center justify-center rounded-control border border-line-1 bg-canvas text-ink-4 transition-colors hover:border-grey-400 hover:text-ink-1"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {config.columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-2">
              <p className="type-eyebrow mb-1 text-ink-4">{column.heading}</p>
              <ul className="flex flex-col gap-0.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    {link.action === 'cookie-settings' ? (
                      <CookieSettingsLink className={linkClass}>{link.label}</CookieSettingsLink>
                    ) : link.href.startsWith('http') ? (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      <div className="border-t border-line-1">
        <Container size="wide" className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="type-small text-ink-4">
              {config.copyright} {year}. All rights reserved. {config.brand.maker}
            </p>
            <p className="type-small text-ink-5">{config.addressLine ?? config.brand.madeIn}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {config.legal.map((link) => (
              <li key={link.label}>
                {link.action === 'cookie-settings' ? (
                  <CookieSettingsLink className={linkClass}>{link.label}</CookieSettingsLink>
                ) : (
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
