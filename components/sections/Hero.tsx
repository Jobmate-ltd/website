'use client'
import { motion } from 'framer-motion'
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
          background: 'radial-gradient(circle at top right, rgba(229,52,42,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-16 md:pb-14 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left — text content */}
          <div className="flex flex-col w-full lg:w-[60%]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-2 text-xs text-white/70 mb-10 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5342a] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e5342a]" />
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
              <em className="not-italic text-[#e5342a]">Resolve.</em><br />
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
                className="bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-8 py-4 rounded-md transition-colors"
              >
                Sign up now
              </a>
              <HowItWorksVideo>
                <button
                  type="button"
                  className="relative overflow-hidden border border-white/20 hover:border-white/40 text-white font-bold text-sm px-8 py-4 rounded-md transition-colors"
                >
                  <span className="relative z-10">SEE HOW IT WORKS</span>
                  <BorderBeam colorFrom="#e5342a" colorTo="#7f1010" duration={4} size={60} borderWidth={2} />
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

          {/* Right — product shot (hand holding a phone on a solid black bg,
              which blends into the near-black hero) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full lg:w-[40%] flex justify-center lg:pl-8"
          >
            <picture>
              <source srcSet="/images/jobsafe-hero.webp" type="image/webp" />
              <img
                src="/images/jobsafe-hero.jpg"
                alt="The JobSafe app open on a smartphone showing the HSSE reporting dashboard"
                width={1175}
                height={1316}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-w-full max-h-[60vh] lg:max-h-[600px] object-contain mx-auto"
              />
            </picture>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
