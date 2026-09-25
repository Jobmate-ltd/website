import Link from 'next/link'
import { ArrowRight, Calculator, Gavel, Grid3x3 } from 'lucide-react'
import { TOOL_PATHS } from '@/lib/seo/links'
import { Section } from '@/components/ui/section'
import { SectionHeading } from '@/components/ui/section-heading'

/**
 * FreeTools — section 11 of the homepage (Phase 3): the three free tools,
 * each of which runs a module's own logic in the browser, and the hub. No
 * sign-up, no gate, nothing invented: the RIDDOR checker is `triage()` from
 * the product, the matrix is the product's 5×5 and bands, the AFR calculator
 * shows its working and names its convention.
 */
const TOOLS = [
  {
    href: TOOL_PATHS.riddor,
    icon: <Gavel />,
    title: 'Is it RIDDOR reportable?',
    body: 'One question at a time, the product’s own triage, with the deadline worked out from the date.',
  },
  {
    href: TOOL_PATHS.matrix,
    icon: <Grid3x3 />,
    title: '5×5 risk matrix calculator',
    body: 'Likelihood against severity on the product’s scales, with the band, the action and the hierarchy of control.',
  },
  {
    href: TOOL_PATHS.afr,
    icon: <Calculator />,
    title: 'Accident frequency rate',
    body: 'The figure a PQQ asks for, with the formula shown and the convention it follows named.',
  },
] as const

export function FreeTools() {
  return (
    <Section id="free-tools" tone="white" divider>
      <SectionHeading eyebrow="Free tools" title="The same logic, in the open" lead="Three tools built from the product’s own code, free to use, no sign-up. Useful on their own; better with the record behind them." />
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link href={tool.href} className="group flex h-full flex-col gap-4 rounded-control border border-line-1 bg-canvas p-6 shadow-rest transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-grey-400 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              <span className="flex size-10 items-center justify-center rounded-control bg-brand-tint-08 text-brand [&>svg]:size-5">{tool.icon}</span>
              <span className="flex flex-col gap-2">
                <span className="text-lg font-bold leading-tight text-ink-1 group-hover:text-brand-strong">{tool.title}</span>
                <span className="type-small text-ink-4">{tool.body}</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong">
                Open the tool
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="type-small mt-6 text-ink-5">
        <Link href={TOOL_PATHS.hub} className="font-semibold text-brand-strong hover:underline">
          All free tools
        </Link>
        , and where each one comes from in the product.
      </p>
    </Section>
  )
}

export default FreeTools
