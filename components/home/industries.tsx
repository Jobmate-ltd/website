import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase, Building2, Factory, HardHat, HeartPulse, PanelTop, Truck, Zap } from 'lucide-react'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Reveal } from '@/components/ui/reveal'

interface Industry {
  title: string
  description: string
  image: string
  icon: React.ReactNode
  /** The industry page, where one exists. */
  href?: string
}

/**
 * Every industry card that has a landing page links to it. Window & door
 * fitters is in the grid; the four sectors without a page yet are cards only.
 */
const INDUSTRIES: readonly Industry[] = [
  {
    title: 'Window & door fitters',
    description: 'Glass is heavy, edges are sharp, and half the job happens up a ladder. Record it on the day, on the spot.',
    image: '/videos/window-fitter-hero-poster.jpg',
    icon: <PanelTop />,
    href: '/industries/window-door-fitters',
  },
  {
    title: 'Healthcare & social care',
    description: 'Capture moving-and-handling injuries, sharps, falls and aggression on the shift they happen.',
    image: '/images/industries/healthcare.png',
    icon: <HeartPulse />,
    href: '/industries/healthcare',
  },
  {
    title: 'Field services',
    description: 'Give lone workers a fast, offline-capable way to report incidents wherever the job takes them.',
    image: '/images/industries/field-services.png',
    icon: <Briefcase />,
    href: '/industries/field-services',
  },
  {
    title: 'Transport & logistics',
    description: 'Report forklift incidents, manual handling injuries and loading bay hazards the moment they happen.',
    image: '/images/industries/logistics.png',
    icon: <Truck />,
    href: '/industries/transport-logistics',
  },
  {
    title: 'Construction',
    description: 'Track near misses, falls and equipment incidents across complex, multi-site builds.',
    image: '/images/industries/construction.png',
    icon: <HardHat />,
  },
  {
    title: 'Facilities management',
    description: 'Manage contractor safety, maintenance hazards and compliance across your estate from one dashboard.',
    image: '/images/industries/facilities.png',
    icon: <Building2 />,
  },
  {
    title: 'Manufacturing',
    description: 'Log machinery faults, COSHH exposures and production-line hazards, with evidence attached at the point of capture.',
    image: '/images/industries/manufacturing.png',
    icon: <Factory />,
  },
  {
    title: 'Energy & utilities',
    description: 'Capture high-consequence incidents with the detail a regulator will ask for, from site to submission.',
    image: '/images/industries/energy.png',
    icon: <Zap />,
  },
]

function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const body = (
    <Card interactive={Boolean(industry.href)} className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line-1 bg-bg">
        <Image
          src={industry.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-4">
            {industry.icon}
          </span>
          <h3 className="text-base font-bold text-ink-1">{industry.title}</h3>
        </div>
        <p className="type-small text-ink-5">{industry.description}</p>
        {industry.href ? (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-brand-strong">
            See how it works for you
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </Card>
  )

  return (
    <Reveal as="li" index={index % 4} className="h-full">
      {industry.href ? (
        <Link href={industry.href} className="group block h-full rounded-control" aria-label={`${industry.title}: see how jobsafe works for you`}>
          {body}
        </Link>
      ) : (
        body
      )}
    </Reveal>
  )
}

export function Industries() {
  return (
    <Section id="industries" tone="grey" divider>
      <SectionHeading
        eyebrow="Industries"
        title="Built for industries where safety is non-negotiable"
        lead="From construction site safety to depot incident reporting, jobsafe is built for environments where a slow or paper-based process is not good enough."
        tone="grey"
      />
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRIES.map((industry, i) => (
          <IndustryCard key={industry.title} industry={industry} index={i} />
        ))}
      </ul>
    </Section>
  )
}

export default Industries
