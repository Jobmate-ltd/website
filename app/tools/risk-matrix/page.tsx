import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata } from '@/lib/seo'
import { TOOL_PATHS } from '@/lib/seo/links'
import { HSE_RISK_URL, RISK_FAQS, RISK_STEPS } from '@/lib/tools/risk-matrix'
import { ToolPage } from '@/components/tools/tool-page'
import { RiskMatrix } from '@/components/tools/risk-matrix'

const PATH = TOOL_PATHS.matrix

/** Phase 3 free tool; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on (the shell calls notFound() too). */
export const metadata: Metadata = buildMetadata(PATH)

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  return (
    <ToolPage
      path={PATH}
      lead="Score likelihood against severity on the 5×5 matrix jobsafe uses in its risk assessments, read the band and the action it demands, and check which level of the hierarchy of control you are leaning on."
      toolTitle="Score a hazard"
      toolLead="Pick a cell with the mouse or the arrow keys, or choose the two values from the lists. The band is written in every cell, never colour alone."
      tool={<RiskMatrix />}
      explainer={{
        eyebrow: 'Five steps',
        title: 'The HSE’s five steps to risk assessment',
        lead: 'The matrix is step three. The other four are where an assessment is won or lost.',
        steps: RISK_STEPS,
        footnote: (
          <>
            The steps follow{' '}
            <a href={HSE_RISK_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-strong hover:underline">
              HSE’s guide to risk assessment
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </>
        ),
      }}
      howTo={{ name: 'Assess a risk in five steps', description: 'Identify the hazards, decide who might be harmed and how, evaluate the risks and decide on precautions, record the findings and implement them, then review.' }}
      faqs={RISK_FAQS}
      faqLead="Straight answers on the 5×5, the bands and what the law asks for."
      builtFrom="The two scales, the four bands, the scoring and the hierarchy of control are the product’s own risk scoring, copied from the app and tested against it cell by cell."
      cta={{ title: 'Run full assessments with hazards, controls and bowtie in jobsafe.', copy: 'Six assessment types, the same 5×5 on every hazard, controls tied to the hierarchy, and bowtie barriers for the risks that matter most.' }}
    />
  )
}
