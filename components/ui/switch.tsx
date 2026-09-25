'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/**
 * Switch — shadcn/ui `switch` (https://ui.shadcn.com/docs/components/switch,
 * MIT) restyled: grey-400 track off, brand-strong on, a canvas thumb; 44px
 * hit area through padding. Space toggles; `aria-label` or a `<label for>`
 * is required.
 *
 * @example
 *   <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Bill annually" />
 */
export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      'peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-pill border-2 border-transparent transition-colors duration-200 ease-out-expo',
      'before:absolute before:-inset-2 before:content-[""]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-brand-strong data-[state=unchecked]:bg-grey-400',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block size-6 rounded-pill bg-canvas shadow-rest transition-transform duration-200 ease-out-expo data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName
