import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import { buildMetadata } from '@/lib/seo'
import { TOOL_PATHS } from '@/lib/seo/links'
import { RIDDOR_FAQS, RIDDOR_STEPS } from '@/lib/tools/riddor-checker'
import { ToolPage } from '@/components/tools/tool-page'
import { RiddorChecker, RiddorCheckerFallback } from '@/components/tools/riddor-checker'
import { RiddorRecord } from '@/components/tools/riddor-record'

const PATH = TOOL_PATHS.riddor

/** Phase 3 free tool; 404 until NEXT_PUBLIC_PLATFORM_LAUNCH is on (the shell calls notFound() too). */
export const metadata: Metadata = buildMetadata(PATH)

export default function Page() {
  if (!PLATFORM_LAUNCH) notFound()
  return (
    <ToolPage
      path={PATH}
      lead="Answer a handful of questions and the checker runs the RIDDOR 2013 triage jobsafe applies to every incident report: the category, the reasons, the date the report must reach HSE and where to send it. Nothing is stored; the answers live in the address bar, so a verdict can be shared."
      toolTitle="Check an incident"
      toolLead="One question at a time. The verdict updates as soon as the answers decide it."
      tool={
        <Suspense fallback={<RiddorCheckerFallback />}>
          <RiddorChecker />
        </Suspense>
      }
      afterTool={<RiddorRecord />}
      explainer={{ title: 'Four steps from incident to verdict', lead: 'The same sequence HSE’s own guidance follows, in the order the checker asks it.', steps: RIDDOR_STEPS }}
      howTo={{ name: 'Check whether an incident is RIDDOR reportable', description: 'Answer the checker’s questions in order, set the date, read the verdict and report or record accordingly.', totalTime: 'PT1M' }}
      faqs={RIDDOR_FAQS}
      faqLead="Straight answers on what is reportable, the deadlines and who submits."
      builtFrom="The questions, the categories, the deadlines and the HSE contact details are the product’s own RIDDOR knowledge file, copied from the app and tested against it case for case."
      cta={{ title: 'Get the verdict on the report itself.', copy: 'In jobsafe the same triage runs while the incident is being typed, and the register keeps what you submitted and the reference HSE gave you.' }}
    />
  )
}
