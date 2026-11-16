import * as React from 'react'
import {
  Search,
  Download,
  Plus,
  FileSpreadsheet,
  ArrowRight,
  MapPin,
  Receipt,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export function TransactionsView() {
  const { t } = useTranslation()
  const { language, locale, setNewTransactionModalOpen } = useAppStore()
  const {
    events,
    accounts,
    eventTypes,
    payments,
    categories,
    locations,
  } = useFinancialDataStore()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedGeneralType, setSelectedGeneralType] = React.useState('ALL')
  const [selectedCurrency, setSelectedCurrency] = React.useState('ALL')
  const [activeSubTab, setActiveSubTab] = React.useState<'ledger' | 'lookup'>('ledger')

  const filteredEvents = events.filter((ev) => {
    const et = eventTypes.find((x) => x.eventTypeId === ev.eventTypeId)
    const cat = categories.find((x) => x.categoryId === ev.categoryId)
    const src = accounts.find((x) => x.accountId === ev.accountSourceId)
    const dst = accounts.find((x) => x.accountId === ev.accountDestinationId)

    if (selectedGeneralType !== 'ALL' && et?.generalEventTypeName !== selectedGeneralType) {
      return false
    }
    if (selectedCurrency !== 'ALL' && ev.actualCurrency !== selectedCurrency) {
      return false
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const haystack = [
        ev.eventClassId,
        ev.description,
        ev.accountSourceId,
        ev.accountDestinationId,
        src?.accountName,
        dst?.accountName,
        cat?.mainCategoryName,
        cat?.subCategoryName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const handleExportCsv = () => {
    const headers = [
      'UUID',
      'Event_Date',
      'Event_Class_Id',
      'Event_Type_Id',
      'Account_Source',
      'Account_Destination',
      'Payment_Id',
      'Category_Id',
      'Description',
      'Actual_Currency',
      'Actual_Amount',
      'Exchange_Rate',
      'Base_Amount_IDR',
      'Running_Saldo',
      'Running_Total_Asset',
    ]
    const rows = filteredEvents.map((e) => [
      e.uuid,
      e.eventDate,
      e.eventClassId,
      e.eventTypeId,
      e.accountSourceId,
      e.accountDestinationId,
      e.paymentId,
      e.categoryId,
      `"${e.description.replace(/"/g, '""')}"`,
      e.actualCurrency,
      e.actualAmount,
      e.exchangeRate,
      e.baseAmount,
      e.runningSaldo,
      e.runningTotalAsset,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `archer_financial_events_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
            {t('transactions.title')}
          </h1>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {t('transactions.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="h-3.5 w-3.5" />
            <span>{t('common.exportCsv')}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setNewTransactionModalOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t('transactions.addTransaction')}</span>
          </Button>
        </div>
      </div>

      {/* Contextual Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={() => setActiveSubTab('ledger')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'ledger'
              ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
          }`}
        >
          {language === 'id'
            ? `Buku Besar Peristiwa (financial_events: ${filteredEvents.length})`
            : `Financial Events Ledger (${filteredEvents.length})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('lookup')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'lookup'
              ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
              : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
          }`}
        >
          {language === 'id'
            ? 'Katalog Relasional (EVTP / PAY / CAT / LCT)'
            : 'Relational Master Catalog (EVTP / PAY / CAT / LCT)'}
        </button>
      </div>

      {activeSubTab === 'ledger' ? (
        <Card sportyAccent>
          {/* Filter Bar */}
          <CardHeader className="flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('transactions.searchPlaceholder')}
                className="h-8 w-full pl-8 pr-3 rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] text-xs text-[var(--fg-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedGeneralType}
                onChange={(e) => setSelectedGeneralType(e.target.value)}
                className="h-8 px-2.5 rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] text-xs text-[var(--fg-primary)]"
              >
                <option value="ALL">{t('transactions.filterEventType')}</option>
                <option value="Opening">GETP-1: Opening</option>
                <option value="Inflow">GETP-2: Inflow (Income)</option>
                <option value="Outflow">GETP-3: Outflow (Expense)</option>
                <option value="Internal">GETP-4: Internal (Transfer/Invest)</option>
                <option value="Deposito">GETP-5: Deposito</option>
                <option value="Reconciliation">GETP-6: Reconciliation (MTM)</option>
              </select>

              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="h-8 px-2.5 rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] text-xs text-[var(--fg-primary)]"
              >
                <option value="ALL">{t('transactions.filterCurrency')}</option>
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
          </CardHeader>

          {/* Information-Dense Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase text-[var(--fg-secondary)]">
                  <th className="py-2.5 px-3">{t('transactions.colCode')}</th>
                  <th className="py-2.5 px-3">{t('transactions.colEventType')}</th>
                  <th className="py-2.5 px-3">{t('transactions.colRoute')}</th>
                  <th className="py-2.5 px-3">{t('transactions.colCategory')}</th>
                  <th className="py-2.5 px-3">{t('transactions.colPayment')}</th>
                  <th className="py-2.5 px-3">Deskripsi &amp; Lokasi</th>
                  <th className="py-2.5 px-3 text-right">{t('transactions.colActualAmount')}</th>
                  <th className="py-2.5 px-3 text-right">{t('transactions.colBaseAmount')}</th>
                  <th className="py-2.5 px-3 text-right">{t('transactions.colRunningSaldo')}</th>
                  <th className="py-2.5 px-3 text-right">{t('transactions.colRunningAsset')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-10 text-center text-xs text-[var(--fg-muted)]"
                    >
                      {t('common.noData')}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => {
                    const et = eventTypes.find((x) => x.eventTypeId === ev.eventTypeId)
                    const src = accounts.find((x) => x.accountId === ev.accountSourceId)
                    const dst = accounts.find(
                      (x) => x.accountId === ev.accountDestinationId
                    )
                    const cat = categories.find((x) => x.categoryId === ev.categoryId)
                    const pay = payments.find((x) => x.paymentId === ev.paymentId)
                    const loc = locations.find((x) => x.locationId === ev.locationId)

                    return (
                      <tr key={ev.uuid} className="hover:bg-[var(--bg-muted)]/60">
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono-code font-bold text-[var(--fg-primary)]">
                              {ev.eventClassId}
                            </span>
                            {ev.isInternalTransfer && (
                              <Badge variant="default">INT</Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--fg-muted)] font-mono-code">
                            {formatDate(ev.eventDate, locale)}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <Badge
                            variant={
                              et?.generalEventTypeName === 'Inflow'
                                ? 'success'
                                : et?.generalEventTypeName === 'Outflow'
                                  ? 'danger'
                                  : et?.generalEventTypeName === 'Reconciliation'
                                    ? 'warning'
                                    : 'info'
                            }
                          >
                            {et?.specificEventTypeName}
                          </Badge>
                          <div className="text-[10px] font-mono-code text-[var(--fg-muted)] mt-0.5">
                            {ev.eventTypeId} ({et?.generalEventTypeName})
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Badge variant="mono">{ev.accountSourceId}</Badge>
                            <ArrowRight className="h-3 w-3 text-[var(--color-accent)]" />
                            <Badge variant="mono">{ev.accountDestinationId}</Badge>
                          </div>
                          <div className="text-[11px] text-[var(--fg-secondary)] mt-0.5 truncate max-w-[210px]">
                            {src?.accountName} → {dst?.accountName}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-semibold text-[var(--fg-primary)]">
                            {cat?.mainCategoryName}
                          </div>
                          <div className="text-[11px] text-[var(--fg-muted)]">
                            {cat?.categoryId}: {cat?.subCategoryName}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-medium text-[var(--fg-primary)]">
                            {pay?.paymentMethodName}
                          </div>
                          <div className="text-[11px] text-[var(--fg-muted)]">
                            {pay?.paymentChannelName} ({ev.paymentId})
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[var(--fg-primary)]">
                            {ev.description}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--fg-muted)] mt-0.5">
                            {loc && (
                              <span className="inline-flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" />
                                {loc.district}, {loc.regency}
                              </span>
                            )}
                            {ev.receiptUrl && (
                              <span className="inline-flex items-center gap-0.5 text-[var(--color-accent)] font-mono-code">
                                <Receipt className="h-3 w-3" />
                                Resi
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono-code">
                          <div className="font-bold text-[var(--fg-primary)]">
                            {formatCurrency(ev.actualAmount, ev.actualCurrency, locale)}
                          </div>
                          {ev.actualCurrency !== 'IDR' && (
                            <div className="text-[10px] text-[var(--fg-muted)]">
                              Kurs: Rp{ev.exchangeRate.toLocaleString(locale)}
                            </div>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono-code font-bold text-[var(--fg-primary)]">
                          {formatCurrency(ev.baseAmount, 'IDR', locale)}
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono-code text-[var(--fg-secondary)]">
                          {formatCurrency(ev.runningSaldo, 'IDR', locale)}
                        </td>

                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono-code font-semibold text-[var(--color-accent)]">
                          {formatCurrency(ev.runningTotalAsset, 'IDR', locale)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Type Detail (EVTP / GETP / SETP)</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-[var(--color-accent)]" />
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {eventTypes.map((et) => (
                <div
                  key={et.eventTypeId}
                  className="flex items-center justify-between p-2 rounded-xs bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="mono">{et.eventTypeId}</Badge>
                    <span className="font-semibold">{et.specificEventTypeName}</span>
                  </div>
                  <Badge variant="info">
                    {et.generalEventTypeId}: {et.generalEventTypeName}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Detail (CAT / MCAT / SCAT)</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-[var(--color-secondary)]" />
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {categories.map((cat) => (
                <div
                  key={cat.categoryId}
                  className="flex items-center justify-between p-2 rounded-xs bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="mono">{cat.categoryId}</Badge>
                    <span className="font-semibold">{cat.mainCategoryName}</span>
                  </div>
                  <span className="text-[var(--fg-secondary)]">{cat.subCategoryName}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
