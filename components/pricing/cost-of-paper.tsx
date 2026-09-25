'use client'

import * as React from 'react'
import { PRICE_BOOK, VAT_SUFFIX, formatPrice, priceBookHasPrices } from '@/lib/brand'
import { track } from '@/lib/analytics'
import { Slider } from '@/components/ui/slider'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Card } from '@/components/ui/card'

/**
 * CostOfPaper — the calculator: reports per month × minutes per paper report ×
 * hourly cost, set against the plan price. The working is shown in full and
 * nothing is gated. While the price book is unset the plan side reads
 * "Book a demo for pricing" and the paper side still computes. Fires
 * `calculator_used` on the first change.
 *
 * seo-audit-ignore: vat-shown — the `formatPrice()` calls here format the
 * visitor's own paper cost (hours × their hourly rate), not a jobsafe price.
 * The one jobsafe figure on this page carries VAT_SUFFIX beside it.
 */
const inputClass = 'min-h-11 w-24 rounded-control border border-line-1 bg-canvas px-3 text-right type-mono text-sm text-ink-1 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function Row({ id, label, hint, value, min, max, step, onChange, prefix, suffix }: { id: string; label: string; hint: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; prefix?: string; suffix?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-[13px] font-bold text-ink-1">
          {label}
        </label>
        <span className="inline-flex items-center gap-1 text-sm text-ink-4">
          {prefix ? <span aria-hidden="true">{prefix}</span> : null}
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
            className={inputClass}
          />
          {suffix ? <span aria-hidden="true">{suffix}</span> : null}
        </span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} thumbLabel={label} />
      <p className="type-small text-ink-5">{hint}</p>
    </div>
  )
}

export function CostOfPaper() {
  const [reports, setReports] = React.useState(40)
  const [minutes, setMinutes] = React.useState(25)
  const [hourly, setHourly] = React.useState(22)
  const [users, setUsers] = React.useState(30)
  const touched = React.useRef(false)
  const priced = priceBookHasPrices()

  const change = (setter: (v: number) => void) => (v: number) => {
    setter(v)
    if (!touched.current) {
      touched.current = true
      track('calculator_used', { calculator: 'cost_of_paper' })
    }
  }

  const hoursPerMonth = (reports * minutes) / 60
  const paperPerMonth = hoursPerMonth * hourly
  const paperPerYear = paperPerMonth * 12
  const planPrice = PRICE_BOOK.professional.pricePerUserMonthExVat
  const planPerMonth = planPrice !== null ? planPrice * users : null

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-7">
        <Row id="calc-reports" label="Paper reports a month" hint="Incidents, near misses, walkarounds, permits: every form someone fills in by hand." value={reports} min={1} max={500} step={1} onChange={change(setReports)} />
        <Row id="calc-minutes" label="Minutes per paper report" hint="Writing it, walking it to the office, typing it up, chasing the missing bits." value={minutes} min={5} max={120} step={5} onChange={change(setMinutes)} suffix="min" />
        <Row id="calc-hourly" label="Hourly cost of the people doing it" hint="Loaded cost, not just the wage." value={hourly} min={10} max={80} step={1} onChange={change(setHourly)} prefix="£" />
        <Row id="calc-users" label="People who would use jobsafe" hint="Everyone with a login, in any role." value={users} min={1} max={500} step={1} onChange={change(setUsers)} />
      </div>
      <Card className="flex flex-col gap-6 p-6 md:p-8" aria-live="polite">
        <div>
          <p className="type-eyebrow text-ink-4">The working</p>
          <p className="type-mono mt-2 text-sm text-ink-4">
            {reports} reports × {minutes} min ÷ 60 = {hoursPerMonth.toFixed(1)} hours a month
            <br />
            {hoursPerMonth.toFixed(1)} hours × £{hourly} = <strong className="text-ink-1">{formatPrice(paperPerMonth)}</strong> a month on paper
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-control border border-line-1 bg-bg p-4">
            <p className="type-eyebrow text-ink-4">Paper, a year</p>
            <NumberTicker value={Math.round(paperPerYear)} prefix="£" className="mt-2 type-mono text-3xl font-medium tracking-tight text-ink-1" />
            <p className="type-small mt-1 text-ink-5">In time alone. Not the fine, the claim or the lost contract.</p>
          </div>
          <div className="rounded-control border border-line-1 bg-bg p-4">
            <p className="type-eyebrow text-ink-4">jobsafe, a month</p>
            {planPerMonth !== null ? (
              <>
                <NumberTicker value={planPerMonth} decimalPlaces={2} prefix="£" className="mt-2 type-mono text-3xl font-medium tracking-tight text-ink-1" />
                <p className="type-small mt-1 text-ink-5">
                  {users} users × {formatPrice(planPrice as number)} {VAT_SUFFIX}, Professional.
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-lg font-bold text-ink-1">Book a demo for pricing</p>
                <p className="type-small mt-1 text-ink-5">{users} users, quoted per user per month in pounds, VAT shown. Set it against the figure on the left.</p>
              </>
            )}
          </div>
        </div>
        <p className="type-small text-ink-5">
          {priced && planPerMonth !== null
            ? paperPerMonth > planPerMonth
              ? `Paper costs ${formatPrice(paperPerMonth - planPerMonth)} a month more than the plan, before anything else improves.`
              : 'On these numbers the plan costs more than the paper time it replaces; the case rests on what paper misses, not on the minutes.'
            : 'The plan price goes in this box the day the price list is published. Until then, take the paper figure to the demo and we will put the quote beside it.'}
        </p>
      </Card>
    </div>
  )
}

export default CostOfPaper
