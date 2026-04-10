'use client'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Red glow — top right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle at top right, rgba(229,52,42,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-2 text-xs text-white/70 mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5342a] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e5342a]" />
          </span>
          Available at £2.99 per license
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black uppercase leading-none tracking-tight text-white mb-8"
          style={{ fontSize: 'clamp(4rem, 9vw, 8.5rem)' }}
        >
          Record.<br />
          <em className="not-italic text-[#e5342a]">Resolve.</em><br />
          Prevent.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed mb-10"
        >
          JobSafe helps teams capture incidents in seconds, improve compliance, and build a stronger safety culture — from the field to the boardroom.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a
            href="#get-started"
            className="bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-8 py-4 rounded-md transition-colors"
          >
            START FREE TRIAL →
          </a>
          <a
            href="#how-it-works"
            className="border border-white/20 hover:border-white/40 text-white font-bold text-sm px-8 py-4 rounded-md transition-colors"
          >
            SEE HOW IT WORKS
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
        >
          {[
            { stat: '3×', label: 'Faster Reporting' },
            { stat: '98%', label: 'Compliance Rate' },
            { stat: '60%', label: 'Fewer Repeat Incidents' },
            { stat: 'Zero', label: 'Paperwork' },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{stat}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
