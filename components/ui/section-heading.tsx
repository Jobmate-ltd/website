import * as React from 'react'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/ui/eyebrow'

/**
 * SectionHeading — eyebrow + H2 + lead, left-aligned by default.
 *
 * `align="center"` centres the block. `level` swaps the heading element when
 * the section heading is the page's H1.
 *
 * @example
 *   <SectionHeading eyebrow="How it works" title="Four steps from incident to insight" lead="…" />
 */
export interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  lead?: React.ReactNode
  align?: 'left' | 'center'
  level?: 'h1' | 'h2' | 'h3'
  /** Eyebrow tone on grey bands. */
  tone?: 'white' | 'grey'
  className?: string
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  level = 'h2',
  tone = 'white',
  className,
  id,
}: SectionHeadingProps) {
  const Heading = level
  return (
    <div className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {eyebrow ? <Eyebrow tone={tone === 'grey' ? 'grey' : 'brand'}>{eyebrow}</Eyebrow> : null}
      <Heading id={id} className={cn(level === 'h1' ? 'type-display' : level === 'h3' ? 'type-h3' : 'type-h2', 'text-ink-1')}>
        {title}
      </Heading>
      {lead ? <p className={cn('type-lead text-ink-4 measure', align === 'center' && 'mx-auto')}>{lead}</p> : null}
    </div>
  )
}

export default SectionHeading
