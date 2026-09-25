'use client'

import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * ToggleGroup — shadcn/ui `toggle-group` (https://ui.shadcn.com/docs/components/toggle-group,
 * MIT) with the `toggle` variants folded in and restyled: a segmented control
 * in a line-3 well, canvas pill for the pressed item, ink text, 44px targets.
 * Arrow keys move, Space/Enter press. Use `type="single"` for a radio-like
 * choice (team size, monthly/annual).
 *
 * @example
 *   <ToggleGroup type="single" value={band} onValueChange={(v) => v && setBand(v)} aria-label="Team size">
 *     <ToggleGroupItem value="1-25">1–25</ToggleGroupItem>…
 *   </ToggleGroup>
 */
export const toggleVariants = cva(
  [
    'inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-control px-3.5 text-sm font-bold text-ink-4',
    'transition-[background-color,color,box-shadow] duration-200 ease-out-expo hover:text-ink-1',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-line-3',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-canvas data-[state=on]:text-ink-1 data-[state=on]:shadow-rest',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 px-3 text-[13px]',
        md: 'min-h-9 px-3.5',
        lg: 'min-h-11 px-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({ size: 'md' })

export const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('inline-flex min-h-11 items-center justify-center gap-1 rounded-control border border-line-1 bg-line-3 p-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

export const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleVariants({ size: context.size ?? size }), className)} {...props}>
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
