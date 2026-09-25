import * as React from 'react'
import { cn } from '@/lib/utils'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'

/**
 * CtaBand — heading, one line of copy, a primary and a secondary button,
 * on white or grey.
 *
 * The primary defaults to "Book a demo" through <BookDemoButton/> so the
 * placement is tracked; pass `primary` to override it. `secondary` is any
 * link. `note` is a small line under the buttons (the price and trial line).
 *
 * @example
 *   <CtaBand title="See it on your own sites" copy="…" placement="home-closing"
 *            secondary={{ label: 'Sign up now', href: SIGNUP_TRIAL_URL }} />
 */
export interface CtaLink {
  label: string
  href: string
  external?: boolean
}

export interface CtaBandProps {
  title: React.ReactNode
  copy?: React.ReactNode
  tone?: 'white' | 'grey'
  /** Analytics placement for the default demo button. */
  placement: string
  primary?: CtaLink
  secondary?: CtaLink
  note?: React.ReactNode
  align?: 'left' | 'center'
  id?: string
  className?: string
}

export function CtaBand({
  title,
  copy,
  tone = 'grey',
  placement,
  primary,
  secondary,
  note,
  align = 'left',
  id,
  className,
}: CtaBandProps) {
  return (
    <Section id={id} tone={tone} divider className={className}>
      <div
        className={cn(
          'flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12',
          align === 'center' && 'items-center text-center lg:flex-col lg:justify-center',
        )}
      >
        <div className={cn('flex max-w-2xl flex-col gap-3', align === 'center' && 'items-center')}>
          <h2 className="type-h2 text-ink-1">{title}</h2>
          {copy ? <p className="type-lead text-ink-4">{copy}</p> : null}
        </div>
        <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', align === 'center' && 'justify-center')}>
          {primary ? (
            <Button variant="primary" size="lg" asChild>
              <a href={primary.href} {...(primary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {primary.label}
              </a>
            </Button>
          ) : (
            <BookDemoButton placement={placement} size="lg" />
          )}
          {secondary ? (
            <Button variant="secondary" size="lg" asChild>
              <a href={secondary.href} {...(secondary.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {secondary.label}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      {note ? <p className={cn('type-small mt-6 text-ink-5', align === 'center' && 'text-center')}>{note}</p> : null}
    </Section>
  )
}

export default CtaBand
