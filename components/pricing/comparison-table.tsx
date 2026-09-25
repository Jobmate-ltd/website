'use client'

import { Check, Info, Minus } from 'lucide-react'
import { PRICE_BOOK } from '@/lib/brand'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Chip } from '@/components/ui/chip'

/**
 * ComparisonTable — every module and capability per tier, with a tooltip per
 * row saying what it means (shadcn/ui Table + Tooltip; 21st.dev comparison-3
 * as the visual reference). The rows are the product facts; the tier
 * membership follows PRICE_BOOK's included lists.
 */
interface Row {
  readonly name: string
  readonly tip: string
  readonly essentials: boolean | 'expanding'
  readonly professional: boolean | 'expanding'
  readonly enterprise: boolean | 'expanding'
  readonly group: string
}

const ROWS: readonly Row[] = [
  { group: 'Record', name: 'Incident and near-miss reporting', tip: 'Seven-step report from any phone: details, site and GPS, people, vehicle, evidence, RIDDOR triage, review.', essentials: true, professional: true, enterprise: true },
  { group: 'Record', name: 'RIDDOR triage and register', tip: 'Live verdict against Reg 4, over-7-day and Schedule 2; deadlines from the incident date; F2508 register.', essentials: true, professional: true, enterprise: true },
  { group: 'Record', name: 'Checklists and inspections', tip: 'Walkarounds and inspections whose failures raise actions. Expanding: part of the module ships today.', essentials: false, professional: 'expanding', enterprise: 'expanding' },
  { group: 'Record', name: 'Fleet and plant', tip: 'MOT, tax, insurance, service and LOLER dates on every vehicle and machine.', essentials: false, professional: true, enterprise: true },
  { group: 'Resolve', name: 'Investigations (ICAM)', tip: 'Four-level ICAM root cause on the report itself.', essentials: true, professional: true, enterprise: true },
  { group: 'Resolve', name: 'Corrective actions', tip: 'Owners, due dates and a board; raised from reports, hazards, checklists and permits.', essentials: true, professional: true, enterprise: true },
  { group: 'Resolve', name: 'Permits to work', tip: 'Six permit types gated on contractor competence and a live risk assessment.', essentials: false, professional: true, enterprise: true },
  { group: 'Resolve', name: 'Contractors', tip: 'Insurance, RAMS, accreditation and audit dates checked at the permit gate. Expanding: contractor records cannot yet be created in-app.', essentials: false, professional: 'expanding', enterprise: 'expanding' },
  { group: 'Prevent', name: 'Risk assessments and bowtie', tip: '5×5 scoring, hierarchy of control, six types, MHSWR reg 3 check, bowtie barriers.', essentials: false, professional: true, enterprise: true },
  { group: 'Prevent', name: 'Training and competence', tip: 'The competency matrix: who is in date for what.', essentials: false, professional: true, enterprise: true },
  { group: 'Prevent', name: 'Document control', tip: 'Policies and procedures with the current version in front of the people who need it.', essentials: false, professional: true, enterprise: true },
  { group: 'Prevent', name: 'Dashboards', tip: 'Open incidents by site, RIDDOR due, overdue actions.', essentials: true, professional: true, enterprise: true },
  { group: 'Platform', name: 'SOS', tip: 'The SOS control in the app shell.', essentials: true, professional: true, enterprise: true },
  { group: 'Platform', name: 'Sites and people', tip: 'Your sites and depots, your people, six role levels.', essentials: true, professional: true, enterprise: true },
  { group: 'Platform', name: 'Offline in every module', tip: 'Saves to the phone first; “Pending sync” on each record.', essentials: true, professional: true, enterprise: true },
  { group: 'Platform', name: 'CSV export from every register', tip: 'Nothing is locked in.', essentials: true, professional: true, enterprise: true },
  { group: 'Platform', name: 'Hosted in London', tip: 'UK region, each organisation walled off, private file storage.', essentials: true, professional: true, enterprise: true },
  { group: 'Service', name: 'Onboarding', tip: 'Set-up and training with the team, included on Enterprise.', essentials: false, professional: false, enterprise: true },
  { group: 'Service', name: 'Invoicing and BACS', tip: 'Pay on invoice rather than by card in the portal.', essentials: false, professional: false, enterprise: true },
  { group: 'Service', name: 'SLAs', tip: 'Agreed response and availability targets.', essentials: false, professional: false, enterprise: true },
]

function Cell({ value }: { value: boolean | 'expanding' }) {
  if (value === 'expanding') return <Chip status="info">Expanding</Chip>
  return value ? (
    <span className="inline-flex items-center gap-1.5 text-good-text">
      <Check className="size-4" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="inline-flex items-center text-grey-400">
      <Minus className="size-4" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </span>
  )
}

export function ComparisonTable() {
  const groups = [...new Set(ROWS.map((r) => r.group))]
  return (
    <TooltipProvider delayDuration={150}>
      <Table label="What each tier includes">
        <TableCaption>Every module and capability by tier. SSO and API are not listed: they are offered only once built.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Capability</TableHead>
            <TableHead>{PRICE_BOOK.essentials.name}</TableHead>
            <TableHead>{PRICE_BOOK.professional.name}</TableHead>
            <TableHead>{PRICE_BOOK.enterprise.name}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <>
              <TableRow key={`g-${group}`} className="bg-bg hover:bg-bg">
                <TableCell colSpan={4} className="py-2 text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink-4">
                  {group}
                </TableCell>
              </TableRow>
              {ROWS.filter((r) => r.group === group).map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-semibold text-ink-1">
                    <span className="inline-flex items-center gap-2">
                      {row.name}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="flex size-8 items-center justify-center rounded-control text-ink-5 hover:bg-line-3 hover:text-ink-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label={`What ${row.name} means`}>
                            <Info className="size-4" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{row.tip}</TooltipContent>
                      </Tooltip>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Cell value={row.essentials} />
                  </TableCell>
                  <TableCell>
                    <Cell value={row.professional} />
                  </TableCell>
                  <TableCell>
                    <Cell value={row.enterprise} />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}

export default ComparisonTable
