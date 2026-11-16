import * as React from 'react'
import {
  TrendingUp,
  Globe2,
  Percent,
  Target,
  Scale,
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import { formatCurrency, formatPercent } from '@/lib/utils'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export function AnalyticsView() {
  const { t } = useTranslation()
  const { language, locale } = useAppStore()
  const { mtmHistory, annualWealth } = useFinancialDataStore()

  // Interactive What-If Inflation Weight Simulator (Based on sheet Catatan & Petunjuk_Pengisian_PKT)
  const [localWeight, setLocalWeight] = React.useState(85)
  const [globalWeight, setGlobalWeight] = React.useState(10)
  const [fxDeprWeight, setFxDeprWeight] = React.useState(5)

  const simulatedCompositeInflation =
    (localWeight * annualWealth.localInflationBiPercent +
      globalWeight * annualWealth.globalInflationUsCpiPercent +
      fxDeprWeight * annualWealth.idrDepreciationPercent) /
    100

  const simulatedRealReturn =
    annualWealth.nominalReturnPercent -
    simulatedCompositeInflation -
    annualWealth.taxAndFrictionPercent

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
            {t('analytics.title')}
          </h1>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {t('analytics.subtitle')}
          </p>
        </div>
        <Badge variant="mono">PKT-1 (Tahun Buku {annualWealth.year})</Badge>
      </div>

      {/* Top KPI Cards from Pertumbuhan_Kekayaan_Tahunan & Tracker_Short_KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card sportyAccent>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              <span>{t('analytics.realReturn')}</span>
              <Target className="h-4 w-4 text-[var(--color-accent)]" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-[var(--color-secondary)] mt-1.5">
              +{annualWealth.realReturnPercent}%
            </div>
            <div className="text-[11px] text-[var(--fg-secondary)] mt-1">
              Nominal: <strong>+{annualWealth.nominalReturnPercent}%</strong> • Friksi Pajak:{' '}
              <strong>-{annualWealth.taxAndFrictionPercent}%</strong>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              <span>{t('analytics.kpiTarget')}</span>
              <Badge variant="primary">Long_KPI = 9%</Badge>
            </div>
            <div className="text-2xl font-bold font-mono-code mt-1.5">
              {annualWealth.kpiTargetPercent.toFixed(2)}%
            </div>
            <div className="text-[11px] text-[var(--fg-secondary)] mt-1">
              Gap thd KPI: <strong className="font-mono-code">-0.48%</strong> (On-Track Q4)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              <span>{t('analytics.weightedInflation')}</span>
              <Percent className="h-4 w-4 text-[var(--color-warning)]" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-[var(--color-warning)] mt-1.5">
              {annualWealth.weightedInflationPercent}%
            </div>
            <div className="text-[11px] text-[var(--fg-secondary)] mt-1">
              BI YoY ({annualWealth.localInflationBiPercent}%) + US CPI ({annualWealth.globalInflationUsCpiPercent}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              <span>Efek Kurs USD/IDR</span>
              <Globe2 className="h-4 w-4 text-[var(--color-accent)]" />
            </div>
            <div className="text-2xl font-bold font-mono-code mt-1.5">
              {annualWealth.idrDepreciationPercent}%
            </div>
            <div className="text-[11px] text-[var(--fg-secondary)] mt-1">
              Kurs Referensi: <strong className="font-mono-code">Rp17.587 / USD</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Composed Chart: MTM Asset Growth vs Monthly Return */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'id'
              ? 'Grafik Komposit MTM Bulanan: Pertumbuhan Modal, Pertumbuhan Organik & Total Aset'
              : 'Monthly MTM Composite Chart: Capital Growth, Organic Growth & Total Asset'}
          </CardTitle>
          <Badge variant="mono">Maintenance_History.xlsx</Badge>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mtmHistory} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: 'var(--fg-muted)' }} />
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
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                dataKey="capitalGrowth"
                name={language === 'id' ? 'Capital Growth (Injeksi Modal)' : 'Capital Growth'}
                fill="var(--chart-navy)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="organicGrowth"
                name={language === 'id' ? 'Organic Growth (Surplus Tabungan)' : 'Organic Growth'}
                fill="var(--chart-emerald)"
                radius={[2, 2, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="totalAssetBulanIni"
                name={language === 'id' ? 'Total Asset Bulan Ini' : 'Total Asset'}
                stroke="var(--chart-amber)"
                strokeWidth={2.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Macroeconomic & Composite Inflation Formula Calculator (From sheet Catatan) */}
      <Card sportyAccent>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>{t('analytics.macroTitle')}</CardTitle>
          </div>
          <Badge variant="info">
            Rumus: (W_Lokal × BI_Rate) + (W_Global × US_CPI) + (W_Kurs × Depresiasi_IDR)
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-1.5">
              <label className="font-bold text-[var(--fg-secondary)] block">
                Bobot Lokal IDR (W_Lokal %)
              </label>
              <input
                type="number"
                value={localWeight}
                onChange={(e) => setLocalWeight(Number(e.target.value) || 0)}
                className="h-8 w-full px-2 rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] font-mono-code font-bold"
              />
              <div className="text-[11px] text-[var(--fg-muted)]">
                BI YoY Aktual: <strong>{annualWealth.localInflationBiPercent}%</strong>
              </div>
            </div>

            <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-1.5">
              <label className="font-bold text-[var(--fg-secondary)] block">
                Bobot Valas USD (W_Global %)
              </label>
              <input
                type="number"
                value={globalWeight}
                onChange={(e) => setGlobalWeight(Number(e.target.value) || 0)}
                className="h-8 w-full px-2 rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] font-mono-code font-bold"
              />
              <div className="text-[11px] text-[var(--fg-muted)]">
                US CPI YoY Aktual: <strong>{annualWealth.globalInflationUsCpiPercent}%</strong>
              </div>
            </div>

            <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-1.5">
              <label className="font-bold text-[var(--fg-secondary)] block">
                Bobot Kurs (W_Depresiasi %)
              </label>
              <input
                type="number"
                value={fxDeprWeight}
                onChange={(e) => setFxDeprWeight(Number(e.target.value) || 0)}
                className="h-8 w-full px-2 rounded-xs border border-[var(--border-default)] bg-[var(--bg-input)] font-mono-code font-bold"
              />
              <div className="text-[11px] text-[var(--fg-muted)]">
                Depresiasi IDR: <strong>{annualWealth.idrDepreciationPercent}%</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-[var(--fg-muted)]">
                Hasil Simulasi Daya Beli Riil
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span>Inflasi Gabungan:</span>
                <strong className="font-mono-code text-sm text-[var(--color-warning)]">
                  {simulatedCompositeInflation.toFixed(2)}%
                </strong>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span>Real Return Bersih:</span>
                <strong className="font-mono-code text-base text-[var(--color-secondary)]">
                  +{simulatedRealReturn.toFixed(2)}%
                </strong>
              </div>
            </div>
            <div className="pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--fg-muted)]">
              Sumber: {annualWealth.sourceCitation}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full MTM_Detail Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>{t('analytics.mtmHistoryTitle')}</CardTitle>
          </div>
          <Badge variant="mono">Sheet: MTM_Detail</Badge>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase text-[var(--fg-secondary)]">
                <th className="py-2.5 px-3">Kode MTM</th>
                <th className="py-2.5 px-3">Bulan</th>
                <th className="py-2.5 px-3 text-right">Saldo Likuid</th>
                <th className="py-2.5 px-3 text-right">Total Aset</th>
                <th className="py-2.5 px-3 text-right">Return Investasi</th>
                <th className="py-2.5 px-3 text-right">Pertumbuhan Modal</th>
                <th className="py-2.5 px-3 text-right">Pertumbuhan Organik</th>
                <th className="py-2.5 px-3 text-right">CAGR Bulanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {mtmHistory.map((m) => (
                <tr key={m.eventClassId} className="hover:bg-[var(--bg-muted)]/50">
                  <td className="py-2.5 px-3 font-mono-code font-bold">
                    <Badge variant="mono">{m.eventClassId}</Badge>
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{m.monthName}</td>
                  <td className="py-2.5 px-3 text-right font-mono-code">
                    {formatCurrency(m.saldoBulanIni, 'IDR', locale)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code font-bold text-[var(--color-accent)]">
                    {formatCurrency(m.totalAssetBulanIni, 'IDR', locale)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code text-[var(--color-secondary)]">
                    {formatCurrency(m.investmentReturn, 'IDR', locale)} (
                    {formatPercent(m.investmentReturnPercent, locale)})
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code">
                    {formatCurrency(m.capitalGrowth, 'IDR', locale)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code">
                    {formatCurrency(m.organicGrowth, 'IDR', locale)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code font-bold">
                    {formatPercent(m.cagrMonthlyGrowthPercent, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
