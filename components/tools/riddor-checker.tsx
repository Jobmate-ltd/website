'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'
import { HSE_CONTACT, riddorDeadline, type TriageAnswers, type TriageResult } from '@/lib/product-logic/riddor-knowledge'
import { parseCalendar, todayLocal } from '@/lib/product-logic/date'
import { MODULE_PATHS } from '@/lib/seo/links'
import { formatUkDate } from '@/lib/tools'
import { answered, decided, decodeAnswers, encodeAnswers, maxTotal, resultFor, setAnswer, stepsFor, verdictTone, type AnswerKey, type Question } from '@/lib/tools/riddor-checker'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'

/**
 * RiddorChecker — one question at a time, the product's own `triage()` for
 * the verdict. The answers live in the query string (`?workRelated=yes&…`)
 * through `router.replace`, so a verdict can be shared and reloading the
 * page brings it back; nothing is stored anywhere else. Keyboard: native
 * radios, checkboxes, selects and inputs; Back and Next move focus to the
 * next question's heading; two polite live regions announce the question
 * and the verdict.
 *
 * @example
 *   <Suspense fallback={<RiddorCheckerFallback />}><RiddorChecker /></Suspense>
 */
const NONE = '__none__'
const fieldClass = 'min-h-11 w-full rounded-control border border-line-1 bg-canvas px-3 text-sm text-ink-1 focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'
const optionClass =
  'flex min-h-11 cursor-pointer items-start gap-3 rounded-control border border-line-1 bg-canvas p-3 transition-[border-color,background-color] duration-200 ease-out-expo hover:border-grey-400 has-checked:border-brand has-checked:bg-brand-tint-04 has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-2'
const headingClass = 'type-h3 rounded-control text-ink-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
const HEADING_ID = 'riddor-question'

interface CheckerState {
  readonly answers: TriageAnswers
  readonly date: string
}

const optionId = (q: Question, value: string) => `riddor-${q.key}-${value}`
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

function whatToDo(result: TriageResult): string {
  const def = result.def
  if (result.category === 'NotReportable') return 'No report to HSE. Record it internally and investigate as normal.'
  if (def.recordOnly) return `Record it in the accident book. ${def.notify}.`
  const form = def.form ? ` Form ${HSE_CONTACT.forms[def.form]}.` : ''
  const report = def.phone ? `Phone the HSE Incident Contact Centre without delay, then send the form within ${def.formDays} days.` : `Report it to HSE ${lowerFirst(def.notify)}.`
  return `${report}${form}`
}

function deadlineSentence(result: TriageResult, date: string, today: string): string {
  const d = riddorDeadline(result.category, date, today)
  if (d.deadlineAt === null || d.daysLeft === null) return 'No form to send to HSE.'
  const lead = result.provisional ? 'If it becomes reportable, the form must reach HSE by' : 'The form must reach HSE by'
  const when = formatUkDate(d.deadlineAt)
  if (d.overdue) return `${lead} ${when}, which was ${-d.daysLeft} day${d.daysLeft === -1 ? '' : 's'} ago.`
  if (d.daysLeft === 0) return `${lead} ${when}, which is today.`
  return `${lead} ${when}, in ${d.daysLeft} day${d.daysLeft === 1 ? '' : 's'}.`
}

function QuestionFields({ q, answers, onAnswer, headingRef }: { q: Question; answers: TriageAnswers; onAnswer: (key: AnswerKey, value: TriageAnswers[AnswerKey]) => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const current = answers[q.key]
  const helpId = q.help ? `riddor-help-${q.key}` : undefined
  const heading = (
    <h3 id={HEADING_ID} ref={headingRef} tabIndex={-1} className={headingClass}>
      {q.title}
    </h3>
  )
  const help = q.help ? (
    <p id={helpId} className="type-small text-ink-4">
      {q.help}
    </p>
  ) : null

  if (q.kind === 'radio' || q.kind === 'multi') {
    const list = Array.isArray(current) ? current : []
    return (
      <fieldset className="flex flex-col gap-4" aria-describedby={helpId}>
        <legend className="mb-2">{heading}</legend>
        {help}
        <div className="flex flex-col gap-2">
          {q.options.map((o) => {
            const id = optionId(q, o.value)
            const checked = q.kind === 'multi' ? list.includes(o.value) : current === o.value
            return (
              <label key={o.value} htmlFor={id} className={optionClass}>
                <input
                  id={id}
                  type={q.kind === 'multi' ? 'checkbox' : 'radio'}
                  name={`riddor-${q.key}`}
                  value={o.value}
                  checked={checked}
                  onChange={() => {
                    if (q.kind === 'multi') onAnswer(q.key, checked ? list.filter((v) => v !== o.value) : [...list, o.value])
                    else onAnswer(q.key, o.value)
                  }}
                  className="mt-0.5 size-4 shrink-0 accent-brand-strong"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold leading-snug text-ink-1">{o.label}</span>
                  {o.help ? <span className="type-small text-ink-5">{o.help}</span> : null}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  if (q.kind === 'select') {
    const value = current === undefined ? '' : current === '' ? NONE : String(current)
    const chosen = q.options.find((o) => o.value === String(current))
    return (
      <div className="flex flex-col gap-4">
        {heading}
        {help}
        <select id={`riddor-${q.key}`} value={value} aria-labelledby={HEADING_ID} aria-describedby={helpId} onChange={(e) => onAnswer(q.key, e.target.value === NONE ? '' : e.target.value)} className={fieldClass}>
          <option value="">Choose one</option>
          {q.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          {q.noneLabel ? <option value={NONE}>{q.noneLabel}</option> : null}
        </select>
        {chosen?.help ? <p className="type-small text-ink-5">{chosen.help}</p> : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {heading}
      {help}
      <div className="flex items-center gap-3">
        <input
          id={`riddor-${q.key}`}
          type="number"
          inputMode="numeric"
          min={q.min}
          max={q.max}
          step={1}
          value={current === undefined || current === null ? '' : String(current)}
          aria-labelledby={HEADING_ID}
          aria-describedby={helpId}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') onAnswer(q.key, undefined)
            else if (/^\d{1,4}$/.test(v)) onAnswer(q.key, v)
          }}
          className={cn(fieldClass, 'type-mono w-28 text-right')}
        />
        {q.unit ? <span className="text-sm text-ink-4">{q.unit}</span> : null}
      </div>
    </div>
  )
}

function Verdict({ result, date, today }: { result: TriageResult; date: string; today: string }) {
  const def = result.def
  const tel = `tel:${HSE_CONTACT.phone.replace(/\s+/g, '')}`
  return (
    <div id="riddor-verdict" className="flex flex-col gap-4" data-category={result.category}>
      <div className="flex flex-wrap items-center gap-2">
        <Chip status={verdictTone(result.category)}>{def.short}</Chip>
        {result.provisional ? <Chip status="warning">Provisional</Chip> : null}
        <span className="type-mono text-xs text-ink-5">{def.reg}</span>
      </div>
      <h3 className="type-h3 text-ink-1">{def.label}</h3>
      <p className="type-small text-ink-4">{def.test}</p>
      <div className="flex flex-col gap-1.5">
        <p className="type-eyebrow text-ink-4">Why</p>
        <ul className="flex flex-col gap-1.5">
          {result.reasons.map((reason) => (
            <li key={reason} className="type-small text-ink-2">
              {reason}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="type-eyebrow text-ink-4">What to do</p>
        <p className="text-sm font-bold leading-snug text-ink-1">{whatToDo(result)}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="type-eyebrow text-ink-4">Deadline</p>
        <p className="text-sm text-ink-2">{deadlineSentence(result, date, today)}</p>
        {result.provisional ? <p className="type-small text-ink-5">Provisional: it depends on how long the absence runs. Keep watching it and report once it passes seven consecutive days.</p> : null}
      </div>
      {def.recordOnly ? null : (
        <div className="flex flex-col gap-2 rounded-control border border-line-1 bg-canvas p-4">
          <p className="type-eyebrow text-ink-4">Where to report</p>
          <p className="text-sm text-ink-2">
            Online:{' '}
            <a href={HSE_CONTACT.portal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-brand-strong hover:underline">
              HSE’s RIDDOR forms
              <ExternalLink className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p className="text-sm text-ink-2">
            By phone:{' '}
            <a href={tel} className="font-bold text-brand-strong hover:underline">
              {HSE_CONTACT.phone}
            </a>
            , {HSE_CONTACT.phoneHours}.
          </p>
        </div>
      )}
      <p className="type-small text-ink-5">You submit the report to HSE yourself; jobsafe does not send it for you.</p>
    </div>
  )
}

export function RiddorChecker() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = React.useState<CheckerState>(() => {
    const decoded = decodeAnswers(searchParams.toString())
    return { answers: decoded.answers, date: decoded.date ?? todayLocal() }
  })
  const [position, setPosition] = React.useState(() => {
    const steps = stepsFor(state.answers)
    const open = steps.findIndex((q) => !answered(state.answers, q))
    return open === -1 ? steps.length : open
  })
  const [questionNote, setQuestionNote] = React.useState('')
  const headingRef = React.useRef<HTMLHeadingElement | null>(null)
  const focusPending = React.useRef(false)
  const touched = React.useRef(false)

  const { answers, date } = state
  const steps = stepsFor(answers)
  const open = steps.findIndex((q) => !answered(answers, q))
  const limit = open === -1 ? steps.length : open
  const pos = Math.min(position, limit)
  const q = steps[pos]
  const done = decided(answers)
  const result = done ? resultFor(answers) : null
  const total = maxTotal(answers)
  const today = todayLocal()
  const verdictSentence = result ? `Verdict: ${result.def.label}. ${result.reasons[0]} ${deadlineSentence(result, date, today)}` : ''

  // Focus the question heading after Back, Next or Start again.
  React.useEffect(() => {
    if (!focusPending.current) return
    focusPending.current = false
    headingRef.current?.focus()
  })

  const commit = (next: CheckerState) => {
    setState(next)
    const query = encodeAnswers(next.answers, next.date)
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const answer = (key: AnswerKey, value: TriageAnswers[AnswerKey]) => {
    commit({ answers: setAnswer(answers, key, value), date })
    if (!touched.current) {
      touched.current = true
      track('calculator_used', { calculator: 'riddor_checker' })
    }
  }

  const goTo = (nextAnswers: TriageAnswers, target: number) => {
    const nextSteps = stepsFor(nextAnswers)
    const nextOpen = nextSteps.findIndex((step) => !answered(nextAnswers, step))
    const nextLimit = nextOpen === -1 ? nextSteps.length : nextOpen
    const at = Math.max(0, Math.min(target, nextLimit))
    setPosition(at)
    const step = nextSteps[at]
    setQuestionNote(step ? `Question ${at + 1} of ${maxTotal(nextAnswers)}: ${step.title}` : 'All questions answered. The verdict is ready.')
    focusPending.current = true
  }

  const next = () => {
    let nextAnswers = answers
    // A multi-select answered with nothing ticked is still an answer.
    if (q && q.kind === 'multi' && !answered(answers, q)) {
      nextAnswers = setAnswer(answers, q.key, [])
      commit({ answers: nextAnswers, date })
    }
    goTo(nextAnswers, pos + 1)
  }

  const back = () => goTo(answers, pos - 1)

  const reset = () => {
    const fresh = { answers: {}, date: todayLocal() }
    commit(fresh)
    goTo(fresh.answers, 0)
  }

  const canAdvance = q ? q.kind === 'multi' || answered(answers, q) : false
  const complete = pos >= steps.length

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
      <div aria-live="polite" className="sr-only">
        {questionNote}
      </div>
      <div aria-live="polite" id="riddor-verdict-live" className="sr-only">
        {verdictSentence}
      </div>

      {/* The question */}
      <div className="flex flex-col gap-6 rounded-control border border-line-1 bg-canvas p-5 shadow-rest md:p-6">
        <p className="type-eyebrow text-ink-4">{complete ? 'All questions answered' : `Question ${pos + 1} of ${total}`}</p>
        {complete || !q ? (
          <div className="flex flex-col gap-3">
            <h3 id={HEADING_ID} ref={headingRef} tabIndex={-1} className={headingClass}>
              That is everything the checker needs
            </h3>
            <p className="type-small text-ink-4">Read the verdict, set the date it happened if it was not today, and use Back to change any answer.</p>
          </div>
        ) : (
          <QuestionFields q={q} answers={answers} onAnswer={answer} headingRef={headingRef} />
        )}
        <div className="flex flex-wrap items-center gap-3 border-t border-line-1 pt-5">
          <Button id="riddor-back" variant="secondary" size="md" onClick={back} disabled={pos === 0}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
          {complete ? null : (
            <Button id="riddor-next" variant="primary" size="md" onClick={next} disabled={!canAdvance}>
              Next
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
          <Button id="riddor-reset" variant="ghost" size="md" onClick={reset} className="sm:ml-auto">
            <RotateCcw aria-hidden="true" />
            Start again
          </Button>
        </div>
      </div>

      {/* The verdict */}
      <div className="flex flex-col gap-5 rounded-control border border-line-1 bg-bg p-5 md:p-6 lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="riddor-date" className="text-sm font-bold text-ink-1">
            When did it happen?
          </label>
          <input
            id="riddor-date"
            type="date"
            value={date}
            aria-describedby="riddor-date-help"
            onChange={(e) => {
              if (parseCalendar(e.target.value)) commit({ answers, date: e.target.value })
            }}
            className={cn(fieldClass, 'type-mono sm:w-52')}
          />
          <p id="riddor-date-help" className="type-small text-ink-5">
            For a disease, the date of the diagnosis. The deadline counts calendar days from here.
          </p>
        </div>
        {result ? (
          <Verdict result={result} date={date} today={today} />
        ) : (
          <div className="flex flex-col gap-2 rounded-control border border-dashed border-line-1 bg-canvas p-4">
            <p className="text-sm font-bold text-ink-1">The verdict appears here</p>
            <p className="type-small text-ink-4">As soon as the answers decide it: the category, the reasons, what to do, the date the report must reach HSE and where to send it.</p>
          </div>
        )}
        <p className="type-small border-t border-line-1 pt-4 text-ink-5">
          Built from the same triage jobsafe runs on every incident report.{' '}
          <Link href={MODULE_PATHS.riddor} className="font-bold text-brand-strong hover:underline">
            See the RIDDOR module
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

/** Shown while the checker is client-side rendered (it reads the query string). */
export function RiddorCheckerFallback() {
  return (
    <div className="rounded-control border border-line-1 bg-canvas p-6 shadow-rest">
      <p className="type-small text-ink-4">Loading the checker. It needs JavaScript to run.</p>
    </div>
  )
}

export default RiddorChecker
