'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Sheet — a Radix dialog that slides in from an edge. Used for the mobile
 * navigation. Light: canvas surface, line-1 hairline, ink overlay at 20%.
 *
 * @example
 *   <Sheet open={open} onOpenChange={setOpen}><SheetContent side="top">…</SheetContent></Sheet>
 */
export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetPortal = SheetPrimitive.Portal

export const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn('fixed inset-0 z-50 bg-ink-1/20 data-[state=open]:animate-fade-in', className)}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SIDES = {
  top: 'inset-x-0 top-0 border-b data-[state=open]:animate-sheet-down data-[state=closed]:animate-sheet-up',
  bottom: 'inset-x-0 bottom-0 border-t data-[state=open]:animate-rise-in',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:animate-fade-in',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:animate-fade-in',
} as const

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: keyof typeof SIDES
  /** Suppress the built-in corner close button when the sheet supplies its own. */
  hideClose?: boolean
}

export const SheetContent = React.forwardRef<React.ComponentRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = 'right', className, children, hideClose = false, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn('fixed z-50 border-line-1 bg-canvas p-6 shadow-frame', SIDES[side], className)}
        {...props}
      >
        {children}
        {!hideClose && (
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-control p-2 text-ink-3 transition-colors hover:bg-line-3 hover:text-ink-1">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
)
SheetContent.displayName = SheetPrimitive.Content.displayName

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('type-h3 text-ink-1', className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

export const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('type-small text-ink-5', className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName
