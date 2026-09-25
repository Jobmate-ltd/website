import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PRODUCT_IMAGES, type ProductImageId } from '@/lib/product-images'
import { Safari } from '@/components/ui/safari'
import { Iphone } from '@/components/ui/iphone'

/**
 * ProductShot — a real product screenshot from lib/product-images.ts, with
 * its own width, height and alt text, served through next/image (AVIF/WebP
 * at the rendered size). `frame` wraps it in the Safari or iPhone chrome.
 *
 * Never point this at anything but a capture from scripts/capture-product.mjs.
 *
 * @example
 *   <ProductShot id="riddor-verdict-desktop" frame priority />
 */
export interface ProductShotProps {
  id: ProductImageId
  /** Wrap in the device chrome that matches the capture. */
  frame?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  /** Override the generated alt (rare: when the surrounding copy already says it). */
  alt?: string
  caption?: boolean
  url?: string
}

export function ProductShot({ id, frame = false, priority = false, sizes, className, alt, caption = false, url }: ProductShotProps) {
  const image = PRODUCT_IMAGES[id]
  const defaultSizes = image.kind === 'phone' ? '(min-width: 1024px) 320px, 70vw' : '(min-width: 1024px) 640px, 100vw'
  const img = (
    <Image
      src={image.webp}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      priority={priority}
      sizes={sizes ?? defaultSizes}
      className={cn('block h-auto w-full', frame && 'object-cover object-top')}
    />
  )
  const framed = frame ? (
    image.kind === 'phone' ? (
      <Iphone className={className}>{img}</Iphone>
    ) : (
      <Safari url={url} className={className}>
        {img}
      </Safari>
    )
  ) : (
    <div className={cn('overflow-hidden rounded-frame border border-line-1 bg-canvas shadow-frame', className)}>{img}</div>
  )
  if (!caption) return framed
  return (
    <figure className="flex flex-col gap-3">
      {framed}
      <figcaption className="type-small text-ink-5">{image.caption}</figcaption>
    </figure>
  )
}

export default ProductShot
