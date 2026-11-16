import {
  Building2,
  Users,
  Layers,
  ShieldAlert,
  PlusCircle,
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

export function OrganizationView() {
  const { t } = useTranslation()
  const { language, locale, entitlements, setActiveModule } = useAppStore()
  const { organization, addOrganizationCostCenterSpend } =
    useFinancialDataStore()

  // Reflect backend subscription entitlements dynamically (Not hardcoded restriction, driven by store entitlement object)
  if (!entitlements.features.organizationLedger) {
    return (
      <Card sportyAccent>
        <CardContent className="p-8 text-center space-y-3">
          <ShieldAlert className="h-8 w-8 text-[var(--color-warning)] mx-auto" />
          <h2 className="text-base font-bold">
            {language === 'id'
              ? 'Entitas Organisasi Membutuhkan Hak Akses Backend PRO / ENTERPRISE'
              : 'Organization Ledger Requires PRO / ENTERPRISE Backend Entitlement'}
          </h2>
          <p className="text-xs text-[var(--fg-secondary)] max-w-md mx-auto">
            {language === 'id'
              ? 'Hak akses langganan Anda saat ini berada pada paket FREE dari respons otorisasi backend. Anda dapat mensimulasikan perubahan hak akses backend pada menu Pengaturan.'
              : 'Your current entitlement payload from the backend is set to FREE. You can test PRO or ENTERPRISE backend entitlements in Settings.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveModule('settings')}
          >
            {language === 'id'
              ? 'Buka Simulator Entitlement Backend'
              : 'Open Backend Entitlement Simulator'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
              {t('organization.title')}
            </h1>
            <Badge variant="mono">{organization.orgId}</Badge>
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            {organization.orgName} • NPWP: {organization.taxIdNpwp}
          </p>
        </div>
        <Badge variant="success">{organization.legalEntityType}</Badge>
      </div>

      {/* Corporate Treasury KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card sportyAccent>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              {t('organization.treasuryBalance')}
            </div>
            <div className="text-2xl font-bold font-mono-code text-[var(--fg-primary)] mt-1.5">
              {formatCurrency(organization.totalTreasuryIdr, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              {t('organization.monthlyBurn')}
            </div>
            <div className="text-2xl font-bold font-mono-code text-[var(--color-warning)] mt-1.5">
              {formatCurrency(organization.monthlyOperatingBurnIdr, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              {t('organization.receivables')}
            </div>
            <div className="text-2xl font-bold font-mono-code text-[var(--color-secondary)] mt-1.5">
              {formatCurrency(organization.receivablesIdr, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-[11px] font-bold uppercase text-[var(--fg-muted)]">
              {t('organization.payables')}
            </div>
            <div className="text-2xl font-bold font-mono-code text-[var(--color-danger)] mt-1.5">
              {formatCurrency(organization.payablesIdr, 'IDR', locale)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost Center Allocations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--color-accent)]" />
              <CardTitle>
                {language === 'id'
                  ? 'Struktur Alokasi Pusat Biaya (Cost Centers)'
                  : 'Cost Center Allocation & Ledger Utilization'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {organization.costCenters.map((cc) => {
              const pct = Math.min(
                100,
                Math.round((cc.utilizedIdr / cc.allocatedBudgetIdr) * 100)
              )
              return (
                <div
                  key={cc.code}
                  className="p-3 rounded-xs border border-[var(--border-default)] bg-[var(--bg-muted)]/40 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <Badge variant="mono">{cc.code}</Badge>
                      <div className="font-bold text-[var(--fg-primary)] mt-1">
                        {cc.name}
                      </div>
                      <div className="text-[11px] text-[var(--fg-muted)]">
                        PIC: {cc.ownerName}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        addOrganizationCostCenterSpend(cc.code, 250000)
                      }
                    >
                      <PlusCircle className="h-3 w-3" />
                      <span>+Rp250rb Beban</span>
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-mono-code text-[11px]">
                      <span>
                        Terpakai: {formatCurrency(cc.utilizedIdr, 'IDR', locale)}
                      </span>
                      <span>
                        Pagu: {formatCurrency(cc.allocatedBudgetIdr, 'IDR', locale)} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-xs bg-[var(--bg-muted)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Organization Members, Roles & Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--color-secondary)]" />
              <CardTitle>
                {language === 'id'
                  ? 'Anggota Organisasi, Peran & Otorisasi Limit'
                  : 'Organization Members, Roles & Spending Limits'}
              </CardTitle>
            </div>
            <Building2 className="h-4 w-4 text-[var(--fg-muted)]" />
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-muted)] text-[11px] font-bold uppercase text-[var(--fg-secondary)]">
                  <th className="py-2.5 px-3">Anggota</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Departemen</th>
                  <th className="py-2.5 px-3 text-right">Limit Otorisasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {organization.members.map((m) => (
                  <tr key={m.memberId}>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[var(--fg-primary)]">
                        {m.fullName}
                      </div>
                      <div className="text-[11px] font-mono-code text-[var(--fg-muted)]">
                        {m.email}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          m.role === 'OWNER'
                            ? 'primary'
                            : m.role === 'FINANCE_CONTROLLER'
                              ? 'success'
                              : 'info'
                        }
                      >
                        {m.role}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--fg-secondary)]">
                      {m.department}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-code font-bold">
                      {formatCurrency(m.allocationLimitIdr, 'IDR', locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
