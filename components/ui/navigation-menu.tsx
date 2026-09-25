'use client'

import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * NavigationMenu — the Radix navigation menu, restyled to the tokens.
 *
 * Restyled from 21st.dev's "Rich Navigation Menu" (shadcnui-blocks
 * navigation-menu-06): white panels, line-1 hairlines, ink text, 4px radii,
 * quiet shadow. <Header/> renders today's single-column Industries dropdown
 * through it; Phase 2 feeds it the multi-column mega-menu from the same
 * NavConfig without touching this file.
 *
 * @example
 *   <NavigationMenu><NavigationMenuList>…</NavigationMenuList></NavigationMenu>
 */
export const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

export const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center gap-0.5', className)}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

export const NavigationMenuItem = NavigationMenuPrimitive.Item

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-control px-3 text-sm font-semibold text-ink-3 transition-colors duration-200 hover:bg-line-3 hover:text-ink-1 focus:outline-none data-[active]:text-ink-1 data-[state=open]:bg-line-3 data-[state=open]:text-ink-1',
)

export const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger ref={ref} className={cn(navigationMenuTriggerStyle(), 'gap-1', className)} {...props}>
    {children}
    <ChevronDown
      className="relative top-px size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
      strokeWidth={2.5}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

export const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn('left-0 top-0 w-full data-[motion^=from-]:animate-fade-in md:absolute md:w-auto', className)}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

export const NavigationMenuLink = NavigationMenuPrimitive.Link

export const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-control border border-line-1 bg-canvas shadow-hover data-[state=open]:animate-menu-in md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

/** A link inside a panel: label plus an optional one-line description. */
export const NavigationMenuListItem = React.forwardRef<
  React.ComponentRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string; icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          'block select-none rounded-control p-3 leading-none no-underline outline-none transition-colors duration-200 hover:bg-line-3 focus:bg-line-3',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2 text-sm font-bold leading-none text-ink-1">
          {icon ? <span className="text-brand [&>svg]:size-4">{icon}</span> : null}
          {title}
        </div>
        {children ? <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink-5">{children}</p> : null}
      </a>
    </NavigationMenuLink>
  </li>
))
NavigationMenuListItem.displayName = 'NavigationMenuListItem'
