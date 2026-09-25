'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRICE_BOOK, PRICE_UNSET_LABEL, VAT_SUFFIX, priceBookHasPrices, type PriceBookTier, type PriceBookTierId } from '@/lib/brand'
import { track } from '@/lib/analytics'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Switch } from '@/components/ui/switch'
import { Chip } from '@/components/ui/chip'
import { NumberTicker } from '@/components/ui/number-ticker'
import { BookDemoButton } from '@/components/ui/book-demo-button'

/**
 * PricingExplorer — the team-size selector (1–25, 26–250, 250+) that
 * highlights a tier, the monthly / annual switch, and the three tiers from
 * PRICE_BOOK. Prices tick over with NumberTicker when they change. While no
 * price is set every tier shows "Book a demo for pricing" and the annual
 * switch explains it changes nothing yet. Fires `pricing_toggle`.
 */
const SIZES = [
  { value: '1-25', label: '1–25', tier: 'essentials' as PriceBookTierId },
  { value: '26-250', label: '26–250', tier: 'professional' as PriceBookTierId },
  { value: '250+', label: '250+', tier: 'enterprise' as PriceBookTierId },
] as const

const TIERS: readonly PriceBookTier[] = [PRICE_BOOK.essentials, PRICE_BOOK.professional, PRICE_BOOK.enterprise]

/** Annual price per user per month once terms exist; until then the monthly figure. */
function displayPrice(tier: PriceBookTier, annual: boolean): number | null {
  if (tier.pricePerUserMonthExVat === null) return null
  // Annual terms are a string ("2 months free") until the price book is finalised; the
  // arithmetic lives in lib/brand.ts (annualPrice) once a discount is agreed.
  return annual ? tier.pricePerUserMonthExVat : tier.pricePerUserMonthExVat
}

export function PricingExplorer() {
  const [size, setSize] = React.useState<(typeof SIZES)[number]['value']>('26-250')
  const [annual, setAnnual] = React.useState(false)
  const priced = priceBookHasPrices()
  const highlighted = SIZES.find((s) => s.value === size)?.tier ?? 'professional'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-control border border-line-1 bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <span id="team-size-label" className="text-[13px] font-bold text-ink-1">
            How many people will use it?
          </span>
          <ToggleGroup
            type="single"
            value={size}
            onValueChange={(v) => {
              if (!v) return
              setSize(v as typeof size)
              track('pricing_toggle', { control: 'team_size', value: v })
            }}
            aria-labelledby="team-size-label"
          >
            {SIZES.map((s) => (
              <ToggleGroupItem key={s.value} value={s.value}>
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="billing-annual" className="text-[13px] font-bold text-ink-1">
            Monthly
          </label>
          <Switch
            id="billing-annual"
            checked={annual}
            onCheckedChange={(v) => {
              setAnnual(v)
              track('pricing_toggle', { control: 'billing', value: v ? 'annual' : 'monthly' })
            }}
            aria-label="Bill annually"
          />
          <span className="text-[13px] font-bold text-ink-1">Annual</span>
          {annual && !priced ? <Chip status="neutral">Terms to follow</Chip> : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const price = displayPrice(tier, annual)
          const featured = tier.id === highlighted
          return (
            <div
              key={tier.id}
              data-highlighted={featured}
              className={cn('flex h-full flex-col gap-5 rounded-control border bg-canvas p-6 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo', featured ? 'border-brand-tint-18 shadow-hover ring-1 ring-brand-tint-18' : 'border-line-1')}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-ink-1">{tier.name}</h2>
                {featured ? <Chip status="brand">For {SIZES.find((s) => s.tier === tier.id)?.label} people</Chip> : null}
              </div>
              <div className="min-h-16">
                {price !== null ? (
                  <p className="flex items-baseline gap-2">
                    <NumberTicker value={price} decimalPlaces={2} prefix="£" className="type-mono text-4xl font-medium tracking-tight text-ink-1" />
                    <span className="text-sm font-bold text-ink-4">{VAT_SUFFIX}</span>
                    <span className="type-small text-ink-5">per user per month{annual ? ', billed annually' : ''}</span>
                  </p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-ink-1">{tier.priceNote ?? PRICE_UNSET_LABEL}</p>
                    <p className="type-small mt-1 text-ink-5">{tier.priceNote ? 'Bespoke, quoted in pounds with VAT shown.' : 'Per user per month, in pounds, VAT shown, quoted on the call.'}</p>
                  </>
                )}
                {tier.annualTerms ? <p className="type-small mt-1 text-ink-5">Annual: {tier.annualTerms}</p> : null}
              </div>
              <ul className="flex flex-1 flex-col gap-2">
                {tier.includedModules.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-good-text" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <BookDemoButton placement={`pricing-${tier.id}`} variant={featured ? 'primary' : 'secondary'} size="md" block>
                {tier.id === 'enterprise' ? 'Talk to us' : 'Book a demo'}
              </BookDemoButton>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PricingExplorer
