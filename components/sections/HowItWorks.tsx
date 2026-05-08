'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Capture',
    description:
      'Workers log incidents instantly with guided prompts, media uploads, and automatic location tagging — even offline.',
  },
  {
    number: '02',
    title: 'Review',
    description:
      'Supervisors receive instant alerts, verify the details, and assign corrective actions to the right people.',
  },
  {
    number: '03',
    title: 'Resolve',
    description:
      'Track every corrective action through to completion with automated reminders and escalation paths.',
  },
  {
    number: '04',
    title: 'Analyse',
    description:
      'Dashboard analytics surface patterns, high-risk areas, and trends — so you can act before the next incident.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#0a0a0a] py-12 md:py-14"
    >
      {/* Red glow — top right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle at top right, rgba(229,52,42,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — label, heading, description, steps */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-5"
            >
              How It Works
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl md:text-5xl font-black text-white leading-tight mb-5"
            >
              Four steps from incident to insight
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="text-white/50 text-sm leading-relaxed mb-10"
            >
              jobsafe guides your team through a proven process — from the moment something happens to the changes that stop it happening again.
            </motion.p>

            <div className="flex flex-col divide-y divide-white/10">
              {steps.map(({ number, title, description }, i) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-5 py-6 first:pt-0 last:pb-0"
                >
                  <span className="text-xs font-bold text-[#e5342a] tabular-nums shrink-0 pt-0.5 w-6">
                    {number}
                  </span>
                  <div>
                    <p className="font-bold text-white mb-1">{title}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — real admin dashboard screenshot */}
          <div className="flex justify-center lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px]"
            >
              <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-[radial-gradient(circle,#e5342a,transparent_70%)] scale-110" />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="relative drop-shadow-[0_20px_50px_rgba(229,52,42,0.25)]"
              >
                <Image
                  src="/images/screens/admin-dashboard.png"
                  alt="jobsafe admin dashboard — live incident feed, weekly stats, and reports-by-category breakdown"
                  width={636}
                  height={1120}
                  className="w-full h-auto"
                  priority={false}
                />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
