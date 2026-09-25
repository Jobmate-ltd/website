import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Breadcrumbs — the visible trail. Pair with `breadcrumbSchema()` from
 * lib/schema.ts, built from the same array, so the JSON-LD matches the DOM.
 *
 * @example
 *   <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }]} />
 */
export interface BreadcrumbItem {
  name: string
  href: string
}

export function Breadcrumbs({ items, className }: { items: readonly BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('type-small', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink-3">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="text-ink-5 transition-colors hover:text-ink-1">
                  {item.name}
                </Link>
              )}
              {!last ? <ChevronRight className="size-3.5 text-grey-400" aria-hidden="true" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
