import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/app-store'
import { AppShell } from '@/components/layout/AppShell'

const DashboardView = lazy(() =>
  import('@/features/dashboard/DashboardView').then((m) => ({
    default: m.DashboardView,
  }))
)
const TransactionsView = lazy(() =>
  import('@/features/transactions/TransactionsView').then((m) => ({
    default: m.TransactionsView,
  }))
)
const AccountsView = lazy(() =>
  import('@/features/accounts/AccountsView').then((m) => ({
    default: m.AccountsView,
  }))
)
const BudgetsView = lazy(() =>
  import('@/features/budgets/BudgetsView').then((m) => ({
    default: m.BudgetsView,
  }))
)
const AnalyticsView = lazy(() =>
  import('@/features/analytics/AnalyticsView').then((m) => ({
    default: m.AnalyticsView,
  }))
)
const InvestmentsView = lazy(() =>
  import('@/features/investments/InvestmentsView').then((m) => ({
    default: m.InvestmentsView,
  }))
)
const OrganizationView = lazy(() =>
  import('@/features/organization/OrganizationView').then((m) => ({
    default: m.OrganizationView,
  }))
)
const SettingsView = lazy(() =>
  import('@/features/settings/SettingsView').then((m) => ({
    default: m.SettingsView,
  }))
)

export function App() {
  const { t } = useTranslation()
  const { activeModule } = useAppStore()

  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="p-8 rounded-xs border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-mono-code text-[var(--fg-muted)]">
            {t('common.loading')}
          </div>
        }
      >
        {activeModule === 'dashboard' && <DashboardView />}
        {activeModule === 'transactions' && <TransactionsView />}
        {activeModule === 'accounts' && <AccountsView />}
        {activeModule === 'budgets' && <BudgetsView />}
        {activeModule === 'analytics' && <AnalyticsView />}
        {activeModule === 'investments' && <InvestmentsView />}
        {activeModule === 'organization' && <OrganizationView />}
        {activeModule === 'settings' && <SettingsView />}
      </Suspense>
    </AppShell>
  )
}
