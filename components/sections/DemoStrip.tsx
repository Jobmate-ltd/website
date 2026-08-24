'use client'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import BookDemoButton from '@/components/ui/book-demo-button'
import { DEMO_DURATION_LABEL } from '@/lib/brand'

/**
 * DemoStrip — the mid-page interception.
 *
 * Sits between the results grid and pricing, which is where a reader who is
 * convinced but not ready to self-serve otherwise falls off the page. One line,
 * one control, no second choice.
 *
 * The surface is `brand-deep` (#7f1010) rather than `brand` (#e5342a) for a
 * reason worth keeping: white on #e5342a measures 4.33:1, which fails WCAG AA
 * for anything under 18.66px bold. #7f1010 measures 10.6:1, so the small print
 * on this band is legible rather than merely visible. The bright brand red is
 * still present, as the glow.
 *
 * Deliberately NOT a card, NOT a split, NOT a centred stack: those layout
 * families are all spoken for elsewhere on the homepage.
 *
 * Copy is overridable so the same band can close an insights article without
 * repeating the homepage's line verbatim. The control never changes.
 */
export default function DemoStrip({
  heading = 'Rather see it than read about it?',
  body,
  placement = 'home-mid-strip',
}: {
  heading?: string
  body?: ReactNode
  placement?: string
} = {}) {
  return (
    <section className="relative overflow-hidden bg-brand-deep">
      {/* Hairlines tie the band to the dark sections either side of it. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-black/40" />

      {/* Bright-brand glow, kept to the right where the white button sits, so it
          never rides under the body copy and drags its contrast down. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 h-[420px] w-[520px] -translate-y-1/2 translate-x-1/4"
        style={{
          background: 'radial-gradient(circle, rgb(var(--brand-rgb) / 0.45) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex max-w-6xl flex-col gap-7 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-10 md:py-14"
      >
        <div className="max-w-xl">
          <p className="text-2xl leading-tight font-black tracking-tight text-balance text-white md:text-3xl">
            {heading}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">
            {body ?? (
              <>
                A live walkthrough on your own sites. {DEMO_DURATION_LABEL}, at
                a time that suits.
              </>
            )}
          </p>
        </div>

        <BookDemoButton
          placement={placement}
          variant="inverse"
          className="shrink-0 self-start md:self-auto"
        />
      </motion.div>
    </section>
  )
}
