import { Marquee } from '@/components/ui/marquee'
import { LAUNCH_OFFER } from '@/lib/brand'

/**
 * LaunchTicker — the sticky announcement bar.
 *
 * This component used to render a countdown: "the first 200 sign-ups get 6
 * months free · N spots remaining", where N was produced by a deterministic
 * timer that fell from 200 towards a floor of 11 over thirty days and, by
 * design, never reached zero. No sign-up ever moved it. It was a fabricated
 * statistic dressed as inventory, on the homepage of a compliance product.
 *
 * The counter is gone. It is not coming back. If jobsafe ever wants to show
 * remaining places, that number must come from a real sign-ups endpoint, and it
 * must be allowed to hit zero.
 *
 * The remaining copy is a single line, read from `LAUNCH_OFFER` in
 * `lib/brand.ts`. There is exactly one offer on the site at a time: either the
 * launch promotion here, or the free trial in the pricing section. Never both.
 *
 * No `'use client'`: there is no state left, so this is a server component and
 * ships zero JavaScript.
 */
export default function LaunchTicker() {
  const message = LAUNCH_OFFER.enabled
    ? LAUNCH_OFFER.promotionalHeadline
    : LAUNCH_OFFER.headline

  // "jobsafe is live — …" — the brand is lowercase even at sentence start, and
  // bolded rather than capitalised so it still reads as the subject.
  const [brand, ...rest] = message.split(' ')
  const tail = rest.join(' ')

  const line = (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden="true">🚀</span>
      <span>
        <span className="font-bold">{brand}</span> {tail}
      </span>
    </span>
  )

  return (
    <div className="sticky top-0 z-[60] w-full overflow-hidden bg-brand text-white text-xs sm:text-[13px] font-medium tracking-wide shadow-[0_1px_0_rgba(0,0,0,0.15)]">
      <div className="relative h-9">
        {/* Scrolling marquee — decorative; hidden when the user prefers reduced motion */}
        <div aria-hidden="true" className="h-full motion-reduce:hidden">
          <Marquee
            pauseOnHover
            repeat={2}
            className="h-full items-center p-0 [--duration:34s] [--gap:3rem]"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="flex items-center">
                {line}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Static line — announced by screen readers always; shown centred under reduced motion */}
        <div className="sr-only motion-reduce:not-sr-only motion-reduce:absolute motion-reduce:inset-0 motion-reduce:flex motion-reduce:items-center motion-reduce:justify-center motion-reduce:px-4 motion-reduce:text-center">
          <span>
            <span aria-hidden="true">🚀 </span>
            <span className="font-bold">{brand}</span> {tail}
          </span>
        </div>
      </div>
    </div>
  )
}
