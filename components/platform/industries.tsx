import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { routeExists } from '@/lib/routes'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

/**
 * PlatformIndustries — section 8 of the homepage: one card per industry that
 * has a page, Transport first, each written in that sector's words
 * (docs/REBUILD.md §4). Industries without a page are not listed.
 */
const INDUSTRIES: readonly { href: string; name: string; copy: string; image: string; alt: string }[] = [
  {
    href: '/industries/transport-logistics',
    name: 'Transport & logistics',
    copy: 'Yard, depot and cab. Walkarounds that raise defects, tail-lift and banksman incidents reported from the trailer, MOT and LOLER dates on every vehicle.',
    image: '/images/industries/logistics.png',
    alt: 'A haulage yard with an HGV backed onto a loading bay',
  },
  {
    href: '/industries/window-door-fitters',
    name: 'Window & door fitters',
    copy: 'On site, up a ladder, with the van as the office. The near miss written down before the next job, and the evidence an insurer or a principal contractor will ask for.',
    image: '/videos/window-fitter-hero-poster.jpg',
    alt: 'A fitter installing a window frame on site',
  },
  {
    href: '/industries/field-services',
    name: 'Field services',
    copy: 'Lone engineers on sites you do not control. A report from the customer’s car park with a photo and the location, and the risk assessment for the job in the same app.',
    image: '/images/industries/field-services.png',
    alt: 'A field engineer working at a customer site',
  },
  {
    href: '/industries/healthcare',
    name: 'Care & healthcare',
    copy: 'Every shift, every incident, on the record. Staff safety on home visits and lone working, with the evidence a commissioner or an inspector expects to see.',
    image: '/images/industries/healthcare.png',
    alt: 'A carer helping a resident in a care home',
  },
]

export function PlatformIndustries() {
  const cards = INDUSTRIES.filter((i) => routeExists(i.href, PLATFORM_LAUNCH))
  return (
    <Section id="industries" tone="grey">
      <SectionHeading eyebrow="Industries" title="Written for the work you actually do" lead="One platform, worded for each sector. Pick yours." tone="grey" />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((industry) => (
          <li key={industry.href}>
            <Link
              href={industry.href}
              className="group flex h-full flex-col overflow-hidden rounded-control border border-line-1 bg-canvas shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line-1 bg-bg">
                <Image src={industry.image} alt={industry.alt} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-lg font-bold leading-tight text-ink-1 group-hover:text-brand-strong">{industry.name}</h3>
                <p className="type-small flex-1 text-ink-4">{industry.copy}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong">
                  See the page
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default PlatformIndustries
