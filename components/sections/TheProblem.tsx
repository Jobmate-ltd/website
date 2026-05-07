'use client'
import { motion } from 'framer-motion'

const problems = [
  {
    number: '01',
    text: 'Delayed reporting creates compliance gaps before anyone notices',
  },
  {
    number: '02',
    text: 'Incomplete information undermines root cause investigations',
  },
  {
    number: '03',
    text: 'No real-time visibility means managers react instead of prevent',
  },
  {
    number: '04',
    text: "Spreadsheets can't scale across teams, sites, or regulations",
  },
  {
    number: '05',
    text: 'Preventable incidents keep recurring with no pattern analysis',
  },
]

export default function TheProblem() {
  return (
    <section
      id="the-problem"
      className="relative overflow-hidden bg-[#0a0a0a] py-12 md:py-20"
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

      {/* Red glow — bottom left */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle at bottom left, rgba(229,52,42,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — label + heading */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-5">
              The Problem
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Safety is too important for broken systems
            </h2>
          </motion.div>

          {/* Right — numbered list */}
          <div className="flex flex-col divide-y divide-white/10">
            {problems.map(({ number, text }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex items-start gap-5 py-6 first:pt-0 last:pb-0"
              >
                {/* Red left accent + number */}
                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                  <div className="w-0.5 h-10 bg-[#e5342a] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-bold text-[#e5342a] tabular-nums">{number}</span>
                </div>
                <p className="text-white/70 group-hover:text-white text-base leading-relaxed transition-colors">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
