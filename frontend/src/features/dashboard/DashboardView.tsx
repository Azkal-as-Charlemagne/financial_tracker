import * as React from 'react'
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Sparkles,
  Check,
  X,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ChevronRight,
  Activity,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import {
  formatCurrency,
  formatDate,
  formatPercent,
  getCalendarMonthPeriod,
} from '@/lib/utils'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export function DashboardView() {
  const { t } = useTranslation()
  const {
    language,
    locale,
    widgets,
    adaptiveSuggestionDismissed,
    approveAdaptiveSuggestion,
    dismissAdaptiveSuggestion,
    toggleWidgetVisibility,
    moveWidgetOrder,
    resetDashboardWidgets,
    setActiveModule,
  } = useAppStore()

  const {
    accounts,
    events,
    eventTypes,
    mtmHistory,
    annualWealth,
    budgets,
    aiAdvisories,
    reviewAiAdvisory,
  } = useFinancialDataStore()

  const [customizing, setCustomizing] = React.useState(false)

  // Strict current calendar month calculation (2026-11-01 00:00 to 2026-11-30 23:59)
  // Never confuse current account balances with monthly transaction aggregates.
  const currentMonthEvents = events.filter((e) => e.eventDate.startsWith('2026-11'))

  const monthlyIncome = currentMonthEvents
    .filter((e) => {
      const et = eventTypes.find((x) => x.eventTypeId === e.eventTypeId)
      return (
        et?.generalEventTypeName === 'Inflow' ||
        et?.specificEventTypeName === 'Investment Return'
      )
    })
    .reduce((sum, e) => sum + e.baseAmount, 0)

  const monthlyExpense = currentMonthEvents
    .filter((e) => {
      const et = eventTypes.find((x) => x.eventTypeId === e.eventTypeId)
      return et?.generalEventTypeName === 'Outflow'
    })
    .reduce((sum, e) => sum + e.baseAmount, 0)

  const monthlyNetCashFlow = monthlyIncome - monthlyExpense
  const monthlySavingsRate =
    monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0

  const totalBudgetAllocated = budgets.reduce((s, b) => s + b.allocatedAmountIdr, 0)
  const totalBudgetSpent = budgets.reduce((s, b) => s + b.spentAmountIdr, 0)
  const budgetUtilizationPercent =
    totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated) * 100 : 0

  // Financial Health Composite Score (0-100)
  const liquidityRatio =
    annualWealth.totalLiabilities > 0
      ? annualWealth.saldo / annualWealth.totalLiabilities
      : 15
  const financialHealthScore = Math.min(
    98,
    Math.round(
      55 +
        Math.min(25, monthlySavingsRate * 0.3) +
        Math.min(18, liquidityRatio * 1.2)
    )
  )

  const calendarPeriod = getCalendarMonthPeriod(2026, 10, locale)
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-5">
      {/* Page Title & Contextual Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
              {t('dashboard.title')}
            </h1>
            <Badge variant="info">
              {language === 'id' ? 'Bulan Kalender: Nov 2026' : 'Calendar Month: Nov 2026'}
            </Badge>
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {t('dashboard.subtitle')} ({calendarPeriod.label})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomizing(!customizing)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t('dashboard.customizeWidgets')}</span>
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={() => setActiveModule('analytics')}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{t('dashboard.openAdvancedAnalytics')}</span>
          </Button>
        </div>
      </div>

      {/* LAYER 2: Adaptive Information Suggestion Banner (Never modifies layout without explicit user approval) */}
      {!adaptiveSuggestionDismissed && (
        <div className="rounded-xs bg-[var(--color-info-bg)] border border-[var(--color-info-border)] p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sporty-accent-left">
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[var(--fg-primary)]">
                {t('dashboard.adaptiveBannerTitle')}
              </div>
              <p className="text-xs text-[var(--fg-secondary)] mt-0.5">
                {t('dashboard.adaptiveBannerDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="xs"
              onClick={approveAdaptiveSuggestion}
            >
              <Check className="h-3.5 w-3.5" />
              <span>{t('dashboard.approveLayout')}</span>
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={dismissAdaptiveSuggestion}
            >
              <X className="h-3.5 w-3.5" />
              <span>{t('dashboard.dismissLayout')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* LAYER 3: User Widget Customization Panel */}
      {customizing && (
        <Card sportyAccent>
          <CardHeader>
            <CardTitle>
              {language === 'id'
                ? 'Kustomisasi Tata Letak & Visibilitas Widget Dasbor'
                : 'Customize Dashboard Widget Order & Visibility'}
            </CardTitle>
            <Button variant="outline" size="xs" onClick={resetDashboardWidgets}>
              <RotateCcw className="h-3 w-3" />
              <span>{t('dashboard.restoreDefault')}</span>
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {sortedWidgets.map((w, idx) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xs border border-[var(--border-default)] bg-[var(--bg-muted)]/50 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <Badge variant="mono">#{idx + 1}</Badge>
                  <span className="font-semibold truncate">
                    {language === 'id' ? w.titleId : w.titleEn}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveWidgetOrder(w.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-xs hover:bg-[var(--bg-subtle)] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveWidgetOrder(w.id, 'down')}
                    disabled={idx === sortedWidgets.length - 1}
                    className="p-1 rounded-xs hover:bg-[var(--bg-subtle)] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWidgetVisibility(w.id)}
                    className="p-1 rounded-xs hover:bg-[var(--bg-subtle)] cursor-pointer text-[var(--color-accent)]"
                    title="Toggle Visibility"
                  >
                    {w.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Render Ordered Visible Widgets */}
      {sortedWidgets.map((widget) => {
        if (!widget.visible) return null

        if (widget.id === 'kpi-Row') {
          return (
            <div key={widget.id} className="space-y-3">
              {/* Row 1: Balance Sheet Snapshot (Point-in-time Account Balances) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card sportyAccent>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                      <span>{t('dashboard.netWorth')}</span>
                      <Badge variant="success">
                        {formatPercent(annualWealth.realReturnPercent, locale)} Riil
                      </Badge>
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono-code text-[var(--fg-primary)]">
                      {formatCurrency(annualWealth.netWorth, 'IDR', locale)}
                    </div>
                    <div className="mt-1.5 text-[11px] text-[var(--fg-secondary)] flex items-center justify-between">
                      <span>
                        {language === 'id' ? 'Aset - Kewajiban' : 'Assets - Liabilities'}
                      </span>
                      <span className="font-mono-code text-[var(--color-secondary)] font-semibold">
                        KPI {annualWealth.kpiTargetPercent}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                      <span>{t('dashboard.totalAssets')}</span>
                      <Badge variant="mono">ACC-3..10</Badge>
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono-code text-[var(--fg-primary)]">
                      {formatCurrency(annualWealth.totalAsset, 'IDR', locale)}
                    </div>
                    <div className="mt-1.5 text-[11px] text-[var(--fg-secondary)] flex items-center justify-between">
                      <span>{t('dashboard.liquidSaldo')}:</span>
                      <span className="font-mono-code font-semibold">
                        {formatCurrency(annualWealth.saldo, 'IDR', locale)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                      <span>{t('dashboard.totalLiabilities')}</span>
                      <Badge variant="success">DSR 3.4%</Badge>
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono-code text-[var(--fg-primary)]">
                      {formatCurrency(annualWealth.totalLiabilities, 'IDR', locale)}
                    </div>
                    <div className="mt-1.5 text-[11px] text-[var(--fg-secondary)] flex items-center justify-between">
                      <span>
                        {language === 'id' ? 'Rasio Likuiditas Kas:' : 'Cash Coverage Ratio:'}
                      </span>
                      <span className="font-mono-code font-semibold text-[var(--color-secondary)]">
                        {liquidityRatio.toFixed(1)}x
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                      <span>{t('dashboard.monthlyCashFlow')}</span>
                      <Badge variant={monthlyNetCashFlow >= 0 ? 'success' : 'danger'}>
                        Nov 2026
                      </Badge>
                    </div>
                    <div className="mt-2 text-2xl font-bold font-mono-code text-[var(--color-secondary)]">
                      {formatCurrency(monthlyNetCashFlow, 'IDR', locale)}
                    </div>
                    <div className="mt-1.5 text-[11px] text-[var(--fg-secondary)] flex items-center justify-between gap-2 font-mono-code">
                      <span className="flex items-center text-[var(--color-success)]">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {formatCurrency(monthlyIncome, 'IDR', locale, true)}
                      </span>
                      <span className="flex items-center text-[var(--color-danger)]">
                        <ArrowDownRight className="h-3.5 w-3.5" />
                        {formatCurrency(monthlyExpense, 'IDR', locale, true)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        }

        if (widget.id === 'fx-inflation-watch') {
          const usdAccount = accounts.find((a) => a.currency === 'USD')
          return (
            <Card key={widget.id} sportyAccent>
              <CardHeader>
                <CardTitle>
                  {language === 'id'
                    ? 'Eksposur Valas (USD/IDR) & Indikator Makroekonomi (BI / US CPI)'
                    : 'FX Exposure (USD/IDR) & Macroeconomic Indicators (BI / US CPI)'}
                </CardTitle>
                <Badge variant="info">{annualWealth.sourceCitation}</Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--fg-muted)] font-semibold">
                    {language === 'id' ? 'Saldo Valas (ACC-4)' : 'FX Balance (ACC-4)'}
                  </div>
                  <div className="text-lg font-bold font-mono-code mt-1">
                    {formatCurrency(usdAccount?.currentBalance || 45, 'USD', locale)}
                  </div>
                  <div className="text-[11px] text-[var(--fg-secondary)] font-mono-code mt-0.5">
                    ≈ {formatCurrency(usdAccount?.balanceInIdr || 791415, 'IDR', locale)} (@Rp17.587)
                  </div>
                </div>
                <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--fg-muted)] font-semibold">
                    {language === 'id' ? 'Inflasi Lokal (BI YoY)' : 'Local Inflation (BI YoY)'}
                  </div>
                  <div className="text-lg font-bold font-mono-code mt-1">
                    {annualWealth.localInflationBiPercent}%
                  </div>
                  <div className="text-[11px] text-[var(--fg-secondary)] mt-0.5">
                    Efek Portofolio: {annualWealth.localInflationEffectPercent}%
                  </div>
                </div>
                <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--fg-muted)] font-semibold">
                    {language === 'id' ? 'Inflasi Global (US CPI YoY)' : 'Global Inflation (US CPI)'}
                  </div>
                  <div className="text-lg font-bold font-mono-code mt-1">
                    {annualWealth.globalInflationUsCpiPercent}%
                  </div>
                  <div className="text-[11px] text-[var(--fg-secondary)] mt-0.5">
                    Efek Valas: {annualWealth.globalInflationEffectPercent}%
                  </div>
                </div>
                <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--fg-muted)] font-semibold">
                    {language === 'id' ? 'Real Return vs KPI 9%' : 'Real Return vs 9% KPI'}
                  </div>
                  <div className="text-lg font-bold font-mono-code text-[var(--color-secondary)] mt-1">
                    +{annualWealth.realReturnPercent}%
                  </div>
                  <div className="text-[11px] text-[var(--fg-secondary)] mt-0.5">
                    Inflasi Gabungan: {annualWealth.weightedInflationPercent}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        }

        if (widget.id === 'cashflow-chart') {
          return (
            <div key={widget.id} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {language === 'id'
                      ? 'Lintasan Pertumbuhan Total Aset & Saldo Likuid (MTM Mei – Nov 2026)'
                      : 'Total Asset & Liquid Saldo Trajectory (MTM May – Nov 2026)'}
                  </CardTitle>
                  <Badge variant="mono">PKT-1 / MTM-1..7</Badge>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mtmHistory} margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis
                        dataKey="monthName"
                        tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
                      />
                      <YAxis
                        tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}Jt`}
                        tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
                      />
                      <Tooltip
                        formatter={(val: number) => formatCurrency(val, 'IDR', locale)}
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-default)',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalAssetBulanIni"
                        name={language === 'id' ? 'Total Aset (IDR)' : 'Total Assets (IDR)'}
                        stroke="var(--chart-royal)"
                        fill="var(--chart-royal)"
                        fillOpacity={0.16}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="saldoBulanIni"
                        name={language === 'id' ? 'Saldo Likuid (IDR)' : 'Liquid Saldo (IDR)'}
                        stroke="var(--chart-emerald)"
                        fill="var(--chart-emerald)"
                        fillOpacity={0.14}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'id'
                      ? 'Dekomposisi Pertumbuhan: Modal vs Organik'
                      : 'Growth Decomposition: Capital vs Organic'}
                  </CardTitle>
                  <Badge variant="info">MTM</Badge>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mtmHistory.slice(-5)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                      <XAxis
                        dataKey="eventClassId"
                        tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
                      />
                      <YAxis
                        tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                        tick={{ fontSize: 11, fill: 'var(--fg-muted)' }}
                      />
                      <Tooltip
                        formatter={(val: number) => formatCurrency(val, 'IDR', locale)}
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-default)',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey="capitalGrowth"
                        name={language === 'id' ? 'Pertumbuhan Modal' : 'Capital Growth'}
                        fill="var(--chart-navy)"
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar
                        dataKey="organicGrowth"
                        name={language === 'id' ? 'Pertumbuhan Organik' : 'Organic Growth'}
                        fill="var(--chart-emerald)"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )
        }

        if (widget.id === 'budget-health') {
          return (
            <div key={widget.id} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Budget Utilization Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('dashboard.budgetUtilization')} — Nov 2026</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        budgetUtilizationPercent > 85
                          ? 'danger'
                          : budgetUtilizationPercent > 70
                            ? 'warning'
                            : 'success'
                      }
                    >
                      {budgetUtilizationPercent.toFixed(1)}% Terpakai
                    </Badge>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setActiveModule('budgets')}
                    >
                      <span>{language === 'id' ? 'Kelola Anggaran' : 'Manage Budgets'}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {budgets.map((b) => {
                    const pct = Math.min(
                      100,
                      Math.round((b.spentAmountIdr / b.allocatedAmountIdr) * 100)
                    )
                    return (
                      <div key={b.budgetId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[var(--fg-primary)]">
                            {b.mainCategoryName}{' '}
                            <span className="text-[var(--fg-muted)] font-normal">
                              — {b.subCategoryName}
                            </span>
                          </span>
                          <span className="font-mono-code text-xs">
                            <strong className="text-[var(--fg-primary)]">
                              {formatCurrency(b.spentAmountIdr, 'IDR', locale)}
                            </strong>{' '}
                            / {formatCurrency(b.allocatedAmountIdr, 'IDR', locale)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-xs bg-[var(--bg-muted)] overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${pct}%`,
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
                    )
                  })}
                </CardContent>
              </Card>

              {/* Financial Health Score Card */}
              <Card sportyAccent>
                <CardHeader>
                  <CardTitle>{t('dashboard.financialHealth')}</CardTitle>
                  <Activity className="h-4 w-4 text-[var(--color-secondary)]" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-bold font-mono-code text-[var(--color-secondary)]">
                        {financialHealthScore}
                      </span>
                      <span className="text-xs text-[var(--fg-muted)] font-mono-code">
                        {' '}
                        / 100
                      </span>
                    </div>
                    <Badge variant="success">
                      {language === 'id' ? 'SANGAT SEHAT' : 'EXCELLENT'}
                    </Badge>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--fg-secondary)]">
                        {language === 'id' ? 'Tingkat Tabungan Bulanan' : 'Monthly Savings Rate'}
                      </span>
                      <span className="font-mono-code font-bold text-[var(--color-success)]">
                        {monthlySavingsRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--fg-secondary)]">
                        {language === 'id' ? 'Rasio Kas thd Kewajiban' : 'Liquidity Coverage'}
                      </span>
                      <span className="font-mono-code font-bold">
                        {liquidityRatio.toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--fg-secondary)]">
                        {language === 'id' ? 'Porsi Portofolio SSSF' : 'SSSF Stability Share'}
                      </span>
                      <span className="font-mono-code font-bold">74.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }

        if (widget.id === 'ai-advisory') {
          return (
            <Card key={widget.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
                  <CardTitle>
                    {language === 'id'
                      ? 'Asisten Keuangan AI (Terbatas pada 3 Domain Pendukung — Kendali Penuh di Tangan Pengguna)'
                      : 'AI Financial Assistant (Strictly Advisory across 3 Authorized Domains)'}
                  </CardTitle>
                </div>
                <Badge variant="info">NON-AUTONOMOUS</Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiAdvisories.map((adv) => (
                  <div
                    key={adv.advisoryId}
                    className="p-3.5 rounded-xs border border-[var(--border-default)] bg-[var(--bg-muted)]/40 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="mono">{adv.domain}</Badge>
                        <Badge
                          variant={
                            adv.status === 'APPROVED_BY_USER'
                              ? 'success'
                              : adv.status === 'DISMISSED'
                                ? 'default'
                                : 'warning'
                          }
                        >
                          {adv.status}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-[var(--fg-primary)]">
                        {language === 'id' ? adv.titleId : adv.titleEn}
                      </h4>
                      <p className="text-xs text-[var(--fg-secondary)] leading-relaxed">
                        {language === 'id' ? adv.summaryId : adv.summaryEn}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono-code font-semibold text-[var(--color-accent)]">
                        {adv.impactMetric}
                      </span>
                      {adv.status === 'PENDING_REVIEW' && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() =>
                              reviewAiAdvisory(adv.advisoryId, 'APPROVED_BY_USER')
                            }
                          >
                            {t('common.approve')}
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => reviewAiAdvisory(adv.advisoryId, 'DISMISSED')}
                          >
                            {t('common.reject')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        }

        if (widget.id === 'recent-ledger') {
          return (
            <Card key={widget.id}>
              <CardHeader>
                <CardTitle>
                  {language === 'id'
                    ? 'Jurnal Peristiwa Keuangan Terakhir (Double-Entry Ledger)'
                    : 'Recent Double-Entry Financial Events'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setActiveModule('transactions')}
                >
                  <span>
                    {language === 'id' ? 'Lihat Buku Besar Lengkap' : 'View Full Ledger'}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-default)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase text-[var(--fg-secondary)]">
                      <th className="py-2.5 px-3">{t('transactions.colCode')}</th>
                      <th className="py-2.5 px-3">{t('transactions.colEventType')}</th>
                      <th className="py-2.5 px-3">{t('transactions.colRoute')}</th>
                      <th className="py-2.5 px-3">Deskripsi</th>
                      <th className="py-2.5 px-3 text-right">{t('transactions.colBaseAmount')}</th>
                      <th className="py-2.5 px-3 text-right">{t('transactions.colRunningSaldo')}</th>
                      <th className="py-2.5 px-3 text-right">{t('transactions.colRunningAsset')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {events.slice(0, 6).map((ev) => {
                      const et = eventTypes.find((x) => x.eventTypeId === ev.eventTypeId)
                      const src = accounts.find((x) => x.accountId === ev.accountSourceId)
                      const dst = accounts.find(
                        (x) => x.accountId === ev.accountDestinationId
                      )
                      return (
                        <tr key={ev.uuid} className="hover:bg-[var(--bg-muted)]/60">
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-mono-code font-bold text-[var(--fg-primary)]">
                              {ev.eventClassId}
                            </div>
                            <div className="text-[11px] text-[var(--fg-muted)]">
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
                                    : 'info'
                              }
                            >
                              {et?.specificEventTypeName}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-mono-code text-[11px]">
                            <span className="text-[var(--fg-secondary)]">
                              {src?.accountName || ev.accountSourceId}
                            </span>
                            <span className="mx-1.5 text-[var(--color-accent)]">→</span>
                            <span className="font-semibold text-[var(--fg-primary)]">
                              {dst?.accountName || ev.accountDestinationId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[var(--fg-primary)]">
                            {ev.description}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-code font-bold">
                            {formatCurrency(ev.baseAmount, 'IDR', locale)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-code text-[var(--fg-secondary)]">
                            {formatCurrency(ev.runningSaldo, 'IDR', locale)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-code font-semibold text-[var(--color-accent)]">
                            {formatCurrency(ev.runningTotalAsset, 'IDR', locale)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        }

        return null
      })}
    </div>
  )
}
