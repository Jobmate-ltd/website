import * as React from 'react'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'

/**
 * FactStrip — a row of 4–5 short, verifiable product facts with icons.
 *
 * Replaces logo walls until real logos are cleared. Restyled from the pattern
 * of 21st.dev's Logo Cloud Marquee (7ovr/logo-cloud-3): `variant="marquee"`
 * scrolls the facts with an edge fade and pauses on hover; the default is a
 * static row that wraps on small screens. Never put a number here that is not
 * a product fact.
 *
 * @example
 *   <FactStrip facts={[{ icon: <WifiOff />, label: 'Works offline' }, …]} />
 */
export interface Fact {
  icon: React.ReactNode
  label: string
  /** Optional second line. */
  detail?: string
}

export interface FactStripProps {
  facts: readonly Fact[]
  variant?: 'row' | 'marquee'
  tone?: 'white' | 'grey'
  className?: string
  /** Accessible name for the list. */
  label?: string
}

function FactItem({ fact }: { fact: Fact }) {
  return (
    <li className="flex items-center gap-3">
      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line-1 bg-canvas text-brand [&>svg]:size-[18px]">
        {fact.icon}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-bold leading-tight text-ink-1">{fact.label}</span>
        {fact.detail ? <span className="text-[13px] leading-snug text-ink-5">{fact.detail}</span> : null}
      </span>
    </li>
  )
}

export function FactStrip({ facts, variant = 'row', tone = 'white', className, label = 'Product facts' }: FactStripProps) {
  if (variant === 'marquee') {
    return (
      <div className={cn('relative overflow-hidden border-y border-line-1', tone === 'grey' ? 'bg-bg' : 'bg-canvas', className)}>
        <Marquee pauseOnHover repeat={3} className="py-4 [--marquee-duration:36s]" aria-label={label}>
          <ul className="flex items-center gap-10 px-5">
            {facts.map((fact) => (
              <FactItem key={fact.label} fact={fact} />
            ))}
          </ul>
        </Marquee>
        <div aria-hidden="true" className={cn('pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent', tone === 'grey' ? 'from-bg' : 'from-canvas')} />
        <div aria-hidden="true" className={cn('pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent', tone === 'grey' ? 'from-bg' : 'from-canvas')} />
      </div>
    )
  }

  return (
    <ul
      aria-label={label}
      className={cn(
        'grid grid-cols-1 gap-x-8 gap-y-4 border-y border-line-1 py-5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-between',
        className,
      )}
    >
      {facts.map((fact) => (
        <FactItem key={fact.label} fact={fact} />
      ))}
    </ul>
  )
}

export default FactStrip
