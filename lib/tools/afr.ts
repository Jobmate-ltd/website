// ─────────────────────────────────────────────────────────────────────────────
// The accident frequency rate calculator: the arithmetic and the sourced
// conventions. Every source below was checked on the date it carries and the
// quote is verbatim from the page or document at the URL, so the page never
// states a convention it cannot point to. Node's test runner imports this
// file directly, so it stays free of React.
// ─────────────────────────────────────────────────────────────────────────────

import type { FaqEntry, HowToStep } from '../schema.ts'
import { formatNumber } from './index.ts'

export interface AfrSource {
  readonly name: string
  readonly url: string
  /** DD/MM/YYYY, the day the URL and the quote were checked. */
  readonly checked: string
  /** Verbatim from the source. */
  readonly quote: string
}

export interface AfrConvention {
  readonly id: 'per-100k-hours' | 'per-100k-workers'
  readonly name: string
  /** The unit the result is read in, after the number. */
  readonly unit: string
  readonly multiplier: number
  readonly denominator: 'hours' | 'workers'
  /** Who asks for it and what it needs. */
  readonly explain: string
  readonly sources: readonly AfrSource[]
}

const CHECKED = '25/09/2026'

export const AFR_CONVENTIONS: readonly AfrConvention[] = [
  {
    id: 'per-100k-hours',
    name: 'Per 100,000 hours worked',
    unit: 'per 100,000 hours worked',
    multiplier: 100_000,
    denominator: 'hours',
    explain: 'The convention UK pre-qualification questionnaires and construction, highways and rail tenders ask for: RIDDOR-reportable injuries multiplied by 100,000 and divided by the hours worked in the period, usually as a rolling twelve months.',
    sources: [
      {
        name: 'Highways Agency (now National Highways), Performance Specification 2013-14 Technical Note, PS 4.11 Reducing the Accident Frequency Rate (AFR) of the Highways Agency’s Supply Chain',
        url: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/361407/PS_2013-15_-_4.11_Reducing_the_Accident_Frequency_Rate_of_the_Supply_Chain.pdf',
        checked: CHECKED,
        quote: 'AFR = No. of reportable incidents per year x 100,000 / No. of hours worked in the year. AFR is calculated on the basis of incidents reportable under the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 1995 (RIDDOR), and presented as a 12 month rolling average, per 100,000 hours worked.',
      },
      {
        name: 'Office of Rail and Road, Glossary: accident frequency rate',
        url: 'https://www.orr.gov.uk/glossary',
        checked: CHECKED,
        quote: 'The number of Reporting of injuries, diseases and dangerous occurrences regulations 2013 (RIDDOR) incidents per 100,000 hours worked',
      },
    ],
  },
  {
    id: 'per-100k-workers',
    name: 'Per 100,000 workers',
    unit: 'per 100,000 workers',
    multiplier: 100_000,
    denominator: 'workers',
    explain: 'HSE Statistics’ incidence rate: injuries multiplied by 100,000 and divided by the average number of people employed in the period. It needs a headcount, not hours, so it is not the same measure as the rate above and the two cannot be compared with each other.',
    sources: [
      {
        name: 'HSE, Measures of workplace injury: definitions and formulae',
        url: 'https://www.hse.gov.uk/statistics/lfs/injury.htm',
        checked: CHECKED,
        quote: 'Incidence rate of over-3-day absence injury per 100 000 workers = The estimated number of people with an over-3-day absence injury … / Estimated average number in employment in the 12 month reference period … x 100 000',
      },
      {
        name: 'Build UK, Accident Survey Report 2023/2024 (February 2025)',
        url: 'https://builduk.org/wp-content/uploads/2025/06/Accident-Survey-Report-2023-24.pdf',
        checked: CHECKED,
        quote: 'Accident Incidence Rates per 100,000 workers',
      },
    ],
  },
] as const

/** The hours-based convention: the one the calculator computes. */
export const AFR_HOURS = AFR_CONVENTIONS[0]

/** Said once on the page; the rate is not computed because no UK regulator or industry body defines it. */
export const PER_MILLION_NOTE = 'Some corporate reports quote a rate per million hours. The calculator does not show it because no UK regulator or industry body defines it.'

/**
 * (injuries × multiplier) ÷ hours. Null when the hours are zero or negative,
 * the injuries are negative, or either is not a finite number.
 */
export function afr(injuries: number, hours: number, multiplier: number): number | null {
  if (!Number.isFinite(injuries) || !Number.isFinite(hours) || !Number.isFinite(multiplier)) return null
  if (hours <= 0 || injuries < 0 || multiplier <= 0) return null
  return (injuries * multiplier) / hours
}

/** The rate to two decimal places, as the page shows it. */
export function formatRate(value: number): string {
  return formatNumber(value, 2)
}

/** The working, e.g. "(4 × 100,000) ÷ 812,000 = 0.49". Null when afr() is. */
export function afrWorking(injuries: number, hours: number, multiplier: number): string | null {
  const value = afr(injuries, hours, multiplier)
  if (value === null) return null
  return `(${formatNumber(injuries)} × ${formatNumber(multiplier)}) ÷ ${formatNumber(hours)} = ${formatRate(value)}`
}

// ── Page copy ────────────────────────────────────────────────────────────────

export const AFR_STEPS: readonly HowToStep[] = [
  { name: 'Count the reportable injuries', text: 'Use the RIDDOR-reportable injuries in the period: specified injuries, over-7-day incapacitations and, if the tender asks for them, injuries to non-workers taken to hospital. Leave out near misses and record-only cases unless the questionnaire says otherwise.' },
  { name: 'Total the hours worked', text: 'Add up every hour worked by employees and, where the question asks, by contractors and agency staff, for the same period. Payroll or timesheet totals are the usual source.' },
  { name: 'Multiply and divide', text: 'Multiply the injuries by 100,000, then divide by the hours. The result is the accident frequency rate per 100,000 hours worked, shown here with the working.' },
  { name: 'State the period', text: 'Quote the rate with the period it covers, usually a calendar year or a rolling twelve months, and use the same period for the injuries and the hours.' },
] as const

export const AFR_FAQS: readonly FaqEntry[] = [
  {
    q: 'What counts as an injury for the accident frequency rate?',
    a: 'RIDDOR-reportable injuries: the specified injuries in Regulation 4, over-7-day incapacitations and, where the questionnaire asks for them, injuries to non-workers taken from the scene to hospital. Deaths are usually listed separately. Near misses, first-aid cases and over-3-day record-only absences are left out unless the client asks for a wider measure, so read the question and say which injuries you counted.',
  },
  {
    q: 'What hours should I include?',
    a: 'The hours actually worked by everyone the question covers, for the same period as the injuries. Most tenders ask for direct employees; some ask you to add contractors and agency staff, and a few want them as separate rates. Use payroll or timesheet totals rather than an estimate from headcount, and keep the source in case the figure is challenged.',
  },
  {
    q: 'Why do rates differ between sources?',
    a: 'Because the denominators differ. The tender convention divides by hours worked and multiplies by 100,000; HSE Statistics divide by the number of people employed and multiply by 100,000, which gives a rate per 100,000 workers; some corporate reports multiply by a million hours instead. A rate is only comparable with another rate built the same way, so quote the convention and the period beside the number.',
  },
  {
    q: 'What is a good accident frequency rate?',
    a: 'It depends on the sector, the hours and the size of the workforce, so there is no single figure to aim for. HSE publishes injury rates per 100,000 workers by industry each year, which is the nearest thing to a public benchmark, but it is a different measure from the rate per 100,000 hours that tenders ask for. The useful comparison is your own rate over time, with the same convention and the same period.',
  },
  {
    q: 'Does jobsafe calculate the accident frequency rate?',
    a: 'No. jobsafe keeps the incident record the numerator comes from, including which injuries were RIDDOR-reportable and when, and exports the register as CSV. The hours worked live in your payroll or timesheets, so the rate is calculated outside the product, which is what this calculator is for.',
  },
] as const
