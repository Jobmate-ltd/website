'use client'
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

const reports = [
  {
    id: 'INC-0042',
    time: '09:14 today',
    title: 'Near miss — forklift & pedestrian crossing',
    location: 'Warehouse Bay 3',
    assigned: 'Assigned: J. Morris',
    status: 'Open',
    statusColor: 'text-[#e5342a] bg-[#e5342a]/10 border-[#e5342a]/20',
    progress: 20,
    barColor: 'bg-[#e5342a]',
  },
  {
    id: 'INC-0041',
    time: 'Yesterday 14:32',
    title: 'Spill — chemical storage aisle',
    location: 'Site B — Level 1',
    assigned: 'Assigned: K. Patel',
    status: 'In Review',
    statusColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
    progress: 60,
    barColor: 'bg-[#F59E0B]',
  },
  {
    id: 'INC-0039',
    time: '3 days ago',
    title: 'Trip hazard — loading dock ramp',
    location: 'Dock 7',
    assigned: 'Closed by: L. Chen',
    status: 'Resolved',
    statusColor: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20',
    progress: 100,
    barColor: 'bg-[#22C55E]',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
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
              JobSafe guides your team through a proven process — from the moment something happens to the changes that stop it happening again.
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

          {/* Right — mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 rounded-2xl border border-white/10 bg-[#111] overflow-hidden"
          >
            {/* Dashboard chrome bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5342a]/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
              <span className="ml-2 text-xs text-white/60">JobSafe — Live Dashboard</span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { count: '4',  label: 'Open',      color: 'text-[#e5342a]', bg: 'bg-[#e5342a]/10' },
                  { count: '7',  label: 'In Review', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                  { count: '23', label: 'Resolved',  color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                ].map(({ count, label, color, bg }) => (
                  <div key={label} className={`${bg} rounded-lg p-3 text-center`}>
                    <div className={`text-xl font-black ${color}`}>{count}</div>
                    <div className="text-xs text-white/60 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Report cards */}
              {reports.map(({ id, time, title, location, assigned, status, statusColor, progress, barColor }) => (
                <div key={id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">{id} · {time}</span>
                    <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${statusColor}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug">{title}</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{location}</span>
                    <span>{assigned}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
