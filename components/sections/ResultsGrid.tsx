'use client'
import { motion } from 'framer-motion'
import AmbientGlow from '@/components/AmbientGlow'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import { PiLightning as Zap, PiMagnifyingGlass as Search, PiShieldCheck as ShieldCheck, PiClipboardText as ClipboardList, PiTrendDown as TrendingDown, PiHardHat as HardHat } from 'react-icons/pi'

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
    description: 'Audit-ready records and workflows built around ISO 45001 — the international standard for occupational health & safety management — so your reporting supports audit and certification.',
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
    <section id="why-jobsafe" className="relative overflow-hidden bg-surface-0 py-12 md:py-14">
      <AmbientGlow position="top" intensity={0.08} className="h-[460px]" />

      <div className="relative z-10">
        <div className="mb-14 px-4 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">
            Why teams choose jobsafe
          </p>
          <h2 className="text-4xl font-black text-white text-balance md:text-5xl">
            Results you&apos;ll see from day one
          </h2>
        </div>

        {/* Bento panel: the 1px background bleeds through gap-px to draw the grid
            lines, so the six cells read as one connected surface at any column
            count instead of three floating columns. */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result, i) => (
              <motion.div
                key={result.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="group relative bg-surface-0 p-7 transition-colors duration-200 hover:bg-white/[0.03]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/15 bg-brand/10 transition-colors duration-200 group-hover:border-brand/40">
                  <result.icon className="size-5 text-brand" aria-hidden />
                </div>
                <h3 className="mt-6 text-base font-bold text-white">{result.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50 text-pretty">{result.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={SIGNUP_TRIAL_URL}
            className="rounded-md bg-brand px-8 py-4 text-sm font-bold text-white transition active:scale-[0.97] hover:bg-brand-hover motion-safe:transition-all motion-safe:hover:-translate-y-0.5"
          >
            Sign up now
          </a>
        </div>
      </div>
    </section>
  )
}
