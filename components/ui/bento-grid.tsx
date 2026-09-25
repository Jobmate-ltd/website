import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * BentoGrid / BentoCard — Magic UI `bento-grid` (https://magicui.design/docs/components/bento-grid,
 * MIT) restyled: 4px radius, line-1 hairline, shadow at rest and on hover,
 * ink text, a brand icon; no hover-only affordance (the link is always
 * visible), so it reads the same with a keyboard or a finger.
 *
 * @example
 *   <BentoGrid><BentoCard name="RIDDOR 2013" icon={<Gavel />} description="…" href="/platform/riddor" cta="RIDDOR reporting" className="md:col-span-2" /></BentoGrid>
 */
export function BentoGrid({ children, className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('grid w-full auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', className)} {...props}>
      {children}
    </div>
  )
}

export interface BentoCardProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  name: string
  /** A one-line eyebrow above the name, e.g. the regulation's short form. */
  eyebrow?: string
  icon?: React.ReactNode
  description: React.ReactNode
  href?: string
  cta?: string
  /** Optional decorative layer behind the text. */
  background?: React.ReactNode
}

export function BentoCard({ name, eyebrow, icon, description, href, cta, background, className, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-control border border-line-1 bg-canvas p-5 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover',
        className,
      )}
      {...props}
    >
      {background ? <div className="pointer-events-none absolute inset-0">{background}</div> : null}
      <div className="relative flex flex-col gap-3">
        {icon ? <span className="flex size-9 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-[18px]">{icon}</span> : null}
        <div>
          {eyebrow ? <p className="type-eyebrow text-brand-strong">{eyebrow}</p> : null}
          <h3 className="mt-1 text-lg font-bold leading-tight text-ink-1">{name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-ink-4">{description}</p>
      </div>
      {href && cta ? (
        <Link
          href={href}
          className="relative mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-strong after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:underline"
        >
          {cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}
