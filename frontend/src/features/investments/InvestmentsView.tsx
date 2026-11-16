import {
  Briefcase,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
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

export function InvestmentsView() {
  const { t } = useTranslation()
  const { language, locale } = useAppStore()
  const { portfolioBuckets } = useFinancialDataStore()

  const totalPortfolioIdr = portfolioBuckets.reduce(
    (s, b) => s + b.currentValueIdr,
    0
  )

  const weightedPortfolioReturn =
    portfolioBuckets.reduce(
      (s, b) => s + (b.currentAllocationPercent / 100) * b.weightedReturnPercent,
      0
    )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
            {t('investments.title')}
          </h1>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {t('investments.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono-code text-xs">
          <Badge variant="primary">
            Total Portofolio: {formatCurrency(totalPortfolioIdr, 'IDR', locale)}
          </Badge>
          <Badge variant="success">
            Weighted Return: {formatPercent(weightedPortfolioReturn, locale)}
          </Badge>
        </div>
      </div>

      {/* Risk Profile & Earning Power Assessment */}
      <Card sportyAccent>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>{t('investments.riskProfile')}</CardTitle>
          </div>
          <Badge variant="info">Konservatif – Moderat (Kestabilan Kas Tinggi)</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="text-[var(--fg-muted)] font-semibold">
              Stabilitas Daya Penghasilan (Earning Power)
            </div>
            <div className="text-base font-bold mt-1 text-[var(--fg-primary)]">
              2 Sumber Aktif (Uang Saku Rutin + Proyek Dev)
            </div>
            <p className="text-[11px] text-[var(--fg-secondary)] mt-1">
              Surplus kas bulanan terjaga di atas 65%, mendukung akumulasi keranjang SSSF &amp; Equity tanpa risiko likuiditas.
            </p>
          </div>

          <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="text-[var(--fg-muted)] font-semibold">
              Batas Toleransi Risiko &amp; Likuiditas
            </div>
            <div className="text-base font-bold font-mono-code mt-1 text-[var(--color-secondary)]">
              Min. 70% Aset Likuid / SSSF
            </div>
            <p className="text-[11px] text-[var(--fg-secondary)] mt-1">
              Menjaga dana darurat di RDPU (T+1) dan Deposito Bank Krom dengan pencairan fleksibel.
            </p>
          </div>

          <div className="p-3 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-[var(--color-accent)] font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('investments.rebalanceAdvisory')}</span>
            </div>
            <p className="text-[11px] text-[var(--fg-secondary)] mt-1.5 leading-relaxed">
              Keranjang SSSF saat ini 74,5% (+4,5% di atas target). Alihkan kelebihan Rp375.000 dari kas mengendap ke Equity/SBN untuk mengejar KPI 9% p.a.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Buckets from Tracker_Short_KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {portfolioBuckets.map((bucket) => (
          <Card key={bucket.bucketId}>
            <CardHeader>
              <div>
                <Badge variant="mono">{bucket.bucketCode}</Badge>
                <CardTitle className="mt-1">
                  {language === 'id' ? bucket.nameId : bucket.nameEn}
                </CardTitle>
              </div>
              <Briefcase className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono-code">
                  {formatCurrency(bucket.currentValueIdr, 'IDR', locale)}
                </span>
                <span className="font-mono-code font-bold text-[var(--color-secondary)] flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {formatPercent(bucket.weightedReturnPercent, locale)}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono-code">
                  <span>Aktual: {bucket.currentAllocationPercent}%</span>
                  <span>Target: {bucket.targetAllocationPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-xs bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent)]"
                    style={{ width: `${bucket.currentAllocationPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                {bucket.instruments.map((inst) => (
                  <div
                    key={inst.code}
                    className="p-2.5 rounded-xs bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[var(--fg-primary)]">
                        {inst.name}
                      </div>
                      <div className="text-[10px] font-mono-code text-[var(--fg-muted)]">
                        {inst.code} • {inst.platform}
                      </div>
                    </div>
                    <div className="text-right font-mono-code">
                      <div className="font-bold">
                        {formatCurrency(inst.valueIdr, 'IDR', locale)}
                      </div>
                      <div className="text-[10px] text-[var(--color-secondary)]">
                        +{inst.returnPercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
