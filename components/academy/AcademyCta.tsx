'use client'
import { motion } from 'framer-motion'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import { TRIAL } from '@/lib/brand'

export default function AcademyCta() {
  return (
    <section className="relative py-20 bg-surface-0 overflow-hidden border-t border-white/10">
      {/* Red glow — bottom-left, matching the site's closing sections */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[600px] h-[600px]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--brand-rgb) / 0.16) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-balance text-white leading-tight mb-5"
        >
          Now try it yourself
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-white/50 text-lg leading-relaxed mb-10"
        >
          Everything in these lessons is in the app from day one. {TRIAL.label}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={SIGNUP_TRIAL_URL}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand hover:bg-brand-hover text-white font-semibold text-sm tracking-wide transition active:scale-[0.97]"
          >
            Sign up now
          </a>
          <a
            href="tel:03338000883"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-sm tracking-wide transition active:scale-[0.97]"
          >
            Book a Demo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
