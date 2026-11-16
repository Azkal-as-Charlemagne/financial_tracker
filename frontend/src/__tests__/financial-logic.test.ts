import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  getCalendarMonthPeriod,
} from '@/lib/utils'
import { useFinancialDataStore } from '@/stores/financial-data-store'

describe('ARCHER Financial Platform — Core Logic & Localization Tests', () => {
  it('keeps financial currency values strictly independent of interface language (id-ID vs en-US)', () => {
    const idrInIndonesian = formatCurrency(1500000, 'IDR', 'id-ID')
    const idrInEnglish = formatCurrency(1500000, 'IDR', 'en-US')
    const usdInIndonesian = formatCurrency(45, 'USD', 'id-ID')

    expect(idrInIndonesian).toContain('1.500.000')
    expect(idrInEnglish).toContain('1,500,000')
    expect(usdInIndonesian).toContain('45')
  })

  it('computes strict calendar month boundary from day 1 00:00 to final day 23:59', () => {
    const nov2026 = getCalendarMonthPeriod(2026, 10, 'id-ID')
    expect(nov2026.start.getDate()).toBe(1)
    expect(nov2026.start.getHours()).toBe(0)
    expect(nov2026.end.getDate()).toBe(30)
    expect(nov2026.end.getHours()).toBe(23)
  })

  it('updates double-entry account balances and running saldo accurately when recording an event', () => {
    const store = useFinancialDataStore.getState()
    const initialSaldo = store.annualWealth.saldo
    const initialCount = store.events.length

    store.addFinancialEvent({
      eventDate: '2026-11-16',
      eventTypeId: 'EVTP-3', // Outflow Expense
      accountSourceId: 'ACC-3', // Bank Jago (Owned Liquid)
      accountDestinationId: 'ACC-13', // External Merchant
      paymentId: 'PAY-7',
      categoryId: 'CAT-4',
      description: 'Unit Test Expense Entry',
      locationId: 'LCT-1',
      actualCurrency: 'IDR',
      actualAmount: 50000,
      exchangeRate: 1,
      environment: 'INDIVIDUAL',
    })

    const nextState = useFinancialDataStore.getState()
    expect(nextState.events.length).toBe(initialCount + 1)
    expect(nextState.annualWealth.saldo).toBe(initialSaldo - 50000)
  })
})
