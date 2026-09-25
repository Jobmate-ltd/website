// ─────────────────────────────────────────────────────────────────────────────
// Open Graph images, generated with next/og in the light theme.
//
// Every route has an `opengraph-image.tsx` that is three lines long and calls
// `ogImage()` below, so the wordmark, the grid texture, the type and the
// colours are decided once. Colours are read from app/globals.css through
// lib/tokens.ts; fonts are the static TTF instances in assets/fonts (satori
// cannot instance a variable font). Runs on the Node runtime.
// ─────────────────────────────────────────────────────────────────────────────

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { BRAND, SITE_URL } from '@/lib/brand'
import { token, withAlpha } from '@/lib/tokens'

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png' as const

export interface OgImageProps {
  /** Small uppercase line above the title, e.g. "Industries". */
  readonly eyebrow: string
  /** The page title. Wraps to three lines at most; keep it under ~80 chars. */
  readonly title: string
  /** Optional line under the title. */
  readonly subtitle?: string
}

/** Font files live in one folder and the wordmark in another; each read is
 * scoped to its folder so output file tracing includes only those. */
function font(name: string): Promise<Buffer> {
  return readFile(join(process.cwd(), 'assets', 'fonts', name))
}

function brandImage(name: string): Promise<Buffer> {
  return readFile(join(process.cwd(), 'public', 'images', 'brand', name))
}

/** Builds the 1200×630 image. Call from an `opengraph-image.tsx` default export. */
export async function ogImage({ eyebrow, title, subtitle }: OgImageProps): Promise<ImageResponse> {
  const [manrope800, manrope500, mono500, wordmark] = await Promise.all([
    font('manrope-800.ttf'),
    font('manrope-500.ttf'),
    font('jetbrains-mono-500.ttf'),
    brandImage('jobsafe-wordmark@2x.png'),
  ])

  const canvas = token('canvas')
  const ink1 = token('ink-1')
  const ink5 = token('ink-5')
  const line1 = token('line-1')
  const brand = token('brand')
  const brandStrong = token('brand-strong')
  const brandTint = token('brand-tint-08')
  const gridInk = withAlpha('ink-1', 0.045)
  const canvasClear = withAlpha('canvas', 0)
  const brandClear = withAlpha('brand', 0)

  const titleSize = title.length > 70 ? 54 : title.length > 44 ? 62 : 72
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: canvas,
          fontFamily: 'Manrope',
          position: 'relative',
        }}
      >
        {/* The 60px grid at 4.5% ink, top of the frame only. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 420,
            display: 'flex',
            backgroundImage: `linear-gradient(${gridInk} 1px, transparent 1px), linear-gradient(90deg, ${gridInk} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Fade the grid out downwards. */}
        <div
          style={{
            position: 'absolute',
            top: 160,
            left: 0,
            width: '100%',
            height: 300,
            display: 'flex',
            backgroundImage: `linear-gradient(to bottom, ${canvasClear}, ${canvas})`,
          }}
        />
        {/* One soft crimson radial. */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -180,
            width: 720,
            height: 720,
            display: 'flex',
            backgroundImage: `radial-gradient(circle, ${brandTint} 0%, ${brandClear} 62%)`,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '64px 72px 56px',
            position: 'relative',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders a data URI, not a Next image */}
          <img src={wordmarkSrc} alt="" width={210} height={68} style={{ marginLeft: -6 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1000 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                color: brandStrong,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <div style={{ width: 28, height: 4, background: brand, display: 'flex' }} />
              {eyebrow}
            </div>
            <div
              style={{
                color: ink1,
                fontSize: titleSize,
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.04,
                display: 'flex',
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  color: ink5,
                  fontSize: 28,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  display: 'flex',
                  maxWidth: 900,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${line1}`,
              paddingTop: 24,
              color: ink5,
              fontSize: 22,
            }}
          >
            <div style={{ display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
              {SITE_URL.replace('https://', '')}
            </div>
            <div style={{ display: 'flex', fontWeight: 800, color: ink1 }}>Record. Resolve. Prevent.</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Manrope', data: manrope800, weight: 800, style: 'normal' },
        { name: 'Manrope', data: manrope500, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: mono500, weight: 500, style: 'normal' },
      ],
    },
  )
}

/** The alt text convention: "<title> — jobsafe". */
export function ogAlt(title: string): string {
  return `${title} — ${BRAND}`
}
