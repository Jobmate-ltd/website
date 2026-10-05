import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PRODUCT_IMAGES, type ProductImageId } from '@/lib/product-images'
import { GlassFrame, PHONE_GLASS_WIDTH } from '@/components/ui/glass-frame'

/**
 * ProductShot — a real product screenshot from lib/product-images.ts, with
 * its own width, height and alt text, served through next/image (AVIF/WebP
 * at the rendered size), always in its own liquid-glass pane (GlassFrame).
 *
 * Desktop captures get the glass window bar (with `url` in it); phone
 * captures get the glass bezel, centred in their column.
 *
 * Never point this at anything but a capture from scripts/capture-product.mjs.
 *
 * @example
 *   <ProductShot id="riddor-verdict-desktop" priority />
 */
export interface ProductShotProps {
  id: ProductImageId
  priority?: boolean
  sizes?: string
  className?: string
  /** Override the generated alt (rare: when the surrounding copy already says it). */
  alt?: string
  caption?: boolean
  url?: string
  /** Rendered over the screen, positioned in screen percentages. */
  overlay?: ReactNode
}

export function ProductShot({ id, priority = false, sizes, className, alt, caption = false, url = 'app.jobsafe.cloud', overlay }: ProductShotProps) {
  const image = PRODUCT_IMAGES[id]
  const phone = image.kind === 'phone'
  const defaultSizes = phone ? '(min-width: 1024px) 360px, 80vw' : '(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw'
  const framed = (
    <GlassFrame
      variant={phone ? 'phone' : 'desktop'}
      url={phone ? undefined : url}
      overlay={overlay}
      className={caption ? undefined : className}
    >
      <Image
        src={image.webp}
        alt={alt ?? image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes={sizes ?? defaultSizes}
        className="block h-auto w-full"
      />
    </GlassFrame>
  )
  if (!caption) return framed
  return (
    <figure className={cn('flex w-full flex-col gap-5', className)}>
      {framed}
      <figcaption className={cn('type-small text-ink-5', phone && cn('mx-auto text-center', PHONE_GLASS_WIDTH))}>{image.caption}</figcaption>
    </figure>
  )
}

export default ProductShot
