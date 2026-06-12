'use client'
import { motion } from 'framer-motion'
import { SIGNUP_TRIAL_URL } from '@/lib/links'

export default function GetStarted() {
  return (
    <section id="get-started" className="relative py-16 md:py-16 bg-[#0a0a0a] overflow-hidden">
      {/* Red glow — bottom-left */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[600px] h-[600px]"
        style={{
          background: 'radial-gradient(circle, rgba(229,52,42,0.18) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-widest text-white/50 uppercase mb-6"
        >
          Get In Touch
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl md:text-5xl font-black text-white leading-tight mb-6"
        >
          Ready to modernise your<br />incident reporting?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-white/50 text-lg leading-relaxed mb-10"
        >
          Empower your workforce. Strengthen your safety culture. Reduce risk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={SIGNUP_TRIAL_URL}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#e5342a] hover:bg-[#c42d24] text-white font-semibold text-sm tracking-wide transition-colors"
          >
            Sign up now
          </a>
          <a
            href="tel:03338000883"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-sm tracking-wide transition-colors"
          >
            Book a Demo
          </a>
        </motion.div>
      </div>
    </section>
  )
}
