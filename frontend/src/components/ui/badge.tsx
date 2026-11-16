import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-[11px] font-semibold tracking-tight border tabular-nums',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--bg-muted)] text-[var(--fg-secondary)] border-[var(--border-default)]',
        primary:
          'bg-[var(--color-primary)] text-white border-transparent',
        success:
          'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]',
        warning:
          'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]',
        danger:
          'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger-border)]',
        info:
          'bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info-border)]',
        mono:
          'font-mono-code bg-[var(--bg-muted)] text-[var(--fg-primary)] border-[var(--border-default)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
