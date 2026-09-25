import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Table — shadcn/ui `table` (https://ui.shadcn.com/docs/components/table, MIT)
 * restyled: canvas-muted head, line-1 hairlines, ink-2 cells, mono numbers
 * where the caller asks for them. The wrapper scrolls sideways on narrow
 * screens and is a focusable region so keyboard users can scroll it.
 *
 * @example
 *   <Table><TableCaption>…</TableCaption><TableHeader><TableRow><TableHead>…</TableHead></TableRow></TableHeader><TableBody>…</TableBody></Table>
 */
export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement> & { label?: string }>(
  ({ className, label, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto rounded-control border border-line-1" tabIndex={0} role="region" aria-label={label}>
      <table ref={ref} className={cn('w-full caption-bottom border-collapse text-sm', className)} {...props} />
    </div>
  ),
)
Table.displayName = 'Table'

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('bg-canvas-muted [&_tr]:border-b [&_tr]:border-line-1', className)} {...props} />,
)
TableHeader.displayName = 'TableHeader'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />,
)
TableBody.displayName = 'TableBody'

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t border-line-1 bg-canvas-muted font-bold [&>tr]:last:border-b-0', className)} {...props} />
  ),
)
TableFooter.displayName = 'TableFooter'

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn('border-b border-line-2 transition-colors duration-200 hover:bg-canvas-muted', className)} {...props} />
  ),
)
TableRow.displayName = 'TableRow'

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn('h-12 px-4 text-left align-middle text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink-4', className)}
      {...props}
    />
  ),
)
TableHead.displayName = 'TableHead'

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn('px-4 py-3 align-middle text-ink-2', className)} {...props} />,
)
TableCell.displayName = 'TableCell'

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn('mt-3 text-left text-[13px] text-ink-5', className)} {...props} />,
)
TableCaption.displayName = 'TableCaption'
