import React from 'react'
import type { InsightBlock } from '@/lib/insights'

// Tiny inline-markdown renderer: supports **bold** and [label](href).
// Deliberately minimal — content is authored in lib/insights.ts, not user input.
const INLINE_RE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let i = 0
  let match: RegExpExecArray | null

  // Reset state on the shared regex before iterating.
  INLINE_RE.lastIndex = 0
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-white">
          {match[1]}
        </strong>
      )
    } else {
      const label = match[2]
      const href = match[3]
      const isExternal = /^https?:/i.test(href)
      nodes.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={href}
          className="text-[#e5342a] underline underline-offset-2 decoration-[#e5342a]/40 hover:decoration-[#e5342a] hover:text-white transition-colors"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      )
    }

    lastIndex = INLINE_RE.lastIndex
    i++
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

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
      return (
        <p className="text-white/70 leading-relaxed text-[15px] md:text-base mb-6">
          {renderInline(block.text, key)}
        </p>
      )

    case 'h2':
      return (
        <h2
          id={slugifyHeading(block.text)}
          className="text-2xl md:text-3xl font-black text-white leading-tight mt-14 mb-5 scroll-mt-28"
        >
          {block.text}
        </h2>
      )

    case 'h3':
      return (
        <h3 className="text-lg font-bold text-white mt-9 mb-3">{block.text}</h3>
      )

    case 'ul':
      return (
        <ul className="mb-7 space-y-3">
          {block.items.map((item, i) => (
            <li key={`${key}-li${i}`} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e5342a]"
              />
              <span className="text-white/70 leading-relaxed text-[15px] md:text-base">
                {renderInline(item, `${key}-li${i}`)}
              </span>
            </li>
          ))}
        </ul>
      )

    case 'ol':
      return (
        <ol className="mb-7 space-y-4">
          {block.items.map((item, i) => (
            <li key={`${key}-li${i}`} className="flex items-start gap-4">
              <span
                aria-hidden
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e5342a]/40 text-xs font-bold tabular-nums text-[#e5342a]"
              >
                {i + 1}
              </span>
              <span className="text-white/70 leading-relaxed text-[15px] md:text-base pt-0.5">
                {renderInline(item, `${key}-li${i}`)}
              </span>
            </li>
          ))}
        </ol>
      )

    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-[#e5342a] pl-5">
          <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium">
            {renderInline(block.text, key)}
          </p>
          {block.cite && (
            <cite className="mt-3 block text-sm not-italic text-white/50">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      )

    case 'callout':
      return (
        <div className="my-8 rounded-xl border border-white/10 bg-white/5 p-6">
          {block.title && (
            <p className="text-xs font-bold tracking-widest text-[#e5342a] uppercase mb-3">
              {block.title}
            </p>
          )}
          <p className="text-white/80 leading-relaxed text-[15px] md:text-base">
            {renderInline(block.text, key)}
          </p>
        </div>
      )

    case 'stats':
      return (
        <div className="my-9 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {block.items.map((stat, i) => (
            <div key={`${key}-s${i}`} className="bg-[#0a0a0a] p-5">
              <div className="text-2xl md:text-3xl font-black text-white">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[11px] uppercase tracking-wider text-white/55 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

export default function PostBody({ blocks }: { blocks: InsightBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Block key={`block-${i}`} block={block} index={i} />
      ))}
    </div>
  )
}
