import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  maxWidthClass?: string
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-2xl',
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          'w-full rounded-xs bg-[var(--bg-card)] border border-[var(--border-default)] shadow-md overflow-hidden sporty-accent-top',
          maxWidthClass
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/50">
          <div>
            <h2
              id="modal-title"
              className="text-sm font-bold tracking-tight text-[var(--fg-primary)]"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xs p-1 text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
