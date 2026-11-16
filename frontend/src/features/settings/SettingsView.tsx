import {
  Languages,
  Palette,
  ShieldCheck,
  Database,
  Server,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore, type ThemeMode } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import type { SubscriptionTier } from '@/types/financial'
import { KOTLIN_API_BASE_URL, API_ENDPOINTS } from '@/lib/api/client'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export function SettingsView() {
  const { t } = useTranslation()
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    entitlements,
    setSubscriptionTierFromBackend,
  } = useAppStore()
  const { etlRecords } = useFinancialDataStore()

  const tiers: SubscriptionTier[] = ['FREE', 'PRO', 'ENTERPRISE']
  const themes: { id: ThemeMode; labelId: string; labelEn: string }[] = [
    { id: 'light', labelId: 'Terang (Default)', labelEn: 'Light (Default)' },
    { id: 'dark', labelId: 'Gelap (Dark Mode)', labelEn: 'Dark Mode' },
    { id: 'system', labelId: 'Otomatis (Ikuti OS)', labelEn: 'Automatic (OS Preference)' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-3 border-b border-[var(--border-subtle)]">
        <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
          {t('settings.title')}
        </h1>
        <p className="text-xs text-[var(--fg-muted)] mt-0.5">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Language & i18n Independence Card */}
        <Card sportyAccent>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-[var(--color-accent)]" />
              <CardTitle>{t('settings.languageLabel')}</CardTitle>
            </div>
            <Badge variant="info">id-ID / en-US</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[var(--fg-secondary)] leading-relaxed">
              {t('settings.languageDesc')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={language === 'id' ? 'primary' : 'outline'}
                onClick={() => setLanguage('id')}
              >
                Bahasa Indonesia (id-ID) — Default
              </Button>
              <Button
                variant={language === 'en' ? 'primary' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                English (en-US)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme System Card */}
        <Card sportyAccent>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-[var(--color-secondary)]" />
              <CardTitle>{t('settings.themeLabel')}</CardTitle>
            </div>
            <Badge variant="mono">{theme.toUpperCase()}</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[var(--fg-secondary)]">
              {language === 'id'
                ? 'Tema tersimpan secara konsisten di seluruh modul aplikasi dan mengikuti preferensi sistem operasi saat diatur ke Otomatis.'
                : 'Theme selection persists across all modules and follows OS color scheme when set to Automatic.'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((th) => (
                <Button
                  key={th.id}
                  variant={theme === th.id ? 'primary' : 'outline'}
                  onClick={() => setTheme(th.id)}
                >
                  {language === 'id' ? th.labelId : th.labelEn}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Backend Subscription Entitlement Simulator */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--color-secondary)]" />
            <CardTitle>{t('settings.subscriptionTitle')}</CardTitle>
          </div>
          <Badge variant="success">Active Tier: {entitlements.tier}</Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <p className="text-[var(--fg-secondary)]">
            {language === 'id'
              ? 'Sesuai arsitektur: pembatasan fitur dan hak akses dikontrol oleh backend Kotlin. Pilih payload tingkat langganan di bawah untuk menguji bagaimana UI beradaptasi secara dinamis.'
              : 'Per system architecture: feature restrictions and subscription entitlements are controlled by the Kotlin backend. Switch the simulated backend payload below to verify dynamic UI adaptation.'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {tiers.map((tier) => (
              <Button
                key={tier}
                variant={entitlements.tier === tier ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSubscriptionTierFromBackend(tier)}
              >
                Simulasikan Payload Backend: {tier}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {Object.entries(entitlements.features).map(([key, enabled]) => (
              <div
                key={key}
                className="p-2.5 rounded-xs border border-[var(--border-default)] bg-[var(--bg-muted)]/50 flex items-center justify-between gap-2"
              >
                <span className="font-mono-code text-[11px] truncate">{key}</span>
                <Badge variant={enabled ? 'success' : 'warning'}>
                  {enabled ? 'ON' : 'LOCKED'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ETL Batch Supervisor Table (From tabel_pengawas.xlsx) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[var(--color-accent)]" />
            <CardTitle>{t('settings.etlSupervisorTitle')}</CardTitle>
          </div>
          <Badge variant="mono">tabel_pengawas.xlsx (etl_record)</Badge>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase text-[var(--fg-secondary)]">
                <th className="py-2.5 px-3">ID Record / Tiket Batch</th>
                <th className="py-2.5 px-3">Dipicu Oleh</th>
                <th className="py-2.5 px-3">Tipe &amp; Waktu</th>
                <th className="py-2.5 px-3 text-right">Terdeteksi / Masuk</th>
                <th className="py-2.5 px-3">Entry Terakhir</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Pesan Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {etlRecords.map((rec) => (
                <tr key={rec.etlRecordId}>
                  <td className="py-2.5 px-3 font-mono-code">
                    <div className="font-bold">{rec.etlRecordId}</div>
                    <div className="text-[11px] text-[var(--fg-muted)]">
                      {rec.ticketBatchId}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">{rec.triggeredBy}</td>
                  <td className="py-2.5 px-3 font-mono-code text-[11px]">
                    <Badge variant="info">{rec.recordType}</Badge>
                    <div className="mt-0.5 text-[var(--fg-muted)]">
                      {rec.recordStartAt}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code font-bold">
                    {rec.totalInserted} / {rec.totalDetected} (Fail: {rec.totalFail})
                  </td>
                  <td className="py-2.5 px-3 font-mono-code">
                    <Badge variant="mono">{rec.lastSuccessEntry}</Badge>
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge variant="success">{rec.batchStatus}</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[var(--fg-secondary)]">
                    {rec.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Kotlin Spring Boot API Contract Endpoints */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-[var(--fg-muted)]" />
            <CardTitle>
              Kotlin Spring Boot 4.1.2 REST API Contract ({KOTLIN_API_BASE_URL})
            </CardTitle>
          </div>
          <Badge variant="mono">src/lib/api/client.ts</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono-code">
          {Object.entries(API_ENDPOINTS).map(([name, path]) => (
            <div
              key={name}
              className="p-2 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-between"
            >
              <span className="text-[var(--fg-secondary)]">{name}:</span>
              <span className="text-[var(--color-accent)] font-bold">{path}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
