'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

/**
 * Tooltip — shadcn/ui `tooltip` (https://ui.shadcn.com/docs/components/tooltip,
 * MIT) restyled: ink-1 surface, canvas text, 4px radius, a short fade. Opens
 * on hover and on keyboard focus; the trigger must be focusable.
 *
 * @example
 *   <TooltipProvider><Tooltip><TooltipTrigger asChild><button>…</button></TooltipTrigger><TooltipContent>…</TooltipContent></Tooltip></TooltipProvider>
 */
export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-w-xs rounded-control bg-ink-1 px-3 py-2 text-[13px] leading-snug text-canvas shadow-hover',
        'data-[state=delayed-open]:animate-fade-in data-[state=instant-open]:animate-fade-in',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName
