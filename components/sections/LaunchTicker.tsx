'use client'
import { useEffect, useState } from 'react'
import NumberFlow from '@number-flow/react'
import { Marquee } from '@/components/ui/marquee'

// Deterministic, time-based depletion so every visitor sees roughly the same
// number without any backend. Swap for a live sign-ups endpoint if one appears.
const LAUNCH_AT = Date.parse('2026-06-16T09:00:00Z') // launch moment
const START = 200
const FLOOR = 11 // keep some urgency; never hit zero
const WINDOW_DAYS = 30 // deplete 200 → FLOOR across ~30 days

function spotsRemaining(now: number) {
  const days = (now - LAUNCH_AT) / 86_400_000
  const taken = Math.floor((START - FLOOR) * Math.min(Math.max(days, 0) / WINDOW_DAYS, 1))
  return Math.max(START - taken, FLOOR)
}

export default function LaunchTicker() {
  // Start at START on both server and first client render to avoid a hydration
  // mismatch; the real value is computed on mount and refreshed every minute.
  const [spots, setSpots] = useState(START)

  useEffect(() => {
    const update = () => setSpots(spotsRemaining(Date.now()))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  const depleted = spots <= FLOOR

  // One copy of the scrolling line. Reused across the marquee; NumberFlow stays
  // mounted per position so the digit roll plays when the value ticks down.
  const line = depleted ? (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden="true">🚀</span>
      <span>
        <span className="font-bold">jobsafe</span> is live — <span className="font-bold">sign-ups now open</span>
      </span>
    </span>
  ) : (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden="true">🚀</span>
      <span>
        <span className="font-bold">jobsafe</span> is live — the first <span className="font-bold">{START}</span> sign-ups get{' '}
        <span className="font-bold">6 months free</span>
      </span>
      <span aria-hidden="true" className="opacity-60">·</span>
      <span className="inline-flex items-center gap-1 font-bold">
        <NumberFlow value={spots} /> spots remaining
      </span>
    </span>
  )

  return (
    <div className="sticky top-0 z-[60] w-full overflow-hidden bg-[#e5342a] text-white text-xs sm:text-[13px] font-medium tracking-wide shadow-[0_1px_0_rgba(0,0,0,0.15)]">
      <div className="relative h-9">
        {/* Scrolling marquee — decorative; hidden when the user prefers reduced motion */}
        <div aria-hidden="true" className="h-full motion-reduce:hidden">
          <Marquee pauseOnHover repeat={2} className="h-full items-center p-0 [--duration:34s] [--gap:3rem]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="flex items-center">
                {line}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Static line — announced by screen readers always; shown centred under reduced motion */}
        <div className="sr-only motion-reduce:not-sr-only motion-reduce:absolute motion-reduce:inset-0 motion-reduce:flex motion-reduce:items-center motion-reduce:justify-center motion-reduce:px-4 motion-reduce:text-center">
          {depleted ? (
            <span>
              <span aria-hidden="true">🚀 </span>
              <span className="font-bold">jobsafe</span> is live — sign-ups now open
            </span>
          ) : (
            <>
              <span className="sm:hidden">
                <span aria-hidden="true">🚀 </span>
                <span className="font-bold">jobsafe</span> is live · <span className="font-bold">{spots}</span> spots remaining
              </span>
              <span className="hidden sm:inline">
                <span aria-hidden="true">🚀 </span>
                <span className="font-bold">jobsafe</span> is live — the first <span className="font-bold">{START}</span> sign-ups get{' '}
                <span className="font-bold">6 months free</span> · <span className="font-bold">{spots}</span> spots remaining
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
