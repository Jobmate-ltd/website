import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Chip / StatusPill — a small rounded label.
 *
 * `status` uses the status table (good, warning, info, neutral, critical) and
 * is for product-style UI and pills only, never decoration. `brand` is the
 * crimson tint for a highlighted chip such as "Most popular".
 *
 * @example
 *   <StatusPill status="good">Pending sync</StatusPill>
 *   <Chip>Works offline</Chip>
 */
export const chipVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-2.5 py-1 text-[12px] font-bold leading-none',
  {
    variants: {
      status: {
        neutral: 'bg-neutral-tint text-neutral-text border-line-1',
        good: 'bg-good-tint text-good-text border-good-tint',
        warning: 'bg-warning-tint text-warning-text border-warning-tint',
        info: 'bg-info-tint text-info-text border-info-tint',
        critical: 'bg-critical-tint text-critical-text border-critical-tint',
        brand: 'bg-brand-tint-08 text-brand-strong border-brand-tint-18',
        outline: 'bg-canvas text-ink-3 border-line-1',
      },
    },
    defaultVariants: { status: 'outline' },
  },
)

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chipVariants> {
  /** Draws the status dot before the label. */
  dot?: boolean
}

export function Chip({ status, dot = false, className, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ status }), className)} {...props}>
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-pill bg-current" /> : null}
      {children}
    </span>
  )
}

/** A Chip that always shows its status dot. */
export function StatusPill(props: ChipProps) {
  return <Chip dot {...props} />
}

export default Chip
