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
 * (docs/REBUILD.md §4). Industries without a page in this flag state are
 * not listed; with the flag on all seven Phase 3 pages exist.
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
    href: '/industries/construction',
    name: 'Construction',
    copy: 'Sites, principal contractors and the trades. A hot-works permit that will not issue until the RAMS is live, and a fall triaged against RIDDOR before the phone call ends.',
    image: '/images/industries/construction.png',
    alt: 'A site manager in a hard hat and hi-vis watching two workers in harnesses on the steel frame of a building under construction',
  },
  {
    href: '/industries/field-services',
    name: 'Field services',
    copy: 'Lone engineers on sites you do not control. A report from the customer’s car park with a photo and the location, and the risk assessment for the job in the same app.',
    image: '/images/industries/field-services.png',
    alt: 'A field engineer working at a customer site',
  },
  {
    href: '/industries/facilities-management',
    name: 'Facilities management',
    copy: 'Occupied buildings, contractors you did not hire and a public that did not sign in. The permit gate, the incident with a visitor on it and the estate on one dashboard.',
    image: '/images/industries/facilities.png',
    alt: 'Two facilities staff in hard hats and hi-vis inspecting an empty commercial building with a row of loading-bay doors',
  },
  {
    href: '/industries/manufacturing-warehousing',
    name: 'Manufacturing & warehousing',
    copy: 'Lines, high bays and forklifts. The guarding assessment scored 5×5, the thorough examination date on every truck, and the near miss in aisle 12 written down.',
    image: '/images/industries/manufacturing.png',
    alt: 'An engineer in hi-vis with a laptop on a gantry above an automated production line with robot arms',
  },
  {
    href: '/industries/healthcare',
    name: 'Care homes & home care',
    copy: 'Staff safety, not resident records. The assault on nights reported before the shift ends, the moving and handling assessment on the phone, the refresher that lapsed.',
    image: '/images/industries/healthcare.png',
    alt: 'A carer helping a resident in a care home',
  },
  {
    href: '/industries/window-door-fitters',
    name: 'Window & door fitters',
    copy: 'On site, up a ladder, with the van as the office. The near miss written down before the next job, and the evidence an insurer or a principal contractor will ask for.',
    image: '/videos/window-fitter-hero-poster.jpg',
    alt: 'A fitter installing a window frame on site',
  },
]

export function PlatformIndustries() {
  const cards = INDUSTRIES.filter((i) => routeExists(i.href, PLATFORM_LAUNCH))
  return (
    <Section id="industries" tone="grey">
      <SectionHeading eyebrow="Industries" title="Written for the work you actually do" lead="One platform, worded for each sector. Pick yours." tone="grey" />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
