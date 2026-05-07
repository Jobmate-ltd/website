'use client'
import { motion } from 'framer-motion'
import { FeatureCard } from '@/components/blocks/grid-feature-cards'
import { Zap, Search, ShieldCheck, ClipboardList, TrendingDown, HardHat } from 'lucide-react'

const results = [
  {
    icon: Zap,
    title: 'Faster reporting',
    description: 'Workers submit a full incident report in under 60 seconds. No missed incidents from forms that get filled in "later".',
  },
  {
    icon: Search,
    title: 'Stronger investigations',
    description: 'Rich data — photos, GPS, timestamps, witness notes — gives investigators everything they need from the outset.',
  },
  {
    icon: ShieldCheck,
    title: 'Improved compliance',
    description: 'Audit-ready records, HSSE-aligned workflows, and automatic documentation that keeps regulators satisfied.',
  },
  {
    icon: ClipboardList,
    title: 'Reduced admin',
    description: 'No more chasing paperwork or manually entering data. Automated routing gets every report to the right person instantly.',
  },
  {
    icon: TrendingDown,
    title: 'Proactive risk reduction',
    description: 'Analytics identify patterns before they become repeat incidents. Prevention, not just reaction.',
  },
  {
    icon: HardHat,
    title: 'Safer workplaces',
    description: 'When reporting is effortless, people actually report. More data means better decisions and a stronger safety culture.',
  },
]

export default function ResultsGrid() {
  return (
    <section id="why-jobsafe" className="py-12 md:py-14 bg-[#0a0a0a]">
      <div className="text-center mb-16 px-4">
        <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-4">
          Why Teams Choose jobsafe
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Results you&apos;ll see from day one
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3">
        {results.map((result) => (
          <div key={result.title} className="relative">
            {/* Static card content — never animates */}
            <FeatureCard
              feature={{
                title: result.title,
                description: result.description,
                icon: (props) => (
                  <result.icon
                    {...props}
                    className="size-6 text-[#e5342a]"
                    strokeWidth={1}
                  />
                ),
              }}
              className="bg-transparent h-full [&_h3]:text-white [&_p]:text-white/50"
            />
            {/* Pulsing border overlay — only this animates */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-xl border border-[#e5342a]/20"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <a
          href="tel:03338000883"
          className="bg-[#e5342a] hover:bg-[#c42d24] text-white font-bold text-sm px-8 py-4 rounded-md transition-colors"
        >
          Call 0333 8000 883
        </a>
      </div>
    </section>
  )
}
