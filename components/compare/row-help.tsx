'use client'

import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * RowHelp: the info button beside a comparison row's topic. A Radix Tooltip
 * on a real <button>, so it opens on hover and on keyboard focus and closes
 * on Escape. The comparison table wraps every RowHelp in one
 * <TooltipProvider>, so this component renders only the trigger and content.
 *
 * @example
 *   <RowHelp topic="UK data hosting" help="Where the records are stored." />
 */
export function RowHelp({ topic, help }: { topic: string; help: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`What ${topic} means`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-control text-ink-5 transition-colors duration-200 hover:bg-line-3 hover:text-ink-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Info className="size-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{help}</TooltipContent>
    </Tooltip>
  )
}

export default RowHelp
