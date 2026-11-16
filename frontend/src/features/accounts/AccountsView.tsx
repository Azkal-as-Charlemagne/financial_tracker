import * as React from 'react'
import {
  Wallet,
  RefreshCw,
  CheckCircle2,
  Building,
  UserCheck,
  Globe,
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

export function AccountsView() {
  const { t } = useTranslation()
  const { language, locale } = useAppStore()
  const {
    accounts,
    platforms,
    owners,
    reconcileAccountBalance,
  } = useFinancialDataStore()

  const [reconcilingId, setReconcilingId] = React.useState<string | null>(null)
  const [newBalanceInput, setNewBalanceInput] = React.useState('')
  const [feedbackMsg, setFeedbackMsg] = React.useState('')

  const ownedAccounts = accounts.filter((a) => a.isOwnedByUser)
  const externalAccounts = accounts.filter((a) => !a.isOwnedByUser)

  const totalLiquidIdr = ownedAccounts
    .filter((a) => a.accountType === 'Liquid' || a.accountType === 'Foreign Currency')
    .reduce((sum, a) => sum + a.balanceInIdr, 0)

  const totalInvestmentAndDepositIdr = ownedAccounts
    .filter((a) => a.accountType === 'Investment' || a.accountType === 'Deposito')
    .reduce((sum, a) => sum + a.balanceInIdr, 0)

  const handleStartReconcile = (accountId: string, currentVal: number) => {
    setReconcilingId(accountId)
    setNewBalanceInput(String(currentVal))
  }

  const handleSaveReconcile = (accountId: string, accountName: string) => {
    const parsed = Number(newBalanceInput)
    if (Number.isNaN(parsed) || parsed < 0) return
    reconcileAccountBalance(accountId, parsed)
    setReconcilingId(null)
    setFeedbackMsg(
      language === 'id'
        ? `Rekonsiliasi MTM berhasil untuk ${accountName}. Jurnal penyesuaian EVTP-9 telah dicatat otomatis ke Buku Besar.`
        : `MTM Reconciliation saved for ${accountName}. Adjustment event EVTP-9 recorded in the ledger.`
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
            {t('accounts.title')}
          </h1>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {t('accounts.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-code">
          <div className="px-3 py-1.5 rounded-xs bg-[var(--bg-card)] border border-[var(--border-default)]">
            <span className="text-[var(--fg-muted)] mr-2">Likuid (Saldo):</span>
            <strong className="text-[var(--color-secondary)]">
              {formatCurrency(totalLiquidIdr, 'IDR', locale)}
            </strong>
          </div>
          <div className="px-3 py-1.5 rounded-xs bg-[var(--bg-card)] border border-[var(--border-default)]">
            <span className="text-[var(--fg-muted)] mr-2">Investasi &amp; Deposito:</span>
            <strong className="text-[var(--color-accent)]">
              {formatCurrency(totalInvestmentAndDepositIdr, 'IDR', locale)}
            </strong>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="flex items-center justify-between gap-2 p-3 rounded-xs bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-xs text-[var(--color-success)] font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {feedbackMsg}
          </span>
          <button
            type="button"
            onClick={() => setFeedbackMsg('')}
            className="text-xs underline cursor-pointer"
          >
            {t('common.close')}
          </button>
        </div>
      )}

      {/* Owned Accounts Section */}
      <Card sportyAccent>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>
              {t('accounts.ownedAccounts')} ({ownedAccounts.length})
            </CardTitle>
          </div>
          <Badge variant="info">
            {language === 'id'
              ? 'Klik "Rekonsiliasi MTM" untuk menyamakan saldo aktual'
              : 'Click "Reconcile MTM" to align actual account balance'}
          </Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase text-[var(--fg-secondary)]">
                <th className="py-2.5 px-3">ID Akun</th>
                <th className="py-2.5 px-3">Nama Akun &amp; Tipe</th>
                <th className="py-2.5 px-3">{t('accounts.platformType')}</th>
                <th className="py-2.5 px-3">{t('accounts.ownerName')}</th>
                <th className="py-2.5 px-3">{t('accounts.currency')}</th>
                <th className="py-2.5 px-3 text-right">{t('accounts.balanceOriginal')}</th>
                <th className="py-2.5 px-3 text-right">{t('accounts.balanceIdr')}</th>
                <th className="py-2.5 px-3 text-right">Rekonsiliasi Terakhir</th>
                <th className="py-2.5 px-3 text-right">Tindakan MTM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {ownedAccounts.map((acc) => {
                const plat = platforms.find(
                  (p) => p.accountPlatformId === acc.accountPlatformId
                )
                const own = owners.find((o) => o.accountOwnerId === acc.accountOwnerId)
                const isEditing = reconcilingId === acc.accountId

                return (
                  <tr key={acc.accountId} className="hover:bg-[var(--bg-muted)]/50">
                    <td className="py-3 px-3 font-mono-code font-bold">
                      <Badge variant="mono">{acc.accountId}</Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[var(--fg-primary)]">
                        {acc.accountName}
                      </div>
                      <div className="text-[11px] text-[var(--fg-muted)]">
                        Tipe: {acc.accountType} • Seq #{acc.accountSequence}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[var(--fg-primary)]">
                        {plat?.platformName}
                      </div>
                      <div className="text-[11px] text-[var(--fg-muted)]">
                        {plat?.accountPlatformId} ({plat?.platformType})
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <UserCheck className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
                        {own?.ownerName}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={acc.currency === 'USD' ? 'warning' : 'default'}>
                        {acc.currency === 'USD' && <Globe className="h-3 w-3 mr-0.5" />}
                        {acc.currency}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-code font-bold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={newBalanceInput}
                          onChange={(e) => setNewBalanceInput(e.target.value)}
                          className="h-7 w-32 px-2 rounded-xs border border-[var(--border-focus)] bg-[var(--bg-input)] text-right font-mono-code text-xs"
                          autoFocus
                        />
                      ) : (
                        formatCurrency(acc.currentBalance, acc.currency, locale)
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-code font-bold text-[var(--color-accent)]">
                      {formatCurrency(acc.balanceInIdr, 'IDR', locale)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-code text-[11px] text-[var(--fg-muted)]">
                      {formatDate(acc.lastReconciledAt, locale)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() =>
                              handleSaveReconcile(acc.accountId, acc.accountName)
                            }
                          >
                            {t('common.save')}
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setReconcilingId(null)}
                          >
                            {t('common.cancel')}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() =>
                            handleStartReconcile(acc.accountId, acc.currentBalance)
                          }
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>{t('accounts.reconcileMtm')}</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* External Counterparty & System Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-[var(--fg-muted)]" />
            <CardTitle>
              {t('accounts.counterpartyAccounts')} ({externalAccounts.length})
            </CardTitle>
          </div>
          <Badge variant="default">Double-Entry Counterparties</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {externalAccounts.map((acc) => {
            const own = owners.find((o) => o.accountOwnerId === acc.accountOwnerId)
            return (
              <div
                key={acc.accountId}
                className="p-3 rounded-xs border border-[var(--border-default)] bg-[var(--bg-muted)]/40 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="mono">{acc.accountId}</Badge>
                    <span className="font-bold text-[var(--fg-primary)]">
                      {acc.accountName}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--fg-muted)] mt-1">
                    Pemilik: {own?.ownerName} ({own?.ownerType})
                  </div>
                </div>
                <Badge variant="default">{acc.accountType}</Badge>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
