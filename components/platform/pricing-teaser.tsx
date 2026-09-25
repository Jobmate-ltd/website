import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRICE_BOOK, VAT_SUFFIX, priceBookHasPrices, priceBookLabel, type PriceBookTier } from '@/lib/brand'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { BookDemoButton } from '@/components/ui/book-demo-button'
import { Chip } from '@/components/ui/chip'

/**
 * PricingTeaser — section 10 of the homepage: the three tiers from
 * PRICE_BOOK with "+ VAT" beside any price, and a link to /pricing. While
 * no price is set it shows the tier structure and "Book a demo for pricing",
 * never a number.
 */
const TIERS: readonly PriceBookTier[] = [PRICE_BOOK.essentials, PRICE_BOOK.professional, PRICE_BOOK.enterprise]

export function TierCard({ tier, featured = false, children }: { tier: PriceBookTier; featured?: boolean; children?: React.ReactNode }) {
  const priced = tier.pricePerUserMonthExVat !== null
  return (
    <div className={cn('flex h-full flex-col gap-5 rounded-control border bg-canvas p-6 shadow-rest', featured ? 'border-brand-tint-18 ring-1 ring-brand-tint-18' : 'border-line-1')}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-ink-1">{tier.name}</h3>
        {featured ? <Chip status="brand">Most teams</Chip> : null}
      </div>
      <div className="min-h-14">
        {priced ? (
          <p className="flex items-baseline gap-2">
            <span className="type-mono text-3xl font-medium tracking-tight text-ink-1">{priceBookLabel(tier).split(' ')[0]}</span>
            <span className="text-sm font-bold text-ink-4">{VAT_SUFFIX}</span>
            <span className="type-small text-ink-5">per user per month</span>
          </p>
        ) : (
          <p className="text-base font-bold text-ink-1">{priceBookLabel(tier)}</p>
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
      {children}
    </div>
  )
}

export function PricingTeaser() {
  const priced = priceBookHasPrices()
  return (
    <Section id="pricing" tone="grey">
      <SectionHeading
        eyebrow="Pricing"
        title={priced ? 'Prices in pounds, VAT shown' : 'Three tiers. Prices in pounds, VAT shown.'}
        lead={priced ? 'Per user per month. No sales call needed to see the numbers.' : 'The price list is being finalised. Book a demo and we will quote for your team on the call.'}
        tone="grey"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} featured={tier.id === 'professional'}>
            <BookDemoButton placement={`home-pricing-${tier.id}`} variant={tier.id === 'professional' ? 'primary' : 'secondary'} size="md" block>
              {tier.id === 'enterprise' ? 'Talk to us' : 'Book a demo'}
            </BookDemoButton>
          </TierCard>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button variant="link" asChild>
          <Link href="/pricing">
            See the full comparison and the cost-of-paper calculator
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Section>
  )
}

export default PricingTeaser
