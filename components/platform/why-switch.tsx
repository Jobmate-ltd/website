import { Check, Minus } from 'lucide-react'
import { WHY_SWITCH } from '@/lib/platform'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

/**
 * WhySwitch — section 9 of the homepage: five rows, jobsafe against "the big
 * suites" (21st.dev comparison-2 as the visual reference). No competitor is
 * named in this section.
 */
export function WhySwitch() {
  return (
    <Section id="why-switch" tone="white">
      <SectionHeading eyebrow="Why teams switch" title="Five things the big suites make you live with" lead="The differences that decide it, once the demo is over and the first invoice arrives." />
      <div className="mt-10 overflow-hidden rounded-control border border-line-1" role="region" aria-label="jobsafe compared with the big suites" tabIndex={0}>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">jobsafe compared with the big international safety suites</caption>
          <thead className="bg-canvas-muted">
            <tr className="border-b border-line-1">
              <th scope="col" className="w-[26%] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink-4">
                What matters
              </th>
              <th scope="col" className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-brand-strong">
                jobsafe
              </th>
              <th scope="col" className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink-4">
                The big suites
              </th>
            </tr>
          </thead>
          <tbody>
            {WHY_SWITCH.map((row) => (
              <tr key={row.topic} className="border-b border-line-2 last:border-0">
                <th scope="row" className="px-4 py-4 text-left align-top text-[15px] font-bold text-ink-1">
                  {row.topic}
                </th>
                <td className="px-4 py-4 align-top text-ink-2">
                  <span className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-good-text" aria-hidden="true" />
                    {row.jobsafe}
                  </span>
                </td>
                <td className="px-4 py-4 align-top text-ink-5">
                  <span className="flex items-start gap-2">
                    <Minus className="mt-0.5 size-4 shrink-0 text-grey-400" aria-hidden="true" />
                    {row.suites}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export default WhySwitch
