import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Eyebrow — the small uppercase line above a heading. Brand-strong on white,
 * ink-4 on grey (`tone="grey"`).
 *
 * @example
 *   <Eyebrow>Pricing</Eyebrow>
 */
export function Eyebrow({
  tone = 'brand',
  className,
  as: Tag = 'p',
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: 'brand' | 'grey'; as?: 'p' | 'span' | 'div' }) {
  return (
    <Tag
      className={cn('type-eyebrow', tone === 'grey' ? 'text-ink-4' : 'text-brand-strong', className)}
      {...props}
    />
  )
}

export default Eyebrow
