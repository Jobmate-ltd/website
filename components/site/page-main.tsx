import * as React from 'react'
import { ViewTransition } from 'react'
import { cn } from '@/lib/utils'

/**
 * PageMain — every page's <main>, inside a React <ViewTransition>.
 *
 * On a client navigation the outgoing page's main exits and the incoming
 * one enters, each with the `page` view-transition class (the old lifts away
 * and fades fast, the new rises in a beat later; app/globals.css). The
 * header is outside it and named `site-header`, so it holds still as the
 * anchor. `default="none"` keeps every other transition (a tab switch, a
 * search-param change) from animating the page.
 *
 * On the very first paint, `page-enter` settles the content up into place
 * once; pages mounted later by client navigation skip it (`data-loaded`),
 * since the view transition is already moving them.
 *
 * @example
 *   <Header />
 *   <PageMain>…</PageMain>
 *   <Footer />
 */
export function PageMain({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main className={cn('page-enter flex-1', className)} {...props}>
        {children}
      </main>
    </ViewTransition>
  )
}

export default PageMain
