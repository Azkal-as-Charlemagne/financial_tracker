import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  sportyAccent?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, sportyAccent = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xs bg-[var(--bg-card)] text-[var(--fg-primary)] border border-[var(--border-subtle)] shadow-2xs overflow-hidden',
        sportyAccent && 'sporty-accent-top',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]',
      className
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xs font-bold uppercase tracking-wider text-[var(--fg-secondary)]',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4', className)} {...props} />
))
CardContent.displayName = 'CardContent'
