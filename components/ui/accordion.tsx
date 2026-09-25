'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Accordion — shadcn/ui `accordion` (https://ui.shadcn.com/docs/components/accordion,
 * MIT) restyled: line-1 dividers, ink-1 question, a brand plus that turns
 * into a minus, 44px triggers. Content is `forceMount`ed so every answer is
 * in the server HTML (collapsed to zero height and `invisible` while
 * closed), which is what lets FAQPage schema describe text that is really
 * on the page. Arrow keys move between triggers; Home/End jump.
 *
 * @example
 *   <Accordion type="single" collapsible><AccordionItem value="a"><AccordionTrigger>Q?</AccordionTrigger><AccordionContent>A.</AccordionContent></AccordionItem></Accordion>
 */
export const Accordion = AccordionPrimitive.Root

export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn('border-b border-line-1', className)} {...props} />)
AccordionItem.displayName = 'AccordionItem'

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex min-h-11 flex-1 items-center justify-between gap-4 py-4 text-left text-base font-bold text-ink-1 transition-colors duration-200 ease-out-expo',
        'hover:text-brand-strong focus-visible:outline-none focus-visible:rounded-control focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        '[&[data-state=open]>svg]:rotate-45',
        className,
      )}
      {...props}
    >
      {children}
      <Plus className="size-4 shrink-0 text-brand transition-transform duration-200 ease-out-expo" aria-hidden="true" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    forceMount
    className={cn(
      'overflow-hidden text-[15px] leading-relaxed text-ink-4',
      'data-[state=closed]:invisible data-[state=closed]:h-0 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
    )}
    {...props}
  >
    <div className={cn('measure pb-5 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName
