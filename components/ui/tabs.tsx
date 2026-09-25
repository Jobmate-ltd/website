'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/**
 * Tabs — shadcn/ui `tabs` (https://ui.shadcn.com/docs/components/tabs, MIT)
 * restyled to the tokens: a line-3 well, canvas pill for the active tab, ink
 * text, 4px radii, a brand focus ring. Keyboard: arrows move between tabs,
 * Home/End jump, the panel is reachable with Tab.
 *
 * @example
 *   <Tabs defaultValue="record">
 *     <TabsList><TabsTrigger value="record">Record</TabsTrigger>…</TabsList>
 *     <TabsContent value="record">…</TabsContent>
 *   </Tabs>
 */
export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex min-h-11 items-center justify-center gap-1 rounded-control border border-line-1 bg-line-3 p-1 text-ink-4', className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-control px-3.5 text-sm font-bold text-ink-4 transition-[background-color,color,box-shadow] duration-200 ease-out-expo',
      'hover:text-ink-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-line-3',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-canvas data-[state=active]:text-ink-1 data-[state=active]:shadow-rest',
      '[&_svg]:size-4 [&_svg]:shrink-0',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-6 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName
