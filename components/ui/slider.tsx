'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

/**
 * Slider — shadcn/ui `slider` (https://ui.shadcn.com/docs/components/slider,
 * MIT) restyled: line-2 track, brand-strong range, a canvas thumb with a
 * brand-strong ring and a 44px hit area. Arrow keys step, Page Up/Down jump,
 * Home/End go to the ends. Always pass `aria-label` or wrap in a label.
 *
 * @example
 *   <Slider min={0} max={200} step={5} value={[reports]} onValueChange={([v]) => setReports(v)} aria-label="Reports per month" />
 */
export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { thumbLabel?: string }
>(({ className, thumbLabel, ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className={cn('relative flex min-h-11 w-full touch-none select-none items-center', className)} {...props}>
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-pill bg-line-2">
      <SliderPrimitive.Range className="absolute h-full bg-brand-strong" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={thumbLabel}
      className={cn(
        'relative block size-5 rounded-pill border-2 border-brand-strong bg-canvas shadow-rest transition-[box-shadow,transform] duration-200 ease-out-expo',
        'before:absolute before:-inset-3 before:content-[""]',
        'hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName
