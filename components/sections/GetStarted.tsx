'use client'
import { motion } from 'framer-motion'
import {
  PiChartLineUp as ChartLineUp,
  PiDeviceMobile as DeviceMobile,
  PiShieldCheck as ShieldCheck,
  PiUsersThree as UsersThree,
} from 'react-icons/pi'
import BookDemoButton from '@/components/ui/book-demo-button'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import { DEMO_DURATION_LABEL, PHONE_DISPLAY, PHONE_HREF } from '@/lib/brand'

/**
 * The closing conversion section.
 *
 * Was a centred "Get In Touch" block whose secondary CTA read "Book a Demo" and
 * pointed at `tel:` — a booking control that could not book anything. It now
 * leads on the calendar and says what the call is actually made of, because the
 * objection to a demo is never the demo, it is not knowing what half an hour
 * costs you.
 *
 * Layout is a 5/7 split rather than another centred stack: the homepage already
 * closes the academy and the industry pages that way, and the hero is the only
 * other split on this page.
 *
 * `id="get-started"` is retained. It is an existing in-page anchor.
 */

const agenda = [
  {
    icon: DeviceMobile,
    title: 'A report, filed live',
    body: 'An incident and a near miss captured on a phone, with no signal.',
    tinted: true,
  },
  {
    icon: ChartLineUp,
    title: 'The dashboard behind it',
    body: 'Reports by category, the site breakdown, and the twelve-week trend.',
    tinted: false,
  },
  {
    icon: ShieldCheck,
    title: 'The audit trail',
    body: 'The record an insurer, a client or the HSE would be handed.',
    tinted: false,
  },
  {
    icon: UsersThree,
    title: 'Rollout, realistically',
    body: 'Your sites, your supervisors, and how the first week is set up.',
    tinted: true,
  },
]

export default function GetStarted() {
  return (
    <section
      id="get-started"
      className="relative overflow-hidden bg-surface-0 py-20 md:py-28"
    >
      {/* Red glow — bottom-left. The site's closing-section motif. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--brand-rgb) / 0.18) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left — the ask */}
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="mb-6 text-4xl leading-tight font-black tracking-tight text-balance text-white md:text-5xl"
            >
              See it running on<br />your own sites
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mb-9 text-lg leading-relaxed text-white/50"
            >
              Book {DEMO_DURATION_LABEL} with someone who knows the product. We
              walk a real report end to end, then show you the dashboard and the
              audit trail sitting behind it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <BookDemoButton placement="home-closing" />
              <a
                href={SIGNUP_TRIAL_URL}
                className="inline-flex items-center justify-center rounded-md border border-white/25 px-8 py-4 text-sm font-bold whitespace-nowrap text-white transition duration-200 hover:-translate-y-px hover:border-white/50 hover:bg-white/[0.04] active:translate-y-0 active:scale-[0.97] motion-reduce:hover:translate-y-0"
              >
                Sign up now
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-6 text-sm leading-relaxed text-white/40"
            >
              No slide deck, no obligation. Pick a slot that suits your day, or
              call{' '}
              <a
                href={PHONE_HREF}
                className="font-semibold text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-brand"
              >
                {PHONE_DISPLAY}
              </a>{' '}
              if you would rather talk now.
            </motion.p>
          </div>

          {/* Right — what the half hour is actually made of. Hairlines come from
              the parent's background showing through a 1px grid gap, so no cell
              carries both a top and a bottom border. */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-white/10 bg-surface-1/60 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm">
              <p className="px-4 pt-3 pb-4 text-sm font-bold text-white">
                What the call covers
              </p>
              <div className="grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2">
                {agenda.map(({ icon: Icon, title, body, tinted }) => (
                  <div
                    key={title}
                    className={
                      tinted
                        ? 'bg-[rgb(var(--brand-rgb)/0.06)] p-5'
                        : 'bg-surface-1 p-5'
                    }
                  >
                    <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
                      <Icon className="size-[18px] text-brand" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <p className="mb-1.5 text-[15px] font-bold text-white">{title}</p>
                    <p className="text-sm leading-relaxed text-white/50">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
