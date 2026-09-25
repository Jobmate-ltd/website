import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata } from '@/lib/seo'
import { TOOL_PATHS } from '@/lib/seo/links'
import { AFR_FAQS, AFR_STEPS } from '@/lib/tools/afr'
import { ToolPage } from '@/components/tools/tool-page'
import { AfrCalculator } from '@/components/tools/afr-calculator'

const PATH = TOOL_PATHS.afr

/** Phase 3 free tool; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on (the shell calls notFound() too). */
export const metadata: Metadata = buildMetadata(PATH)

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  return (
    <ToolPage
      path={PATH}
      lead="Reportable injuries against hours worked, with the formula shown, in the per-100,000-hours convention UK pre-qualification questionnaires and tenders ask for. The other convention is explained beside it, so the number you quote is the one they mean."
      toolTitle="Work out the rate"
      toolLead="Enter the RIDDOR-reportable injuries and the hours worked for the same period."
      tool={<AfrCalculator />}
      explainer={{ title: 'Four steps to a rate you can defend', lead: 'A tender panel will ask how the number was built. This is the answer.', steps: AFR_STEPS }}
      howTo={{ name: 'Calculate an accident frequency rate', description: 'Count the reportable injuries, total the hours worked, multiply by 100,000 and divide, then state the period.' }}
      faqs={AFR_FAQS}
      faqLead="Straight answers on what to count, what hours to use and what the number means."
      builtFrom="The numerator is the RIDDOR-reportable injuries jobsafe records on every incident; the hours come from your payroll. The rate itself is calculated here, not in the product."
      cta={{ title: 'jobsafe keeps the incident record your AFR is built from.', copy: 'Every incident with its RIDDOR verdict, the register exported as CSV, and the dashboard that shows what is open by site.' }}
    />
  )
}
