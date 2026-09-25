'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react'
import { NextStep, NextStepProvider, useNextStep, type CardComponentProps, type Tour } from 'nextstepjs'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { ProductShot } from '@/components/platform/product-shot'
import { PRODUCT_IMAGES } from '@/lib/product-images'

/**
 * ProductTour — "Take the tour" on /platform: a five-step spotlight tour
 * over real screenshots, built with NextStep.js (https://nextstepjs.com,
 * MIT). Each step spotlights a marked region of the screen it is about; the
 * card is restyled to the tokens and fully keyboard-operable (Enter/Space on
 * the buttons, Escape to leave). Analytics: tour_started, tour_completed.
 *
 * The screens are in the page before the tour starts, so the section is
 * meaningful without it: a gallery of the five screens with captions.
 */
const TOUR = 'platform'

interface TourStop {
  readonly id: string
  readonly screenshot: keyof typeof PRODUCT_IMAGES
  readonly title: string
  readonly content: string
  /** Where the spotlight sits over the screenshot, as percentages. */
  readonly spot: { left: number; top: number; width: number; height: number }
  readonly side: 'top' | 'bottom' | 'left' | 'right'
}

const STOPS: readonly TourStop[] = [
  {
    id: 'dashboard',
    screenshot: 'dashboard-hero-desktop',
    title: 'Start on the dashboard',
    content: 'Open high-severity reports, overdue actions, this week’s incidents and the live feed, for every site or one. RIDDOR due dates sit here too.',
    spot: { left: 13, top: 8, width: 86, height: 16 },
    side: 'bottom',
  },
  {
    id: 'report',
    screenshot: 'report-detail-desktop',
    title: 'Open a report',
    content: 'Evidence gallery, the people, the vehicle by its number plate, and the four-level ICAM root cause, on the record itself.',
    spot: { left: 14, top: 12, width: 84, height: 60 },
    side: 'bottom',
  },
  {
    id: 'riddor',
    screenshot: 'riddor-verdict-desktop',
    title: 'Watch the RIDDOR verdict',
    content: 'The panel says reportable or not and works out the deadline from the incident date while you answer.',
    spot: { left: 60, top: 12, width: 38, height: 60 },
    side: 'left',
  },
  {
    id: 'permit',
    screenshot: 'permits-gate-desktop',
    title: 'See a permit blocked',
    content: 'Five checks before Approved: contractor not suspended, insurance, RAMS and accreditation in date, an audit within 12 months, a live risk assessment, every control confirmed.',
    spot: { left: 14, top: 14, width: 84, height: 50 },
    side: 'bottom',
  },
  {
    id: 'bowtie',
    screenshot: 'risk-bowtie-desktop',
    title: 'Finish on a bowtie',
    content: 'Threats, consequences and the barriers between them, each rated Effective, Degraded, Failed or Missing, with a barrier audit that flags a single-barrier leg.',
    spot: { left: 14, top: 14, width: 84, height: 70 },
    side: 'top',
  },
]

const TOURS: Tour[] = [
  {
    tour: TOUR,
    steps: STOPS.map((stop) => ({
      title: stop.title,
      content: stop.content,
      selector: `#tour-spot-${stop.id}`,
      side: stop.side,
      pointerPadding: 8,
      pointerRadius: 8,
      scrollOffset: 96,
    })),
  },
]

function TourCard({ step, currentStep, totalSteps, nextStep, prevStep, skipTour, arrow }: CardComponentProps) {
  const last = currentStep === totalSteps - 1
  return (
    <div className="relative w-[min(22rem,calc(100vw-2rem))] rounded-control border border-line-1 bg-canvas p-5 text-ink-2 shadow-frame" role="dialog" aria-labelledby="tour-title" aria-live="polite">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="type-eyebrow text-brand-strong">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <button type="button" onClick={skipTour} className="flex size-9 items-center justify-center rounded-control text-ink-4 hover:bg-line-3 hover:text-ink-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label="Leave the tour">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <h3 id="tour-title" className="text-lg font-bold leading-snug text-ink-1">
        {step.title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-ink-4">{step.content}</div>
      <div className="mt-5 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={prevStep} disabled={currentStep === 0}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button variant={last ? 'primary' : 'dark'} size="sm" onClick={nextStep}>
          {last ? 'Finish' : 'Next'}
          {!last ? <ArrowRight aria-hidden="true" /> : null}
        </Button>
      </div>
      {arrow}
    </div>
  )
}

function StartButton() {
  const { startNextStep, isNextStepVisible } = useNextStep()
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={() => {
        track('tour_started', { tour: TOUR })
        startNextStep(TOUR)
      }}
      disabled={isNextStepVisible}
      aria-describedby="tour-lead"
    >
      <Play aria-hidden="true" />
      Take the 2-minute tour
    </Button>
  )
}

function Gallery() {
  return (
    <ol className="mt-10 grid gap-8">
      {STOPS.map((stop, i) => (
        <li key={stop.id} className={cn('grid items-start gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10')}>
          <div className="flex flex-col gap-2 lg:sticky lg:top-28">
            <span className="type-mono text-xs font-medium text-brand-strong" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="type-h3 text-ink-1">{stop.title}</h3>
            <p className="type-small text-ink-4">{stop.content}</p>
          </div>
          <div className="relative">
            <ProductShot id={stop.screenshot} frame />
            <div
              id={`tour-spot-${stop.id}`}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-control"
              style={{ left: `${stop.spot.left}%`, top: `${stop.spot.top}%`, width: `${stop.spot.width}%`, height: `${stop.spot.height}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function ProductTour() {
  return (
    <NextStepProvider>
      <NextStep
        steps={TOURS}
        cardComponent={TourCard}
        shadowRgb="10, 10, 10"
        shadowOpacity="0.55"
        onComplete={() => track('tour_completed', { tour: TOUR })}
        disableConsoleLogs
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p id="tour-lead" className="type-lead text-ink-4">
            Five real screens from a UK haulier’s setup, with the bit that matters lit up on each.
          </p>
          <StartButton />
        </div>
        <Gallery />
      </NextStep>
    </NextStepProvider>
  )
}

export default ProductTour
