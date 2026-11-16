import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Input, SelectField, Badge } from '@/components/ui'
import { useAppStore } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import { formatCurrency, type SupportedCurrency } from '@/lib/utils'

export function NewEventModal() {
  const { t } = useTranslation()
  const {
    newTransactionModalOpen,
    setNewTransactionModalOpen,
    language,
    locale,
    environment,
  } = useAppStore()

  const {
    accounts,
    eventTypes,
    payments,
    categories,
    locations,
    annualWealth,
    addFinancialEvent,
  } = useFinancialDataStore()

  const [eventDate, setEventDate] = React.useState('2026-11-16')
  const [eventTypeId, setEventTypeId] = React.useState('EVTP-3') // Default Expense
  const [accountSourceId, setAccountSourceId] = React.useState('ACC-3') // Bank Jago
  const [accountDestinationId, setAccountDestinationId] = React.useState('ACC-13') // Merchant
  const [paymentId, setPaymentId] = React.useState('PAY-7') // QRIS
  const [categoryId, setCategoryId] = React.useState('CAT-4') // Food & Beverage
  const [locationId, setLocationId] = React.useState('LCT-1')
  const [actualCurrency, setActualCurrency] = React.useState<SupportedCurrency>('IDR')
  const [actualAmount, setActualAmount] = React.useState('75000')
  const [exchangeRate, setExchangeRate] = React.useState('17587')
  const [description, setDescription] = React.useState('')
  const [noteContext, setNoteContext] = React.useState('')
  const [error, setError] = React.useState('')

  const parsedAmount = Number(actualAmount) || 0
  const parsedRate = actualCurrency === 'IDR' ? 1 : Number(exchangeRate) || 17587
  const baseIdrAmount = Math.round(parsedAmount * parsedRate)

  const selectedEvType = eventTypes.find((e) => e.eventTypeId === eventTypeId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setError(
        language === 'id'
          ? 'Deskripsi peristiwa keuangan wajib diisi.'
          : 'Financial event description is required.'
      )
      return
    }
    if (parsedAmount <= 0) {
      setError(
        language === 'id'
          ? 'Nominal transaksi harus lebih besar dari 0.'
          : 'Transaction amount must be greater than 0.'
      )
      return
    }
    if (accountSourceId === accountDestinationId) {
      setError(
        language === 'id'
          ? 'Akun sumber dan akun tujuan tidak boleh identik.'
          : 'Source and destination accounts cannot be identical.'
      )
      return
    }

    addFinancialEvent({
      eventDate,
      eventTypeId,
      accountSourceId,
      accountDestinationId,
      paymentId,
      categoryId,
      description: description.trim(),
      locationId,
      actualCurrency,
      actualAmount: parsedAmount,
      exchangeRate: parsedRate,
      noteContext: noteContext.trim() || undefined,
      environment,
    })

    setDescription('')
    setNoteContext('')
    setError('')
    setNewTransactionModalOpen(false)
  }

  return (
    <Modal
      open={newTransactionModalOpen}
      onClose={() => setNewTransactionModalOpen(false)}
      title={t('transactions.addTransaction')}
      subtitle={
        language === 'id'
          ? 'Struktur Double-Entry sesuai skema financial_events (Sumber -> Tujuan, Multi-Currency, Saldo & Total Asset otomatis)'
          : 'Double-Entry structure matching financial_events schema (Source -> Destination, Multi-Currency, Auto Running Saldo)'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={language === 'id' ? 'Tanggal Peristiwa (event_date)' : 'Event Date (event_date)'}
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
          <SelectField
            label={language === 'id' ? 'Tipe Peristiwa (event_type_id)' : 'Event Type (event_type_id)'}
            value={eventTypeId}
            onChange={(e) => setEventTypeId(e.target.value)}
            options={eventTypes.map((et) => ({
              value: et.eventTypeId,
              label: `${et.eventTypeId} — ${et.generalEventTypeName} / ${et.specificEventTypeName}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
          <SelectField
            label={language === 'id' ? 'Akun Sumber (account_source)' : 'Source Account (account_source)'}
            value={accountSourceId}
            onChange={(e) => setAccountSourceId(e.target.value)}
            options={accounts.map((a) => ({
              value: a.accountId,
              label: `${a.accountId} — ${a.accountName} (${a.currency})`,
            }))}
          />
          <SelectField
            label={language === 'id' ? 'Akun Tujuan (account_destination)' : 'Destination Account (account_destination)'}
            value={accountDestinationId}
            onChange={(e) => setAccountDestinationId(e.target.value)}
            options={accounts.map((a) => ({
              value: a.accountId,
              label: `${a.accountId} — ${a.accountName} (${a.currency})`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectField
            label={language === 'id' ? 'Kategori (category_id)' : 'Category (category_id)'}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({
              value: c.categoryId,
              label: `${c.categoryId} — ${c.mainCategoryName}: ${c.subCategoryName}`,
            }))}
          />
          <SelectField
            label={language === 'id' ? 'Metode & Kanal (payment_id)' : 'Payment Method & Channel'}
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            options={payments.map((p) => ({
              value: p.paymentId,
              label: `${p.paymentId} — ${p.paymentMethodName} (${p.paymentChannelName})`,
            }))}
          />
          <SelectField
            label={language === 'id' ? 'Lokasi (location_id)' : 'Location (location_id)'}
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            options={locations.map((l) => ({
              value: l.locationId,
              label: `${l.locationId} — ${l.district}, ${l.regency}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectField
            label={language === 'id' ? 'Mata Uang Transaksi' : 'Actual Currency'}
            value={actualCurrency}
            onChange={(e) => setActualCurrency(e.target.value as SupportedCurrency)}
            options={[
              { value: 'IDR', label: 'IDR — Rupiah Indonesia' },
              { value: 'USD', label: 'USD — US Dollar' },
            ]}
          />
          <Input
            label={language === 'id' ? 'Nominal Asli (actual_amount)' : 'Actual Amount'}
            type="number"
            min="1"
            step="any"
            numeric
            value={actualAmount}
            onChange={(e) => setActualAmount(e.target.value)}
          />
          <Input
            label={language === 'id' ? 'Kurs ke IDR (exchange_rate)' : 'Exchange Rate to IDR'}
            type="number"
            min="1"
            numeric
            disabled={actualCurrency === 'IDR'}
            value={actualCurrency === 'IDR' ? '1' : exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
          />
        </div>

        <Input
          label={language === 'id' ? 'Deskripsi Transaksi (description)' : 'Event Description'}
          placeholder={
            language === 'id'
              ? 'Contoh: Beli Kopi Diskusi / Investasi RDPU SMMF / Top up Dana'
              : 'e.g., Buy Coffee / RDPU Mutual Fund Investment'
          }
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (error) setError('')
          }}
        />

        <Input
          label={language === 'id' ? 'Catatan / Konteks Audit (Opsional)' : 'Audit Context / Note (Optional)'}
          placeholder={
            language === 'id'
              ? 'Catatan tambahan atau nomor referensi resi...'
              : 'Additional context or receipt reference...'
          }
          value={noteContext}
          onChange={(e) => setNoteContext(e.target.value)}
        />

        {/* Real-time Running Balance Preview */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="info">{selectedEvType?.generalEventTypeName}</Badge>
            <span className="text-[var(--fg-secondary)]">
              {language === 'id' ? 'Ekuivalen Base (IDR):' : 'Base Equivalent (IDR):'}
            </span>
            <span className="font-mono-code font-bold text-[var(--fg-primary)]">
              {formatCurrency(baseIdrAmount, 'IDR', locale)}
            </span>
          </div>
          <div className="text-[11px] text-[var(--fg-muted)] font-mono-code">
            {language === 'id' ? 'Saldo Saat Ini:' : 'Current Liquid Saldo:'}{' '}
            {formatCurrency(annualWealth.saldo, 'IDR', locale)}
          </div>
        </div>

        {error && (
          <div className="rounded-xs bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] px-3 py-2 text-xs text-[var(--color-danger)] font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <Button
            variant="outline"
            onClick={() => setNewTransactionModalOpen(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
