import { RECORD_REQUIREMENTS } from '@/lib/product-logic/riddor-knowledge'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'

/**
 * RiddorRecord — "What to record": Regulation 12 as the product's knowledge
 * file states it, server-rendered under the checker so the duty is on the
 * page whatever the verdict.
 *
 * @example
 *   <RiddorRecord />
 */
export function RiddorRecord() {
  return (
    <Section id="what-to-record" tone="white" divider>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <SectionHeading eyebrow="What to record" title="Reportable or not, keep the record" lead={RECORD_REQUIREMENTS.duty} />
        <Card className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-ink-1">The record must show</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {RECORD_REQUIREMENTS.fields.map((field) => (
                <li key={field} className="flex items-start gap-2 text-sm text-ink-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-pill bg-brand" aria-hidden="true" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 border-t border-line-1 pt-5">
            <h3 className="text-base font-bold text-ink-1">How long to keep it</h3>
            <p className="type-small text-ink-4">{RECORD_REQUIREMENTS.retention}</p>
          </div>
          <div className="flex flex-col gap-3 border-t border-line-1 pt-5">
            <h3 className="text-base font-bold text-ink-1">The accident book is a separate duty</h3>
            <p className="type-small text-ink-4">{RECORD_REQUIREMENTS.accidentBook}</p>
          </div>
        </Card>
      </div>
    </Section>
  )
}

export default RiddorRecord
