import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SupportedCurrency = 'IDR' | 'USD'
export type SupportedLocale = 'id-ID' | 'en-US'

/**
 * Formats financial currency strictly based on currency code,
 * keeping currency independent of the UI language selection.
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'IDR',
  locale: SupportedLocale = 'id-ID',
  compact = false
): string {
  if (Number.isNaN(amount)) return currency === 'IDR' ? 'Rp0' : '$0.00'

  if (compact && Math.abs(amount) >= 1_000_000) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'IDR' ? 0 : 2,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(amount)
}

export function formatNumber(
  value: number,
  locale: SupportedLocale = 'id-ID',
  decimals = 0
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(
  value: number,
  locale: SupportedLocale = 'id-ID',
  decimals = 2,
  includeSign = true
): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value))
  if (value > 0 && includeSign) return `+${formatted}%`
  if (value < 0) return `-${formatted}%`
  return `${formatted}%`
}

export function formatDate(
  dateStr: string | Date,
  locale: SupportedLocale = 'id-ID',
  style: 'short' | 'medium' | 'full' = 'medium'
): string {
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  if (Number.isNaN(d.getTime())) return String(dateStr)

  if (style === 'short') {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
    }).format(d)
  }
  if (style === 'full') {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(d)
  }
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/**
 * Returns the strict current calendar month period definition:
 * Starts on day 1 at 00:00 and ends on the final day of that calendar month at 23:59.
 */
export function getCalendarMonthPeriod(
  year: number,
  monthIndex0: number,
  locale: SupportedLocale = 'id-ID'
) {
  const start = new Date(year, monthIndex0, 1, 0, 0, 0)
  const end = new Date(year, monthIndex0 + 1, 0, 23, 59, 59)

  const fmt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return {
    start,
    end,
    label: `${fmt.format(start)} 00:00 — ${fmt.format(end)} 23:59`,
  }
}
