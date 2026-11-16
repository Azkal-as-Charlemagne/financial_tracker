import * as React from 'react'
import {
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  PieChart,
  TrendingUp,
  Briefcase,
  Building2,
  Settings,
  Search,
  Plus,
  Sun,
  Moon,
  Languages,
  ChevronRight,
  CalendarClock,
  ShieldCheck,
  Menu,
  X,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore, type ActiveModuleId } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import { cn, getCalendarMonthPeriod } from '@/lib/utils'
import { Badge, Button } from '@/components/ui'
import { CommandPalette } from './CommandPalette'
import { NewEventModal } from '@/features/transactions/NewEventModal'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation()
  const {
    activeModule,
    setActiveModule,
    environment,
    setEnvironment,
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
    setCommandPaletteOpen,
    setNewTransactionModalOpen,
    theme,
    setTheme,
    language,
    setLanguage,
    locale,
    entitlements,
  } = useAppStore()

  const { isExplicitDevMock } = useFinancialDataStore()

  // Strict current calendar month period: Nov 1, 2026 00:00 to Nov 30, 2026 23:59
  const currentMonthPeriod = getCalendarMonthPeriod(2026, 10, locale)

  const navItems: {
    id: ActiveModuleId
    label: string
    icon: React.ReactNode
    badge?: string
  }[] = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'transactions',
      label: t('nav.transactions'),
      icon: <ArrowRightLeft className="h-4 w-4 shrink-0" />,
      badge: 'DBL',
    },
    {
      id: 'accounts',
      label: t('nav.accounts'),
      icon: <Wallet className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'budgets',
      label: t('nav.budgets'),
      icon: <PieChart className="h-4 w-4 shrink-0" />,
      badge: entitlements.features.aiBudgetAssistant ? 'AI' : undefined,
    },
    {
      id: 'analytics',
      label: t('nav.analytics'),
      icon: <TrendingUp className="h-4 w-4 shrink-0" />,
      badge: 'MTM',
    },
    {
      id: 'investments',
      label: t('nav.investments'),
      icon: <Briefcase className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'organization',
      label: t('nav.organization'),
      icon: <Building2 className="h-4 w-4 shrink-0" />,
      badge: 'ORG',
    },
    {
      id: 'settings',
      label: t('nav.settings'),
      icon: <Settings className="h-4 w-4 shrink-0" />,
    },
  ]

  const activeNavObj = navItems.find((n) => n.id === activeModule)

  return (
    <div className="min-h-screen flex bg-[var(--bg-page)] text-[var(--fg-primary)]">
      {/* Global Sidebar (Desktop) */}
      <aside
        className={cn(
          'hidden lg:flex flex-col justify-between bg-[var(--bg-sidebar)] text-[var(--fg-sidebar)] border-r border-slate-800 transition-all duration-150 shrink-0 select-none',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-slate-800/80 sporty-accent-top">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="h-7 w-7 rounded-xs bg-[var(--color-accent)] flex items-center justify-center font-mono-code font-bold text-xs text-white shadow-xs">
                  AR
                </div>
                <div className="leading-tight truncate">
                  <div className="text-xs font-bold tracking-wider text-white">
                    {t('app.name')}
                  </div>
                  <div className="text-[10px] text-[var(--fg-sidebar-muted)] truncate">
                    FINANCE &amp; INTEL
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-xs text-[var(--fg-sidebar-muted)] hover:bg-[var(--bg-sidebar-hover)] hover:text-white cursor-pointer mx-auto lg:mx-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Environment Switcher (Individual vs Organization) */}
          {!sidebarCollapsed && (
            <div className="p-3 border-b border-slate-800/80">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-sidebar-muted)] mb-1.5">
                {language === 'id' ? 'Lingkungan Aktif' : 'Active Environment'}
              </div>
              <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xs bg-slate-950/60 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setEnvironment('INDIVIDUAL')}
                  className={cn(
                    'py-1.5 px-2 rounded-xs text-[11px] font-semibold transition-colors cursor-pointer truncate',
                    environment === 'INDIVIDUAL'
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'text-[var(--fg-sidebar-muted)] hover:text-white'
                  )}
                >
                  {language === 'id' ? 'Individu' : 'Personal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (entitlements.environmentAccess.includes('ORGANIZATION')) {
                      setEnvironment('ORGANIZATION')
                      setActiveModule('organization')
                    } else {
                      setActiveModule('settings')
                    }
                  }}
                  className={cn(
                    'py-1.5 px-2 rounded-xs text-[11px] font-semibold transition-colors cursor-pointer truncate',
                    environment === 'ORGANIZATION'
                      ? 'bg-[var(--color-secondary)] text-white'
                      : 'text-[var(--fg-sidebar-muted)] hover:text-white'
                  )}
                >
                  {language === 'id' ? 'Organisasi' : 'Organization'}
                </button>
              </div>
            </div>
          )}

          {/* Global Navigation Modules */}
          <nav className="p-2 space-y-0.5" aria-label="Global Navigation">
            {navItems.map((item) => {
              const isActive = activeModule === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModule(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xs text-xs font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-[var(--bg-sidebar-active)] text-white font-semibold sporty-accent-left'
                      : 'text-[var(--fg-sidebar)]/80 hover:bg-[var(--bg-sidebar-hover)] hover:text-white'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!sidebarCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono-code font-bold bg-slate-900/90 text-sky-400 border border-sky-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer Subscription Entitlement Status & User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[var(--fg-sidebar-muted)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Plan Entitlement</span>
                </span>
                <span className="font-mono-code font-bold text-xs px-1.5 py-0.5 rounded-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {entitlements.tier}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-1 border-t border-slate-800/60">
                <div className="h-7 w-7 rounded-xs bg-slate-800 flex items-center justify-center text-xs font-bold text-sky-300 font-mono-code">
                  AH
                </div>
                <div className="truncate leading-tight">
                  <div className="text-xs font-semibold text-white truncate">
                    Azkal Hafidz A.
                  </div>
                  <div className="text-[10px] text-[var(--fg-sidebar-muted)] font-mono-code truncate">
                    EUSR-1 • Karawang, ID
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <span className="h-7 w-7 rounded-xs bg-slate-800 flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono-code">
                {entitlements.tier[0]}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/70 backdrop-blur-[1px]"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="w-72 h-full bg-[var(--bg-sidebar)] text-white p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm tracking-wider">ARCHER PLATFORM</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-medium',
                      activeModule === item.id
                        ? 'bg-[var(--bg-sidebar-active)] text-white font-bold sporty-accent-left'
                        : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon}
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Contextual Header */}
        <header className="h-14 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-4 lg:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
          {/* Left: Mobile Menu Button + Contextual Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-1.5 rounded-xs border border-[var(--border-default)] text-[var(--fg-secondary)]"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs truncate">
              <Badge variant={environment === 'INDIVIDUAL' ? 'primary' : 'success'}>
                {environment === 'INDIVIDUAL'
                  ? t('app.environmentIndividual')
                  : t('app.environmentOrganization')}
              </Badge>
              <ChevronRight className="h-3.5 w-3.5 text-[var(--fg-muted)] shrink-0" />
              <span className="font-bold text-[var(--fg-primary)] truncate">
                {activeNavObj?.label}
              </span>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center justify-between gap-6 px-3 py-1.5 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] text-xs text-[var(--fg-muted)] hover:border-[var(--border-focus)] transition-colors cursor-pointer w-80 lg:w-96"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 text-[var(--color-accent)] shrink-0" />
              <span className="truncate">{t('app.commandHint')}</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono-code font-semibold bg-[var(--bg-card)] text-[var(--fg-secondary)] border border-[var(--border-default)] rounded-xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Right: Contextual Actions, Language Toggle, Theme Toggle, Quick Record */}
          <div className="flex items-center gap-2">
            {/* Explicit Dev Mock Indicator */}
            {isExplicitDevMock && (
              <button
                type="button"
                onClick={() => setActiveModule('settings')}
                className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] text-[10px] font-mono-code font-semibold text-[var(--color-warning)] cursor-pointer"
                title="Klik untuk melihat status kontrak API Kotlin & Pengawas ETL"
              >
                <Database className="h-3 w-3" />
                <span>{t('app.mockBadge')}</span>
              </button>
            )}

            {/* Strict Monthly Calendar Period Pill */}
            <div
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[var(--bg-muted)] border border-[var(--border-default)] text-[11px] font-mono-code text-[var(--fg-secondary)]"
              title={t('app.periodLabel')}
            >
              <CalendarClock className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              <span>{currentMonthPeriod.label}</span>
            </div>

            {/* Language Selector (id-ID / en-US) */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="h-8 px-2.5 rounded-xs border border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] flex items-center gap-1.5 text-xs font-mono-code font-semibold text-[var(--fg-primary)] cursor-pointer"
              title={t('settings.languageLabel')}
            >
              <Languages className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              <span>{language === 'id' ? 'ID' : 'EN'}</span>
            </button>

            {/* Theme Selector */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 rounded-xs border border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] flex items-center justify-center text-[var(--fg-primary)] cursor-pointer"
              title={t('settings.themeLabel')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--color-primary)]" />
              )}
            </button>

            {/* Primary CTA: Record Financial Event */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setNewTransactionModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {t('transactions.addTransaction')}
              </span>
            </Button>
          </div>
        </header>

        {/* Main Workspace Viewport */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto space-y-5">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      <CommandPalette />
      <NewEventModal />
    </div>
  )
}
