'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

/**
 * Popover — shadcn/ui `popover` (https://ui.shadcn.com/docs/components/popover,
 * MIT) restyled: canvas panel, line-1 hairline, 4px radius, hover shadow.
 * Focus moves into the panel on open and back to the trigger on close;
 * Escape closes.
 *
 * @example
 *   <Popover><PopoverTrigger asChild><Button variant="secondary">Why?</Button></PopoverTrigger><PopoverContent>…</PopoverContent></Popover>
 */
export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-control border border-line-1 bg-canvas p-4 text-sm text-ink-2 shadow-hover outline-none data-[state=open]:animate-menu-in',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName
