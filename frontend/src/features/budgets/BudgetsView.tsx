import * as React from 'react'
import {
  ShieldCheck,
  Sparkles,
  Check,
  Edit3,
  AlertTriangle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import { formatCurrency } from '@/lib/utils'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export function BudgetsView() {
  const { t } = useTranslation()
  const { language, locale, entitlements } = useAppStore()
  const {
    budgets,
    applyAiBudgetRecommendation,
    updateBudgetAllocation,
  } = useFinancialDataStore()

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValue, setEditValue] = React.useState('')

  const totalAllocated = budgets.reduce((s, b) => s + b.allocatedAmountIdr, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmountIdr, 0)
  const totalRemaining = totalAllocated - totalSpent

  const startManualEdit = (budgetId: string, currentVal: number) => {
    setEditingId(budgetId)
    setEditValue(String(currentVal))
  }

  const saveManualEdit = (budgetId: string) => {
    const val = Number(editValue)
    if (!Number.isNaN(val) && val >= 0) {
      updateBudgetAllocation(budgetId, val)
    }
    setEditingId(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
            {t('budgets.title')}
          </h1>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {t('budgets.subtitle')}
          </p>
        </div>
        <Badge variant="info">
          {language === 'id' ? 'Periode: 01 Nov – 30 Nov 2026' : 'Period: Nov 01 – Nov 30, 2026'}
        </Badge>
      </div>

      {/* Explicit AI Boundary Banner */}
      <div className="p-3.5 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] flex items-start gap-3 sporty-accent-left">
        <ShieldCheck className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--fg-secondary)] leading-relaxed">
          {t('budgets.aiBoundaryNotice')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card sportyAccent>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
              {t('budgets.totalBudget')}
            </div>
            <div className="text-2xl font-bold font-mono-code mt-1.5">
              {formatCurrency(totalAllocated, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
              {t('budgets.totalSpent')}
            </div>
            <div className="text-2xl font-bold font-mono-code mt-1.5 text-[var(--color-accent)]">
              {formatCurrency(totalSpent, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
              {t('budgets.remainingBudget')}
            </div>
            <div className="text-2xl font-bold font-mono-code mt-1.5 text-[var(--color-secondary)]">
              {formatCurrency(totalRemaining, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Allocations & AI Optimization Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'id'
              ? 'Alokasi Kategori, Utilisasi & Rekomendasi Asisten AI'
              : 'Category Allocations, Utilization & AI Assistant Recommendations'}
          </CardTitle>
          <Badge variant={entitlements.features.aiBudgetAssistant ? 'success' : 'warning'}>
            {entitlements.features.aiBudgetAssistant
              ? 'AI Assistant Active'
              : 'AI Assistant Restricted by Plan'}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {budgets.map((b) => {
            const pct =
              b.allocatedAmountIdr > 0
                ? Math.round((b.spentAmountIdr / b.allocatedAmountIdr) * 100)
                : 0
            const isEditing = editingId === b.budgetId
            const hasDiffRecommendation =
              b.allocatedAmountIdr !== b.aiRecommendedAmountIdr

            return (
              <div
                key={b.budgetId}
                className="p-4 rounded-xs border border-[var(--border-default)] bg-[var(--bg-card)] space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="mono">{b.categoryId}</Badge>
                      <span className="text-sm font-bold text-[var(--fg-primary)]">
                        {b.mainCategoryName}
                      </span>
                      <span className="text-xs text-[var(--fg-muted)]">
                        — {b.subCategoryName}
                      </span>
                      {b.isEssential && (
                        <Badge variant="primary">
                          {language === 'id' ? 'Esensial' : 'Essential'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 w-36 px-2.5 rounded-xs border border-[var(--border-focus)] bg-[var(--bg-input)] text-right font-mono-code text-xs"
                        />
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => saveManualEdit(b.budgetId)}
                        >
                          {t('common.save')}
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setEditingId(null)}
                        >
                          {t('common.cancel')}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          startManualEdit(b.budgetId, b.allocatedAmountIdr)
                        }
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>
                          {language === 'id' ? 'Optimasi Manual' : 'Manual Edit'}
                        </span>
                      </Button>
                    )}

                    {entitlements.features.aiBudgetAssistant &&
                      hasDiffRecommendation && (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => applyAiBudgetRecommendation(b.budgetId)}
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>
                            {t('budgets.applyAiRecommendation')} (
                            {formatCurrency(
                              b.aiRecommendedAmountIdr,
                              'IDR',
                              locale
                            )}
                            )
                          </span>
                        </Button>
                      )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className="text-[var(--fg-secondary)]">
                      Realisasi: <strong>{formatCurrency(b.spentAmountIdr, 'IDR', locale)}</strong> dari Pagu{' '}
                      <strong>{formatCurrency(b.allocatedAmountIdr, 'IDR', locale)}</strong>
                    </span>
                    <span
                      className={`font-bold ${
                        pct > 85
                          ? 'text-[var(--color-danger)]'
                          : pct > 75
                            ? 'text-[var(--color-warning)]'
                            : 'text-[var(--color-secondary)]'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-xs bg-[var(--bg-muted)] overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor:
                          pct > 85
                            ? 'var(--color-danger)'
                            : pct > 75
                              ? 'var(--color-warning)'
                              : 'var(--color-accent)',
                      }}
                    />
                  </div>
                </div>

                {/* AI Rationale Box */}
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xs bg-[var(--bg-muted)]/70 border border-[var(--border-subtle)] text-xs">
                  <span className="flex items-center gap-2 text-[var(--fg-secondary)]">
                    {pct > 80 ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-[var(--color-warning)] shrink-0" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-[var(--color-secondary)] shrink-0" />
                    )}
                    <span>
                      <strong>AI Analysis:</strong>{' '}
                      {language === 'id' ? b.aiRationaleId : b.aiRationaleEn}
                    </span>
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
