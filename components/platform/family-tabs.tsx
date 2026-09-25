import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAMILIES, modulesIn, type Family } from '@/lib/platform'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Chip } from '@/components/ui/chip'
import { PlatformIcon } from '@/components/platform/icons'
import { ProductShot } from '@/components/platform/product-shot'

/**
 * FamilyTabs — section 4 of the homepage: Record / Resolve / Prevent on
 * shadcn/ui Tabs, each listing its modules with a one-line promise and the
 * matching real screenshot. A module links to its page once the page
 * exists; until then it is text with an "Expanding" or no chip, never a
 * link to a 404. All three panels are in the HTML.
 */
const FAMILY_ORDER: readonly Family[] = ['record', 'resolve', 'prevent']

export function FamilyTabs() {
  return (
    <Section id="features" tone="white">
      <SectionHeading
        eyebrow="Record. Resolve. Prevent."
        title="Three jobs, one record"
        lead="Every module writes to the same record, so what a driver reports in the yard is what the investigator opens, what the action is raised from and what the next risk assessment reads."
      />
      <Tabs defaultValue="record" className="mt-10">
        <TabsList aria-label="Product families">
          {FAMILY_ORDER.map((family) => (
            <TabsTrigger key={family} value={family}>
              {FAMILIES[family].name}
            </TabsTrigger>
          ))}
        </TabsList>
        {FAMILY_ORDER.map((family) => (
          <TabsContent key={family} value={family}>
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
              <div className="flex flex-col gap-6">
                <p className="type-lead text-ink-4">{FAMILIES[family].promise}</p>
                <ul className="divide-y divide-line-1 border-y border-line-1">
                  {modulesIn(family).map((module) => {
                    const body = (
                      <>
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-brand-tint-08 text-brand">
                          <PlatformIcon name={module.icon} className="size-4" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className={cn('text-[15px] font-bold text-ink-1', module.path && 'group-hover:text-brand-strong')}>{module.name}</span>
                            {module.status === 'expanding' ? <Chip status="info">Expanding</Chip> : null}
                          </span>
                          <span className="type-small text-ink-5">{module.promise}</span>
                        </span>
                        {module.path ? <ArrowRight className="mt-2 size-4 shrink-0 text-brand-strong opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" /> : null}
                      </>
                    )
                    return (
                      <li key={module.id}>
                        {module.path ? (
                          <Link href={module.path} className="group flex items-start gap-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                            {body}
                          </Link>
                        ) : (
                          <div className="flex items-start gap-4 py-3.5">{body}</div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <ProductShot id={FAMILIES[family].screenshot} frame caption />
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <p className="type-small mt-8 text-ink-5">
        <Link href="/platform" className="font-semibold text-brand-strong hover:underline">
          See the whole platform
        </Link>
        , what feeds what, and the two-minute tour.
      </p>
    </Section>
  )
}

export default FamilyTabs
