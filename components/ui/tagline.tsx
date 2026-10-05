import { cn } from '@/lib/utils'
import { TAGLINE_WORDS } from '@/lib/brand'

/**
 * Tagline — "Record. Resolve. Prevent." set as display type, with the middle
 * word in the brand crimson (display size, so `brand` passes contrast).
 *
 * - `stacked` (default): one word per line at `type-tagline`, the largest
 *   type on the site. The Phase 1 homepage H1.
 * - `inline`: the three words on one line at `type-tagline-inline`, above the
 *   Phase 2 homepage H1.
 *
 * The words are separated by real spaces, so the accessible name reads as
 * the sentence, not "Record.Resolve.Prevent.".
 *
 * @example
 *   <Tagline as="h1" />
 *   <Tagline variant="inline" />
 */
export function Tagline({
  as: Tag = 'p',
  variant = 'stacked',
  className,
}: {
  as?: 'h1' | 'h2' | 'p'
  variant?: 'stacked' | 'inline'
  className?: string
}) {
  const stacked = variant === 'stacked'
  return (
    <Tag className={cn(stacked ? 'type-tagline' : 'type-tagline-inline', 'text-ink-1', className)}>
      {TAGLINE_WORDS.map((word, i) => (
        <span key={word}>
          <span className={cn(stacked && 'block', i === 1 && 'text-brand')}>{word}</span>
          {i < TAGLINE_WORDS.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

export default Tagline
