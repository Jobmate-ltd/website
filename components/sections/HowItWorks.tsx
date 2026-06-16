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
      'Supervisors receive instant alerts, verify the details, and forward the information to the relevant department.',
  },
  {
    number: '03',
    title: 'Resolve',
    description:
      'Track every reported issue through to resolution with automated reminders and status updates.',
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

          {/* Right — new admin dashboard screenshot in a CSS phone frame */}
          <div className="flex justify-center lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full max-w-[270px] sm:max-w-[290px]"
            >
              {/* Soft red glow behind the device */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-[radial-gradient(circle,#e5342a,transparent_70%)] scale-110" />

              {/* Slow float — disabled under prefers-reduced-motion via MotionProvider */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Phone frame (CSS only) */}
                <div className="relative rounded-[2.75rem] bg-gradient-to-b from-[#2b2b2e] to-[#161618] p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),0_18px_50px_-12px_rgba(229,52,42,0.22)] ring-1 ring-white/10">
                  {/* Side buttons */}
                  <span className="absolute -left-[2px] top-[20%] h-7 w-[3px] rounded-l-sm bg-[#0c0c0d]" />
                  <span className="absolute -left-[2px] top-[31%] h-12 w-[3px] rounded-l-sm bg-[#0c0c0d]" />
                  <span className="absolute -right-[2px] top-[26%] h-16 w-[3px] rounded-r-sm bg-[#0c0c0d]" />

                  {/* Screen */}
                  <div className="relative overflow-hidden rounded-[2.1rem] bg-black">
                    {/* Top bezel + dynamic island */}
                    <div className="relative flex h-7 items-center justify-center bg-black">
                      <div className="flex h-[18px] w-[34%] items-center justify-center gap-2 rounded-full bg-[#050505] ring-1 ring-white/10">
                        <span className="h-1 w-1 rounded-full bg-zinc-600" />
                        <span className="h-1 w-3 rounded-full bg-zinc-800" />
                      </div>
                    </div>

                    <Image
                      src="/images/screens/jobsafe-admin-dashboard.png"
                      alt="jobsafe admin dashboard — reports by category, weekly site breakdown, and the depot incident summary"
                      width={379}
                      height={842}
                      sizes="(min-width: 640px) 290px, 270px"
                      className="block h-auto w-full"
                      priority={false}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
