import * as React from 'react'
import { PLATFORM_LAUNCH } from '@/lib/brand'
import type { InsightBlock } from '@/lib/insights'

/**
 * PostBody — renders an insights article's content blocks.
 *
 * A tiny inline-markdown renderer supports **bold** and [label](href).
 * Deliberately minimal: content is authored in lib/insights.ts, not user input.
 */
const INLINE_RE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g

const linkClass = 'font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 transition-colors hover:decoration-brand-strong'

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let i = 0
  let match: RegExpExecArray | null
  INLINE_RE.lastIndex = 0
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-bold text-ink-1">
          {match[1]}
        </strong>,
      )
    } else {
      const href = match[3]
      const isExternal = /^https?:/i.test(href)
      nodes.push(
        <a key={`${keyPrefix}-a${i}`} href={href} className={linkClass} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {match[2]}
          {isExternal ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>,
      )
    }
    lastIndex = INLINE_RE.lastIndex
    i++
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function Block({ block, index }: { block: InsightBlock; index: number }) {
  const key = `b${index}`
  switch (block.type) {
    case 'p':
      return <p className="type-body mb-6 text-ink-2">{renderInline(PLATFORM_LAUNCH && block.launchText ? block.launchText : block.text, key)}</p>
    case 'h2':
      return (
        <h2 id={slugifyHeading(block.text)} className="type-h3 mb-4 mt-12 scroll-mt-28 text-ink-1 md:text-[26px]">
          {block.text}
        </h2>
      )
    case 'h3':
      return <h3 className="mb-3 mt-8 text-lg font-bold text-ink-1">{block.text}</h3>
    case 'ul':
      return (
        <ul className="mb-7 flex flex-col gap-3">
          {block.items.map((item, i) => (
            <li key={`${key}-li${i}`} className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-[11px] size-1.5 shrink-0 rounded-pill bg-brand" />
              <span className="type-body text-ink-2">{renderInline(item, `${key}-li${i}`)}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="mb-7 flex flex-col gap-4">
          {block.items.map((item, i) => (
            <li key={`${key}-li${i}`} className="flex items-start gap-4">
              <span aria-hidden="true" className="type-mono mt-1 flex size-7 shrink-0 items-center justify-center rounded-pill border border-brand-tint-18 bg-brand-tint-04 text-xs font-medium text-brand-strong">
                {i + 1}
              </span>
              <span className="type-body pt-0.5 text-ink-2">{renderInline(item, `${key}-li${i}`)}</span>
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-brand pl-5">
          <p className="text-lg font-medium leading-relaxed text-ink-1 md:text-xl">{renderInline(block.text, key)}</p>
          {block.cite ? <cite className="type-small mt-3 block not-italic text-ink-5">— {block.cite}</cite> : null}
        </blockquote>
      )
    case 'callout':
      return (
        <aside className="my-8 rounded-control border border-line-1 bg-bg p-6">
          {block.title ? <p className="type-eyebrow mb-3 text-brand-strong">{block.title}</p> : null}
          <p className="type-body text-ink-2">{renderInline(block.text, key)}</p>
        </aside>
      )
    case 'stats':
      return (
        <dl className="my-9 grid grid-cols-2 gap-px overflow-hidden rounded-control border border-line-1 bg-line-1 sm:grid-cols-4">
          {block.items.map((stat, i) => (
            <div key={`${key}-s${i}`} className="bg-canvas p-5">
              <dd className="type-mono text-2xl font-medium text-ink-1 md:text-[28px]">{stat.value}</dd>
              <dt className="type-small mt-1.5 text-ink-5">{stat.label}</dt>
            </div>
          ))}
        </dl>
      )
    default:
      return null
  }
}

export function PostBody({ blocks }: { blocks: InsightBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Block key={`block-${i}`} block={block} index={i} />
      ))}
    </div>
  )
}

export default PostBody
