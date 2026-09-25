import { cn } from '@/lib/utils'

/**
 * HeroBackdrop — the signature texture behind a hero: the 60px grid as ink at
 * 4.5%, fading out downwards, one soft crimson radial, and a single crimson
 * beam that traces a few grid lines once on load (restyled from 21st.dev's
 * Background Grid Beam; static under reduced motion).
 *
 * Give the parent `relative overflow-hidden` and put content in a
 * `relative` child. Decorative: hidden from assistive tech.
 *
 * @example
 *   <section className="relative overflow-hidden"><HeroBackdrop /><Container className="relative">…</Container></section>
 */
export function HeroBackdrop({
  radial = 'right',
  beam = true,
  className,
}: {
  radial?: 'right' | 'left' | 'center' | 'none'
  beam?: boolean
  className?: string
}) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <div className="hero-grid absolute inset-0" />
      {radial !== 'none' ? (
        <div
          className={cn(
            'hero-radial absolute -top-40 size-[720px]',
            radial === 'right' && '-right-40',
            radial === 'left' && '-left-40',
            radial === 'center' && 'left-1/2 -translate-x-1/2',
          )}
        />
      ) : null}
      {beam ? (
        <svg
          className="absolute left-[calc(50%-600px)] top-0 hidden lg:block"
          width="420"
          height="180"
          viewBox="0 0 420 180"
          fill="none"
        >
          <path
            d="M0 60.5h180M180 60.5v60M180 120.5h120M300 120.5v60"
            stroke="url(#hero-beam)"
            strokeWidth="1.5"
            pathLength="1"
            strokeDasharray="1"
            className="animate-beam"
          />
          <defs>
            <linearGradient id="hero-beam" x1="0" y1="0" x2="420" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-brand)" stopOpacity="0" />
              <stop offset="0.4" stopColor="var(--color-brand)" />
              <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      ) : null}
    </div>
  )
}

export default HeroBackdrop
