import { cn } from '@/lib/utils'

/**
 * HeroBackdrop — the light behind a hero: one soft crimson radial at 8%, on
 * the side the media sits (or centred over a text-only hero). There is no
 * grid texture; the 60px grid and the beam that traced it were retired.
 *
 * Give the parent `relative overflow-hidden` and put content in a
 * `relative` child. Decorative: hidden from assistive tech.
 *
 * @example
 *   <section className="relative overflow-hidden"><HeroBackdrop /><Container className="relative">…</Container></section>
 */
export function HeroBackdrop({
  radial = 'right',
  className,
}: {
  radial?: 'right' | 'left' | 'center'
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <div
        className={cn(
          'hero-radial absolute -top-40 size-[720px]',
          radial === 'right' && '-right-40',
          radial === 'left' && '-left-40',
          radial === 'center' && 'left-1/2 -translate-x-1/2',
        )}
      />
    </div>
  )
}

export default HeroBackdrop
