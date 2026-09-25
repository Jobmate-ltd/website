import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Button — the site's one button.
 *
 * Variants: `primary` (brand-strong fill, white text), `secondary` (white,
 * line-1 border, ink text), `ghost`, `dark` (ink fill) and `link` (an
 * underlined text link for prose). Sizes sm, md, lg; every size is at least
 * 44px tall so it is a real tap target. Pass `asChild` to render a Link or an
 * anchor with the same styling.
 *
 * @example
 *   <Button variant="primary" size="lg" asChild><a href={SIGNUP_TRIAL_URL}>Sign up now</a></Button>
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-bold',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out-expo',
    'active:translate-y-px motion-reduce:active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-[1.1em] [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand-strong text-canvas shadow-rest hover:bg-brand-dark hover:shadow-hover',
        secondary:
          'bg-canvas text-ink-1 border border-line-1 shadow-rest hover:border-grey-400 hover:shadow-hover',
        ghost: 'text-ink-3 hover:bg-line-3 hover:text-ink-1',
        dark: 'bg-ink-1 text-canvas shadow-rest hover:bg-ink-3 hover:shadow-hover',
        link: 'rounded-none font-semibold text-brand-strong underline decoration-brand-tint-18 underline-offset-4 hover:decoration-brand-strong',
      },
      size: {
        sm: 'min-h-11 px-4 text-[13px]',
        md: 'min-h-11 px-5 text-sm',
        lg: 'min-h-12 px-7 text-sm',
        icon: 'size-11',
      },
      block: {
        true: 'w-full',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'min-h-0 px-0' }],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block }), className)}
        ref={ref}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export default Button
