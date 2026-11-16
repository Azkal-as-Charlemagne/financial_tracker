import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs text-xs font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] border border-transparent shadow-2xs',
        secondary:
          'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] border border-transparent shadow-2xs',
        accent:
          'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] border border-transparent shadow-2xs',
        outline:
          'bg-[var(--bg-card)] text-[var(--fg-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-muted)]',
        ghost:
          'bg-transparent text-[var(--fg-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-primary)]',
        danger:
          'bg-[var(--color-danger)] text-white hover:opacity-90 border border-transparent',
      },
      size: {
        xs: 'h-7 px-2.5 text-[11px]',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-xs',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
