import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  numeric?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, numeric, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-9 w-full rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] px-3 text-xs text-[var(--fg-primary)] placeholder:text-[var(--fg-placeholder)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] disabled:opacity-50',
            numeric && 'tabular-nums text-right font-mono-code',
            error && 'border-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[11px] text-[var(--color-danger)] font-medium">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(({ className, label, options, id, ...props }, ref) => {
  const generatedId = React.useId()
  const selectId = id || generatedId

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'h-9 w-full rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] px-2.5 text-xs text-[var(--fg-primary)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
})
SelectField.displayName = 'SelectField'
