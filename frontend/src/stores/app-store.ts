import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/lib/i18n'
import type {
  SubscriptionTier,
  UserEntitlements,
  WorkspaceEnvironment,
} from '@/types/financial'
import type { SupportedLocale } from '@/lib/utils'

export type ThemeMode = 'light' | 'dark' | 'system'

export type ActiveModuleId =
  | 'dashboard'
  | 'transactions'
  | 'accounts'
  | 'budgets'
  | 'analytics'
  | 'investments'
  | 'organization'
  | 'settings'

export interface DashboardWidgetConfig {
  id:
    | 'kpi-Row'
    | 'cashflow-chart'
    | 'budget-health'
    | 'fx-inflation-watch'
    | 'recent-ledger'
    | 'ai-advisory'
  titleId: string
  titleEn: string
  visible: boolean
  order: number
}

const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'kpi-Row', titleId: 'Indikator Utama Bulan Berjalan', titleEn: 'Current Month Core KPIs', visible: true, order: 1 },
  { id: 'cashflow-chart', titleId: 'Grafik Arus Kas & Pertumbuhan Aset (MTM)', titleEn: 'Cash Flow & Asset Growth (MTM) Chart', visible: true, order: 2 },
  { id: 'budget-health', titleId: 'Utilisasi Anggaran & Skor Kesehatan Finansial', titleEn: 'Budget Utilization & Financial Health Score', visible: true, order: 3 },
  { id: 'ai-advisory', titleId: 'Rekomendasi Asisten Finansial AI', titleEn: 'AI Financial Assistant Advisories', visible: true, order: 4 },
  { id: 'recent-ledger', titleId: 'Jurnal Peristiwa Keuangan Terakhir', titleEn: 'Recent Financial Event Ledger', visible: true, order: 5 },
  { id: 'fx-inflation-watch', titleId: 'Eksposur Valas (USD/IDR) & Pantauan Inflasi BI/US', titleEn: 'FX Exposure (USD/IDR) & BI/US Inflation Watch', visible: false, order: 6 },
]

function buildEntitlements(tier: SubscriptionTier): UserEntitlements {
  if (tier === 'FREE') {
    return {
      tier: 'FREE',
      environmentAccess: ['INDIVIDUAL'],
      features: {
        multiCurrencyValuation: true,
        aiBudgetAssistant: false,
        aiInvestmentAdvisor: false,
        aiLiabilityGuard: true,
        organizationLedger: false,
        customExportAudit: false,
        advancedMtmAnalytics: true,
      },
      quotas: { maxAccounts: 8, maxOrganizations: 0 },
    }
  }
  if (tier === 'PRO') {
    return {
      tier: 'PRO',
      environmentAccess: ['INDIVIDUAL', 'ORGANIZATION'],
      features: {
        multiCurrencyValuation: true,
        aiBudgetAssistant: true,
        aiInvestmentAdvisor: true,
        aiLiabilityGuard: true,
        organizationLedger: true,
        customExportAudit: true,
        advancedMtmAnalytics: true,
      },
      quotas: { maxAccounts: 50, maxOrganizations: 2 },
    }
  }
  return {
    tier: 'ENTERPRISE',
    environmentAccess: ['INDIVIDUAL', 'ORGANIZATION'],
    features: {
      multiCurrencyValuation: true,
      aiBudgetAssistant: true,
      aiInvestmentAdvisor: true,
      aiLiabilityGuard: true,
      organizationLedger: true,
      customExportAudit: true,
      advancedMtmAnalytics: true,
    },
    quotas: { maxAccounts: null, maxOrganizations: null },
  }
}

interface AppState {
  // Navigation & Environment
  activeModule: ActiveModuleId
  environment: WorkspaceEnvironment
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  commandPaletteOpen: boolean
  newTransactionModalOpen: boolean

  // Theme & Language (i18n)
  theme: ThemeMode
  language: 'id' | 'en'
  locale: SupportedLocale

  // Backend Entitlements State (Dynamic reflection of backend permissions)
  entitlements: UserEntitlements

  // Assisted Adaptive Dashboard Customization
  widgets: DashboardWidgetConfig[]
  adaptiveSuggestionDismissed: boolean

  // Actions
  setActiveModule: (module: ActiveModuleId) => void
  setEnvironment: (env: WorkspaceEnvironment) => void
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setNewTransactionModalOpen: (open: boolean) => void
  setTheme: (theme: ThemeMode) => void
  setLanguage: (lang: 'id' | 'en') => void
  setSubscriptionTierFromBackend: (tier: SubscriptionTier) => void
  toggleWidgetVisibility: (id: DashboardWidgetConfig['id']) => void
  moveWidgetOrder: (id: DashboardWidgetConfig['id'], direction: 'up' | 'down') => void
  approveAdaptiveSuggestion: () => void
  dismissAdaptiveSuggestion: () => void
  resetDashboardWidgets: () => void
}

export function applyThemeToDom(theme: ThemeMode) {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeModule: 'dashboard',
      environment: 'INDIVIDUAL',
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandPaletteOpen: false,
      newTransactionModalOpen: false,

      theme: 'light', // Default: Light Mode
      language: 'id', // Default: Bahasa Indonesia
      locale: 'id-ID',

      entitlements: buildEntitlements('ENTERPRISE'),

      widgets: DEFAULT_WIDGETS,
      adaptiveSuggestionDismissed: false,

      setActiveModule: (activeModule) => set({ activeModule, mobileNavOpen: false }),
      setEnvironment: (environment) => set({ environment }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setNewTransactionModalOpen: (newTransactionModalOpen) =>
        set({ newTransactionModalOpen }),

      setTheme: (theme) => {
        applyThemeToDom(theme)
        set({ theme })
      },

      setLanguage: (language) => {
        const locale: SupportedLocale = language === 'id' ? 'id-ID' : 'en-US'
        i18n.changeLanguage(language)
        document.documentElement.lang = language
        set({ language, locale })
      },

      setSubscriptionTierFromBackend: (tier) => {
        const entitlements = buildEntitlements(tier)
        const currentEnv = get().environment
        const nextEnv = entitlements.environmentAccess.includes(currentEnv)
          ? currentEnv
          : 'INDIVIDUAL'
        set({ entitlements, environment: nextEnv })
      },

      toggleWidgetVisibility: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ),
        })),

      moveWidgetOrder: (id, direction) =>
        set((state) => {
          const sorted = [...state.widgets].sort((a, b) => a.order - b.order)
          const idx = sorted.findIndex((w) => w.id === id)
          if (idx === -1) return state
          const swapIdx = direction === 'up' ? idx - 1 : idx + 1
          if (swapIdx < 0 || swapIdx >= sorted.length) return state
          const tempOrder = sorted[idx]!.order
          sorted[idx] = { ...sorted[idx]!, order: sorted[swapIdx]!.order }
          sorted[swapIdx] = { ...sorted[swapIdx]!, order: tempOrder }
          return { widgets: sorted }
        }),

      approveAdaptiveSuggestion: () =>
        set((state) => ({
          adaptiveSuggestionDismissed: true,
          widgets: state.widgets.map((w) =>
            w.id === 'fx-inflation-watch' ? { ...w, visible: true, order: 2 } : w
          ),
        })),

      dismissAdaptiveSuggestion: () => set({ adaptiveSuggestionDismissed: true }),

      resetDashboardWidgets: () =>
        set({
          widgets: DEFAULT_WIDGETS,
          adaptiveSuggestionDismissed: false,
        }),
    }),
    {
      name: 'archer-theme-preference',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        locale: state.locale,
        sidebarCollapsed: state.sidebarCollapsed,
        widgets: state.widgets,
        adaptiveSuggestionDismissed: state.adaptiveSuggestionDismissed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDom(state.theme)
          i18n.changeLanguage(state.language)
          document.documentElement.lang = state.language
        }
      },
    }
  )
)
