'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'
import { LIKELIHOOD_SCALE, SEVERITY_SCALE, type BandDef } from '@/lib/product-logic/risk-scoring'
import type { Hierarchy } from '@/lib/product-logic/enums'
import { MODULE_PATHS } from '@/lib/seo/links'
import { BAND_STATUS, HIERARCHY_LEVELS, cellFor, decodeMatrix, encodeMatrix, likelihoodOf, severityOf, slaLabel, type MatrixSelection } from '@/lib/tools/risk-matrix'
import { Chip } from '@/components/ui/chip'

/**
 * RiskMatrix — the 5×5 grid from the product's scales, bands and scoring.
 * The grid is a `role="grid"` table with a button in every cell: arrow keys
 * move between cells (roving tabindex), Space or Enter selects, and each
 * cell's label reads the full row, column, score and band. Two selects stay
 * in sync with the grid for anyone who prefers a list. The selection lives
 * in the query string (`?l=3&s=4`) through the History API, read with
 * `useSyncExternalStore` so the server renders the empty grid and the
 * browser fills the selection in without a mismatch.
 *
 * @example
 *   <RiskMatrix />
 */
const URL_EVENT = 'jobsafe:tool-url'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener(URL_EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(URL_EVENT, callback)
  }
}
const getSnapshot = () => window.location.search
const getServerSnapshot = () => ''

function writeUrl(query: string) {
  window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}` : window.location.pathname)
  window.dispatchEvent(new Event(URL_EVENT))
}

const TONE: Readonly<Record<BandDef['tone'], string>> = {
  green: 'border-good-tint bg-good-tint text-good-text',
  amber: 'border-warning-tint bg-warning-tint text-warning-text',
  red: 'border-critical-tint bg-critical-tint text-critical-text',
}

const CONTROL_NOTES: Readonly<Record<Hierarchy, string>> = {
  Eliminate: 'The strongest control: removing the hazard takes the risk away for everyone, not just the people who follow the rules.',
  Substitute: 'A strong control: the hazard is still there in a lesser form, so check the replacement has not brought a new one.',
  Engineering: 'Protects everyone exposed without relying on them, but check first whether the hazard could be removed or replaced.',
  Administrative: 'Depends on people doing what the procedure says every time. Look for an engineering control, or a way to remove the hazard, before relying on this.',
  PPE: 'The last resort: it protects only the wearer and only when it is worn correctly. Treat it as the final layer, not the control.',
}

const fieldClass = 'min-h-11 w-full rounded-control border border-line-1 bg-canvas px-3 text-sm text-ink-1 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'
const optionClass =
  'flex min-h-11 cursor-pointer items-start gap-3 rounded-control border border-line-1 bg-canvas p-3 transition-[border-color,background-color] duration-200 ease-out-expo hover:border-grey-400 has-checked:border-brand has-checked:bg-brand-tint-04 has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-2'
const headClass = 'p-1 text-[11px] font-extrabold uppercase leading-tight tracking-[0.08em] text-ink-4'

export function RiskMatrix() {
  const search = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const selection = decodeMatrix(search)
  const [focus, setFocus] = React.useState<{ l: number; s: number } | null>(null)
  const [control, setControl] = React.useState<Hierarchy | null>(null)
  const cells = React.useRef(new Map<string, HTMLButtonElement>())
  const touched = React.useRef(false)

  const cell = selection.l !== null && selection.s !== null ? cellFor(selection.l, selection.s) : null
  const tabStop = focus ?? (selection.l !== null && selection.s !== null ? { l: selection.l, s: selection.s } : { l: 1, s: 1 })

  const commit = (next: MatrixSelection) => {
    writeUrl(encodeMatrix(next))
    if (!touched.current) {
      touched.current = true
      track('calculator_used', { calculator: 'risk_matrix' })
    }
  }

  const select = (l: number, s: number) => {
    setFocus({ l, s })
    commit({ l, s })
  }

  const moveFocus = (l: number, s: number) => {
    setFocus({ l, s })
    cells.current.get(`${l}-${s}`)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, l: number, s: number) => {
    let nl = l
    let ns = s
    switch (event.key) {
      case 'ArrowRight':
        ns = Math.min(5, s + 1)
        break
      case 'ArrowLeft':
        ns = Math.max(1, s - 1)
        break
      case 'ArrowDown':
        nl = Math.min(5, l + 1)
        break
      case 'ArrowUp':
        nl = Math.max(1, l - 1)
        break
      case 'Home':
        ns = 1
        break
      case 'End':
        ns = 5
        break
      case 'PageUp':
        nl = 1
        break
      case 'PageDown':
        nl = 5
        break
      default:
        return
    }
    event.preventDefault()
    moveFocus(nl, ns)
  }

  const level = control ? HIERARCHY_LEVELS.find((h) => h.key === control) : null

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
      <div className="flex flex-col gap-6 rounded-control border border-line-1 bg-canvas p-5 shadow-rest md:p-6">
        <div className="flex flex-col gap-1">
          <p id="matrix-label" className="text-sm font-bold text-ink-1">
            Likelihood down the side, severity across the top
          </p>
          <p id="matrix-help" className="type-small text-ink-5">
            Arrow keys move between cells; Space or Enter selects one. The band name is written in every cell.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table role="grid" aria-labelledby="matrix-label" aria-describedby="matrix-help" className="w-full min-w-[26rem] border-separate border-spacing-1 text-center">
            <thead>
              <tr role="row">
                <th role="columnheader" scope="col" className={cn(headClass, 'text-left')}>
                  <span className="sr-only">Likelihood, then severity</span>
                  <span aria-hidden="true">L / S</span>
                </th>
                {SEVERITY_SCALE.map((s) => (
                  <th key={s.v} role="columnheader" scope="col" className={headClass}>
                    <span className="type-mono block text-sm font-medium text-ink-1">{s.v}</span>
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIKELIHOOD_SCALE.map((l) => (
                <tr key={l.v} role="row">
                  <th role="rowheader" scope="row" className={cn(headClass, 'text-left')}>
                    <span className="type-mono block text-sm font-medium text-ink-1">{l.v}</span>
                    {l.label}
                  </th>
                  {SEVERITY_SCALE.map((s) => {
                    const c = cellFor(l.v, s.v)
                    const selected = cell?.l === l.v && cell?.s === s.v
                    const key = `${l.v}-${s.v}`
                    return (
                      <td key={s.v} role="gridcell" className="p-0">
                        <button
                          type="button"
                          id={`matrix-cell-${key}`}
                          ref={(el) => {
                            if (el) cells.current.set(key, el)
                            else cells.current.delete(key)
                          }}
                          tabIndex={tabStop.l === l.v && tabStop.s === s.v ? 0 : -1}
                          aria-label={c.label}
                          aria-pressed={selected}
                          onClick={() => select(l.v, s.v)}
                          onFocus={() => setFocus({ l: l.v, s: s.v })}
                          onKeyDown={(event) => onKeyDown(event, l.v, s.v)}
                          className={cn(
                            'flex min-h-11 w-full min-w-11 flex-col items-center justify-center gap-0.5 rounded-control border p-1.5 transition-[box-shadow,transform] duration-200 ease-out-expo hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                            TONE[c.band.tone],
                            selected && 'ring-2 ring-brand ring-offset-2',
                          )}
                        >
                          <span className="type-mono text-base font-medium leading-none">{c.score}</span>
                          <span className="text-[11px] font-bold leading-none">{c.band.key}</span>
                          {selected ? <Check className="size-3.5" aria-hidden="true" /> : null}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 border-t border-line-1 pt-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="matrix-likelihood" className="text-sm font-bold text-ink-1">
              Likelihood
            </label>
            <select id="matrix-likelihood" value={selection.l ?? ''} onChange={(e) => commit({ ...selection, l: e.target.value ? Number(e.target.value) : null })} className={fieldClass}>
              <option value="">Choose</option>
              {LIKELIHOOD_SCALE.map((step) => (
                <option key={step.v} value={step.v}>
                  {step.v}: {step.label}
                </option>
              ))}
            </select>
            <p className="type-small text-ink-5">{selection.l !== null ? likelihoodOf(selection.l).desc : 'How likely the harm is.'}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="matrix-severity" className="text-sm font-bold text-ink-1">
              Severity
            </label>
            <select id="matrix-severity" value={selection.s ?? ''} onChange={(e) => commit({ ...selection, s: e.target.value ? Number(e.target.value) : null })} className={fieldClass}>
              <option value="">Choose</option>
              {SEVERITY_SCALE.map((step) => (
                <option key={step.v} value={step.v}>
                  {step.v}: {step.label}
                </option>
              ))}
            </select>
            <p className="type-small text-ink-5">{selection.s !== null ? severityOf(selection.s).desc : 'How bad the harm would be.'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-control border border-line-1 bg-bg p-5 md:p-6 lg:sticky lg:top-28 lg:self-start">
        <div id="matrix-result" aria-live="polite" className="flex flex-col gap-3">
          {cell ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Chip status={BAND_STATUS[cell.band.tone]}>{cell.band.key}</Chip>
                <span className="type-mono text-xs text-ink-5">
                  {cell.l} × {cell.s}
                </span>
              </div>
              <p className="flex items-baseline gap-3">
                <span className="type-mono text-4xl font-medium tracking-tight text-ink-1">{cell.score}</span>
                <span className="text-sm font-bold text-ink-4">
                  Score {cell.score}: {cell.band.key}
                </span>
              </p>
              <p className="text-sm font-bold leading-snug text-ink-1">{cell.band.action}</p>
              <p className="type-small text-ink-4">{slaLabel(cell.band)}</p>
              <dl className="grid gap-3 border-t border-line-1 pt-4 sm:grid-cols-2">
                <div>
                  <dt className="type-eyebrow text-ink-4">
                    Likelihood {cell.l}: {likelihoodOf(cell.l).label}
                  </dt>
                  <dd className="type-small mt-1 text-ink-4">{likelihoodOf(cell.l).desc}</dd>
                </div>
                <div>
                  <dt className="type-eyebrow text-ink-4">
                    Severity {cell.s}: {severityOf(cell.s).label}
                  </dt>
                  <dd className="type-small mt-1 text-ink-4">{severityOf(cell.s).desc}</dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="flex flex-col gap-2 rounded-control border border-dashed border-line-1 bg-canvas p-4">
              <p className="text-sm font-bold text-ink-1">The score appears here</p>
              <p className="type-small text-ink-4">Pick a cell on the matrix, or choose a likelihood and a severity, to see the score, the band and the action it asks for.</p>
            </div>
          )}
        </div>

        <fieldset className="flex flex-col gap-3 border-t border-line-1 pt-5">
          <legend className="mb-3 text-sm font-bold text-ink-1">Which control level are you relying on?</legend>
          <p className="type-small text-ink-4">Start at the top. An earlier level (eliminate, substitute) is preferred; PPE is the last resort.</p>
          <div className="flex flex-col gap-2">
            {HIERARCHY_LEVELS.map((h) => (
              <label key={h.key} htmlFor={`matrix-control-${h.key}`} className={optionClass}>
                <input id={`matrix-control-${h.key}`} type="radio" name="matrix-control" value={h.key} checked={control === h.key} onChange={() => setControl(h.key)} className="mt-0.5 size-4 shrink-0 accent-brand-strong" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold leading-snug text-ink-1">
                    {h.rank}. {h.name}
                  </span>
                  <span className="type-small text-ink-5">{h.desc}</span>
                </span>
              </label>
            ))}
          </div>
          <p aria-live="polite" className="type-small min-h-5 text-ink-4">
            {level ? `Level ${level.rank} of 5, ${level.name.toLowerCase()}. ${CONTROL_NOTES[level.key]}` : ''}
          </p>
        </fieldset>

        <p className="type-small border-t border-line-1 pt-4 text-ink-5">
          Built from the same 5×5 scoring jobsafe runs in every risk assessment.{' '}
          <Link href={MODULE_PATHS.risk} className="font-bold text-brand-strong hover:underline">
            See risk assessments
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default RiskMatrix
