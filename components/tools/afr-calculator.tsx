'use client'

import * as React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'
import { MODULE_PATHS } from '@/lib/seo/links'
import { formatNumber } from '@/lib/tools'
import { AFR_CONVENTIONS, AFR_HOURS, PER_MILLION_NOTE, afr, afrWorking, formatRate } from '@/lib/tools/afr'

/**
 * AfrCalculator — reportable injuries and hours worked in, the rate per
 * 100,000 hours out with the working shown, and every convention's sources
 * under it. Pure client state; nothing is sent anywhere. Fires
 * `calculator_used` on the first edit.
 *
 * @example
 *   <AfrCalculator />
 */
const fieldClass = 'min-h-11 w-full rounded-control border border-line-1 bg-canvas px-3 text-sm text-ink-1 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function parseInjuries(raw: string): number | null {
  if (raw.trim() === '') return null
  const n = Number(raw)
  return Number.isInteger(n) && n >= 0 ? n : null
}

function parseHours(raw: string): number | null {
  if (raw.trim() === '') return null
  const n = Number(raw.replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

export function AfrCalculator() {
  const [injuries, setInjuries] = React.useState('')
  const [hours, setHours] = React.useState('')
  const [period, setPeriod] = React.useState('')
  const touched = React.useRef(false)

  const edit = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    if (!touched.current) {
      touched.current = true
      track('calculator_used', { calculator: 'afr' })
    }
  }

  const n = parseInjuries(injuries)
  const h = parseHours(hours)
  const injuriesError = injuries.trim() !== '' && n === null ? 'Enter a whole number, 0 or more.' : null
  const hoursError = hours.trim() !== '' && h === null ? 'Enter the hours as a number greater than 0.' : null
  const value = n !== null && h !== null ? afr(n, h, AFR_HOURS.multiplier) : null
  const working = n !== null && h !== null ? afrWorking(n, h, AFR_HOURS.multiplier) : null
  const label = period.trim() ? ` for ${period.trim()}` : ''

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
        <form className="flex flex-col gap-5 rounded-control border border-line-1 bg-canvas p-5 shadow-rest md:p-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="afr-injuries" className="text-sm font-bold text-ink-1">
              RIDDOR-reportable injuries in the period
            </label>
            <input
              id="afr-injuries"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={injuries}
              onChange={(e) => edit(setInjuries)(e.target.value)}
              aria-describedby={injuriesError ? 'afr-injuries-help afr-injuries-error' : 'afr-injuries-help'}
              aria-invalid={injuriesError ? true : undefined}
              className={cn(fieldClass, 'type-mono')}
            />
            <p id="afr-injuries-help" className="type-small text-ink-5">
              Specified injuries and over-7-day incapacitations; add non-worker hospital cases if the question asks for them.
            </p>
            {injuriesError ? (
              <p id="afr-injuries-error" className="text-[13px] font-semibold text-critical-text">
                {injuriesError}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="afr-hours" className="text-sm font-bold text-ink-1">
              Total hours worked in the period
            </label>
            <input
              id="afr-hours"
              type="text"
              inputMode="decimal"
              value={hours}
              onChange={(e) => edit(setHours)(e.target.value)}
              aria-describedby={hoursError ? 'afr-hours-help afr-hours-error' : 'afr-hours-help'}
              aria-invalid={hoursError ? true : undefined}
              className={cn(fieldClass, 'type-mono')}
            />
            <p id="afr-hours-help" className="type-small text-ink-5">
              From payroll or timesheets, for everyone the question covers.
            </p>
            {hoursError ? (
              <p id="afr-hours-error" className="text-[13px] font-semibold text-critical-text">
                {hoursError}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="afr-period" className="text-sm font-bold text-ink-1">
              Period <span className="font-normal text-ink-5">(optional)</span>
            </label>
            <input id="afr-period" type="text" value={period} onChange={(e) => edit(setPeriod)(e.target.value)} placeholder="2025" maxLength={40} className={fieldClass} />
            <p className="type-small text-ink-5">A calendar year or a rolling twelve months, the same one for both figures.</p>
          </div>
        </form>

        <div className="flex flex-col gap-5 rounded-control border border-line-1 bg-bg p-5 md:p-6">
          <div id="afr-result" aria-live="polite" className="flex flex-col gap-4">
            {value !== null && working ? (
              <>
                <div>
                  <p className="type-eyebrow text-ink-4">Accident frequency rate{label}</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="type-mono text-4xl font-medium tracking-tight text-ink-1">{formatRate(value)}</span>
                    <span className="text-sm font-bold text-ink-4">{AFR_HOURS.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="type-eyebrow text-ink-4">The working</p>
                  <p className="type-mono mt-2 text-sm text-ink-1">{working}</p>
                  <p className="type-small mt-1 text-ink-5">
                    {formatNumber(n as number)} reportable {n === 1 ? 'injury' : 'injuries'} × {formatNumber(AFR_HOURS.multiplier)}, divided by {formatNumber(h as number)} hours worked{label}.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 rounded-control border border-dashed border-line-1 bg-canvas p-4">
                <p className="text-sm font-bold text-ink-1">The rate appears here</p>
                <p className="type-small text-ink-4">Enter the reportable injuries and the hours worked to see the rate per 100,000 hours with its working.</p>
              </div>
            )}
          </div>
          <p className="type-small border-t border-line-1 pt-4 text-ink-5">
            jobsafe keeps the incident record the numerator comes from, but does not calculate an AFR: the hours live in your payroll, so the figure is yours to check and quote.{' '}
            <Link href={MODULE_PATHS.incidents} className="font-bold text-brand-strong hover:underline">
              See incident reporting
            </Link>
            .
          </p>
        </div>
      </div>

      <section aria-labelledby="afr-conventions-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h3 id="afr-conventions-heading" className="type-h3 text-ink-1">
            Two conventions, two different measures
          </h3>
          <p className="type-small measure text-ink-4">The number you quote is only comparable with one built the same way, so each convention is named with its source.</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {AFR_CONVENTIONS.map((c) => (
            <li key={c.id} className="flex flex-col gap-3 rounded-control border border-line-1 bg-canvas p-5 shadow-rest">
              <p className="text-base font-bold text-ink-1">{c.name}</p>
              <p className="type-small text-ink-4">{c.explain}</p>
              <p className="type-small font-semibold text-ink-3">{c.denominator === 'hours' ? 'This is the rate shown above.' : 'Not computed here: it needs the average headcount, not hours.'}</p>
              <p className="type-eyebrow mt-1 text-ink-4">Sources</p>
              <ul className="flex flex-col gap-3">
                {c.sources.map((s) => (
                  <li key={s.url} className="flex flex-col gap-1">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 text-sm font-bold leading-snug text-brand-strong hover:underline">
                      <span>{s.name}</span>
                      <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <blockquote className="type-small border-l-2 border-line-1 pl-3 text-ink-5">“{s.quote}”</blockquote>
                    <p className="type-small text-ink-5">Checked {s.checked}.</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="type-small text-ink-5">{PER_MILLION_NOTE}</p>
      </section>
    </div>
  )
}

export default AfrCalculator
