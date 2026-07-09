'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'
import { HowItWorksVideo } from '@/components/hero/how-it-works-video'
import { SIGNUP_TRIAL_URL } from '@/lib/links'

const heroStats = [
  { stat: '3×', label: 'Faster Reporting' },
  { stat: '<60s', label: 'Per Report' },
  { stat: 'Zero', label: 'Paperwork' },
  { stat: '✓', label: 'Works Offline' },
]

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-black"
    >
      {/* Red glow — top right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle at top right, rgb(var(--brand-rgb) / 0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 md:pb-14 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left — text content */}
          <div className="flex flex-col w-full lg:w-[52%]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-2 text-xs text-white/70 mb-10 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Available from £2.75 per licence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-black uppercase leading-none tracking-tight text-white mb-8"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 7rem)' }}
            >
              Record.<br />
              <em className="not-italic text-brand">Resolve.</em><br />
              Prevent.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg"
            >
              The mobile incident reporting app built for real-world risk — jobsafe brings HSSE reporting to construction, field service, and transport environments where paper-based solutions aren&apos;t good enough.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-start gap-4 mb-16"
            >
              <a
                href={SIGNUP_TRIAL_URL}
                className="bg-brand hover:bg-brand-hover text-white font-bold text-sm px-8 py-4 rounded-md transition active:scale-[0.97]"
              >
                Sign up now
              </a>
              <HowItWorksVideo>
                <button
                  type="button"
                  className="relative overflow-hidden border border-white/20 hover:border-white/40 text-white font-bold text-sm px-8 py-4 rounded-md transition active:scale-[0.97]"
                >
                  <span className="relative z-10">SEE HOW IT WORKS</span>
                  <BorderBeam colorFrom="var(--color-brand)" colorTo="var(--color-brand-deep)" duration={4} size={60} borderWidth={2} />
                </button>
              </HowItWorksVideo>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-start gap-x-10 gap-y-6"
            >
              {heroStats.map(({ stat, label }) => (
                <div key={label} className="text-left">
                  <div className="text-2xl font-black text-white">{stat}</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product shot: duo iPhone 17 Pro mockup (JobSafe report menu +
              analytics dashboard) on a transparent bg, sitting on the black hero.
              Outer motion = entrance on load; inner motion = continuous float. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[48%] flex justify-center"
          >
            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full flex justify-center will-change-transform"
            >
              <img
                src="/images/jobsafe-hero-duo.png"
                alt="Two smartphones showing the JobSafe app — the HSSE and incident report menu, and the analytics dashboard with reports by category, site breakdown and 12-week trend"
                width={793}
                height={773}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-w-full max-h-[65vh] lg:max-h-[720px] object-contain mx-auto"
                /* Device-level glow: drop-shadow reads the PNG's alpha channel,
                   so the red halo traces the phone silhouettes (not a box). */
                style={{
                  filter:
                    'drop-shadow(0 0 18px rgb(var(--brand-rgb) / 0.55)) drop-shadow(0 0 48px rgb(var(--brand-rgb) / 0.32)) drop-shadow(0 14px 30px rgb(0 0 0 / 0.55))',
                }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
