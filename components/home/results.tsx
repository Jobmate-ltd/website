import { ClipboardList, HardHat, Search, ShieldCheck, TrendingDown, Zap } from 'lucide-react'
import { SIGNUP_TRIAL_URL } from '@/lib/brand'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'

const RESULTS = [
  {
    icon: <Zap />,
    title: 'Faster reporting',
    description: 'Workers file a full incident report before they have left the scene. No missed incidents from forms that get filled in "later".',
  },
  {
    icon: <Search />,
    title: 'Stronger investigations',
    description: 'Rich data, with photos, GPS, timestamps and witness notes, gives investigators everything they need from the outset.',
  },
  {
    icon: <ShieldCheck />,
    title: 'Improved compliance',
    description: 'Audit-ready records and workflows built around ISO 45001, the international standard for occupational health and safety management, so your reporting supports audit and certification.',
  },
  {
    icon: <ClipboardList />,
    title: 'Reduced admin',
    description: 'No more chasing paperwork or re-keying data. Automated routing gets every report to the right person.',
  },
  {
    icon: <TrendingDown />,
    title: 'Proactive risk reduction',
    description: 'Analytics identify patterns before they become repeat incidents. Prevention, not just reaction.',
  },
  {
    icon: <HardHat />,
    title: 'Safer workplaces',
    description: 'When reporting is effortless, people actually report. More data means better decisions and a stronger safety culture.',
  },
] as const

export function Results() {
  return (
    <Section id="why-jobsafe" tone="grey" divider>
      <SectionHeading eyebrow="Why teams choose jobsafe" title="Results you'll see from day one" align="center" tone="grey" />
      <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-control border border-line-1 bg-line-1 sm:grid-cols-2 lg:grid-cols-3">
        {RESULTS.map((result, i) => (
          <Reveal as="li" key={result.title} index={i % 3} className="bg-canvas p-6">
            <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-5">
              {result.icon}
            </span>
            <h3 className="mt-5 text-base font-bold text-ink-1">{result.title}</h3>
            <p className="type-small mt-2 text-ink-5">{result.description}</p>
          </Reveal>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <Button variant="primary" size="lg" asChild>
          <a href={SIGNUP_TRIAL_URL}>Sign up now</a>
        </Button>
      </div>
    </Section>
  )
}

export default Results
