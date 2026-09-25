'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ANNUAL_TERMS,
  DEMO_DURATION_LABEL,
  LICENCES,
  SIGNUP_TRIAL_URL,
  VAT_NOTE,
  VAT_SUFFIX,
  annualPrice,
  formatPrice,
  trialSentence,
  type LicenceType,
} from '@/lib/brand'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Card } from '@/components/ui/card'
import { BookDemoButton } from '@/components/ui/book-demo-button'

/**
 * Pricing — the one pricing block, on the homepage and every industry page.
 *
 * Two licence types from lib/brand.ts, each with "+ VAT" beside the price, a
 * monthly / annual switch that words annual billing exactly as checkout does,
 * the Worker volume tiers, and one trial sentence. Nothing here is typed in;
 * change the constants and every page follows.
 *
 * @example
 *   <Pricing />
 */
function LicenceCard({ licence, yearly, primary }: { licence: LicenceType; yearly: boolean; primary: boolean }) {
  const monthly = licence.price
  return (
    <Card className={cn('flex h-full flex-col p-6 md:p-8', primary && 'border-brand-tint-18')}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="type-h3 text-ink-1">{licence.name} licence</h3>
        {primary ? <Chip status="brand">Per worker</Chip> : <Chip status="outline">Per admin</Chip>}
      </div>
      <p className="type-small mt-2 text-ink-5">{licence.summary}</p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[44px] font-extrabold leading-none tracking-[-0.03em] text-ink-1">
          {yearly ? formatPrice(annualPrice(monthly)) : formatPrice(monthly)}
        </span>
        <span className="text-sm font-bold text-ink-3">{VAT_SUFFIX}</span>
        <span className="w-full text-sm text-ink-5">
          {yearly ? `per licence per year, billed annually (${ANNUAL_TERMS})` : 'per licence per month'}
        </span>
      </div>

      {licence.volume ? (
        <dl className="mt-6 divide-y divide-line-1 border-y border-line-1">
          {licence.volume.map((tier) => (
            <div key={tier.threshold} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <dt className="text-ink-4">{tier.threshold}</dt>
              <dd className="type-mono font-medium text-ink-1">
                {tier.price === null ? 'Bespoke' : `${formatPrice(yearly ? annualPrice(tier.price) : tier.price)} ${VAT_SUFFIX}`}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <ul className="mt-6 flex flex-col gap-2.5">
        {licence.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink-3">
            <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button variant={primary ? 'primary' : 'secondary'} size="lg" block asChild>
          <a href={SIGNUP_TRIAL_URL}>Sign up now</a>
        </Button>
      </div>
    </Card>
  )
}

export function Pricing({ tone = 'grey' }: { tone?: 'white' | 'grey' }) {
  const [yearly, setYearly] = React.useState(false)
  const switchId = React.useId()

  return (
    <Section id="pricing" tone={tone} divider>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Pricing"
          title="Two licence types. Every feature included."
          lead="No feature tiers and nothing held back for an upsell. Workers report from the app; admins run the dashboard."
          tone={tone}
        />
        <div role="group" aria-labelledby={switchId} className="flex shrink-0 items-center gap-1 rounded-control border border-line-1 bg-canvas p-1">
          <span id={switchId} className="sr-only">
            Billing period
          </span>
          {(['monthly', 'annual'] as const).map((period) => {
            const active = period === 'annual' ? yearly : !yearly
            return (
              <button
                key={period}
                type="button"
                aria-pressed={active}
                onClick={() => setYearly(period === 'annual')}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 rounded-control px-4 text-sm font-bold transition-colors duration-200',
                  active ? 'bg-ink-1 text-canvas' : 'text-ink-3 hover:bg-line-3 hover:text-ink-1',
                )}
              >
                {period === 'monthly' ? 'Monthly' : 'Annual'}
                {period === 'annual' ? (
                  <span className={cn('rounded-pill px-2 py-0.5 text-[11px] font-bold', active ? 'bg-canvas/15 text-canvas' : 'bg-brand-tint-08 text-brand-strong')}>
                    {ANNUAL_TERMS}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <LicenceCard licence={LICENCES.worker} yearly={yearly} primary />
        <LicenceCard licence={LICENCES.admin} yearly={yearly} primary={false} />
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-control border border-line-1 bg-canvas p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-ink-1">Rolling out to 1,000 or more workers?</p>
          <p className="type-small mt-1 text-ink-5">Bespoke pricing, a dedicated account manager and a GDPR data processing agreement. Book {DEMO_DURATION_LABEL} and we will size it with you.</p>
        </div>
        <BookDemoButton placement="pricing-enterprise" variant="secondary" size="md" className="shrink-0" />
      </div>

      <p className="type-small mt-6 text-ink-5">
        {trialSentence()} {VAT_NOTE}
      </p>
    </Section>
  )
}

export default Pricing
