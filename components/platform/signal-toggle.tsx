'use client'

import * as React from 'react'
import { CheckCircle2, CloudOff, RefreshCw, WifiOff, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/ui/chip'

/**
 * SignalToggle — "Offline, proven live". A visitor flips Signal on/off,
 * fills a three-field mini report, submits, sees a card with a "Pending sync"
 * pill, flips signal back on and watches it turn "Synced" with a timestamp.
 *
 * Pure client state. No network request, no connection to the product;
 * styled like the product's sync chip. Keyboard: the switch, the fields and
 * the button are all native controls. `size="large"` is the /platform/offline
 * version.
 *
 * @example
 *   <SignalToggle />
 */
interface Report {
  readonly id: number
  readonly what: string
  readonly where: string
  readonly severity: 'High' | 'Medium' | 'Low'
  readonly created: Date
  readonly synced: Date | null
}

const SEVERITIES = ['High', 'Medium', 'Low'] as const

function time(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function SignalToggle({ size = 'default', className }: { size?: 'default' | 'large'; className?: string }) {
  const [signal, setSignal] = React.useState(true)
  const [what, setWhat] = React.useState('')
  const [where, setWhere] = React.useState('')
  const [severity, setSeverity] = React.useState<Report['severity']>('Medium')
  const [reports, setReports] = React.useState<Report[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [announce, setAnnounce] = React.useState('')
  const tracked = React.useRef(false)
  const nextId = React.useRef(1)

  // Signal back on: everything pending syncs, in order, with a short delay
  // so the change is visible.
  React.useEffect(() => {
    if (!signal) return
    if (!reports.some((r) => r.synced === null)) return
    const timer = window.setTimeout(() => {
      const now = new Date()
      setReports((list) => list.map((r) => (r.synced ? r : { ...r, synced: now })))
      setAnnounce(`Synced at ${time(now)}.`)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [signal, reports])

  const toggle = (on: boolean) => {
    setSignal(on)
    if (!tracked.current) {
      tracked.current = true
      track('signal_toggle_used', { placement: size === 'large' ? 'offline-page' : 'home' })
    }
    setAnnounce(on ? 'Signal on. Pending records will sync.' : 'Signal off. New records will wait on the phone.')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!what.trim() || !where.trim()) {
      setError('Say what happened and where.')
      return
    }
    setError(null)
    const now = new Date()
    const report: Report = { id: nextId.current++, what: what.trim(), where: where.trim(), severity, created: now, synced: signal ? now : null }
    setReports((list) => [report, ...list].slice(0, 4))
    setWhat('')
    setWhere('')
    setAnnounce(signal ? `Report saved and synced at ${time(now)}.` : 'Report saved on the phone. Pending sync.')
  }

  const large = size === 'large'
  const fieldClass = 'min-h-11 w-full rounded-control border border-line-1 bg-canvas px-3 text-sm text-ink-1 placeholder:text-ink-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

  return (
    <div className={cn('grid gap-6 rounded-frame border border-line-1 bg-canvas p-5 shadow-rest md:p-7', large ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]', className)}>
      <div className="flex flex-col gap-5">
        <div className={cn('flex items-center justify-between gap-4 rounded-control border p-3 transition-colors duration-200', signal ? 'border-good-tint bg-good-tint' : 'border-warning-tint bg-warning-tint')}>
          <label htmlFor={`signal-${size}`} className="flex items-center gap-3 text-sm font-bold text-ink-1">
            {signal ? <Wifi className="size-5 text-good-text" aria-hidden="true" /> : <WifiOff className="size-5 text-warning-text" aria-hidden="true" />}
            Signal: {signal ? 'on' : 'off'}
          </label>
          <Switch id={`signal-${size}`} checked={signal} onCheckedChange={toggle} />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3" aria-describedby={`signal-help-${size}`}>
          <p id={`signal-help-${size}`} className="type-small text-ink-5">
            A three-field report. Try it with signal off, then turn signal back on.
          </p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`what-${size}`} className="text-[13px] font-bold text-ink-3">
              What happened
            </label>
            <input id={`what-${size}`} value={what} onChange={(e) => setWhat(e.target.value)} placeholder="Tail lift dropped on the last cage" className={fieldClass} maxLength={120} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`where-${size}`} className="text-[13px] font-bold text-ink-3">
                Where
              </label>
              <input id={`where-${size}`} value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Leeds depot, bay 4" className={fieldClass} maxLength={80} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`severity-${size}`} className="text-[13px] font-bold text-ink-3">
                Severity
              </label>
              <select id={`severity-${size}`} value={severity} onChange={(e) => setSeverity(e.target.value as Report['severity'])} className={cn(fieldClass, 'sm:w-32')}>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error ? (
            <p role="alert" className="text-[13px] font-semibold text-critical-text">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="dark" size="md" className="sm:w-max">
            Save report
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <p className="type-eyebrow text-ink-4">On the phone</p>
        <div aria-live="polite" className="sr-only">
          {announce}
        </div>
        {reports.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-control border border-dashed border-line-1 bg-bg p-6 text-center">
            <CloudOff className="size-6 text-grey-400" aria-hidden="true" />
            <p className="type-small text-ink-5">Nothing saved yet. Flip signal off and file one.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 rounded-control border border-line-1 bg-canvas p-3 shadow-rest">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-1">{r.what}</p>
                    <p className="type-small text-ink-5">
                      {r.where} · {r.severity}
                    </p>
                  </div>
                  <span className="type-mono shrink-0 text-[11px] text-ink-5">26-{String(100 + r.id).padStart(3, '0')}</span>
                </div>
                {r.synced ? (
                  <StatusPill status="good">
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    Synced {time(r.synced)}
                  </StatusPill>
                ) : (
                  <StatusPill status="warning">
                    <RefreshCw className="size-3" aria-hidden="true" />
                    Pending sync
                  </StatusPill>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="type-small text-ink-5">
          The real thing does this in every module. Nothing here leaves your browser.
        </p>
      </div>
    </div>
  )
}

export default SignalToggle
