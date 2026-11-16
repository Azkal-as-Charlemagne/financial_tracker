import * as React from 'react'
import {
  Search,
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  PieChart,
  TrendingUp,
  Briefcase,
  Building2,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  Languages,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore, type ActiveModuleId } from '@/stores/app-store'
import { useFinancialDataStore } from '@/stores/financial-data-store'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui'

export function CommandPalette() {
  const { t } = useTranslation()
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveModule,
    setNewTransactionModalOpen,
    language,
    setLanguage,
    theme,
    setTheme,
    locale,
    setEnvironment,
  } = useAppStore()
  const { accounts, events } = useFinancialDataStore()
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  if (!commandPaletteOpen) return null

  const modules: { id: ActiveModuleId; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="h-4 w-4" />, shortcut: 'G D' },
    { id: 'transactions', label: t('nav.transactions'), icon: <ArrowRightLeft className="h-4 w-4" />, shortcut: 'G T' },
    { id: 'accounts', label: t('nav.accounts'), icon: <Wallet className="h-4 w-4" />, shortcut: 'G A' },
    { id: 'budgets', label: t('nav.budgets'), icon: <PieChart className="h-4 w-4" />, shortcut: 'G B' },
    { id: 'analytics', label: t('nav.analytics'), icon: <TrendingUp className="h-4 w-4" />, shortcut: 'G M' },
    { id: 'investments', label: t('nav.investments'), icon: <Briefcase className="h-4 w-4" />, shortcut: 'G I' },
    { id: 'organization', label: t('nav.organization'), icon: <Building2 className="h-4 w-4" />, shortcut: 'G O' },
    { id: 'settings', label: t('nav.settings'), icon: <Settings className="h-4 w-4" />, shortcut: 'G S' },
  ]

  const q = query.trim().toLowerCase()
  const filteredModules = modules.filter((m) => m.label.toLowerCase().includes(q))
  const filteredAccounts = accounts
    .filter((a) => a.isOwnedByUser && (a.accountName.toLowerCase().includes(q) || a.accountId.toLowerCase().includes(q)))
    .slice(0, 4)
  const filteredEvents = events
    .filter(
      (ev) =>
        ev.description.toLowerCase().includes(q) ||
        ev.eventClassId.toLowerCase().includes(q)
    )
    .slice(0, 4)

  const runAndClose = (fn: () => void) => {
    fn()
    setCommandPaletteOpen(false)
    setQuery('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-[1px] pt-20 px-4"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-xs bg-[var(--bg-card)] border border-[var(--border-default)] shadow-md overflow-hidden sporty-accent-top"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search className="h-4 w-4 text-[var(--color-accent)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('app.commandHint')}
            className="w-full bg-transparent text-xs text-[var(--fg-primary)] placeholder:text-[var(--fg-placeholder)] focus:outline-none"
          />
          <Badge variant="mono">ESC</Badge>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
              {language === 'id' ? 'Aksi Cepat & Kontekstual' : 'Quick & Contextual Actions'}
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => runAndClose(() => setNewTransactionModalOpen(true))}
                className="flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium">
                  <PlusCircle className="h-4 w-4 text-[var(--color-secondary)]" />
                  {t('transactions.addTransaction')}
                </span>
                <Badge variant="mono">N</Badge>
              </button>
              <button
                type="button"
                onClick={() =>
                  runAndClose(() => setLanguage(language === 'id' ? 'en' : 'id'))
                }
                className="flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-[var(--color-accent)]" />
                  {language === 'id'
                    ? 'Ganti Bahasa ke English (en-US)'
                    : 'Switch Language to Bahasa Indonesia (id-ID)'}
                </span>
                <Badge variant="info">{language.toUpperCase()}</Badge>
              </button>
              <button
                type="button"
                onClick={() =>
                  runAndClose(() => setTheme(theme === 'dark' ? 'light' : 'dark'))
                }
                className="flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-[var(--color-primary)]" />
                  )}
                  {language === 'id' ? 'Alihkan Tema Terang / Gelap' : 'Toggle Light / Dark Theme'}
                </span>
                <Badge variant="default">{theme.toUpperCase()}</Badge>
              </button>
              <button
                type="button"
                onClick={() =>
                  runAndClose(() => {
                    setEnvironment('ORGANIZATION')
                    setActiveModule('organization')
                  })
                }
                className="flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
                  {language === 'id'
                    ? 'Buka Lingkungan Keuangan Organisasi (PT Archer)'
                    : 'Switch to Organization Financial Workspace'}
                </span>
                <Badge variant="default">ORG</Badge>
              </button>
            </div>
          </div>

          {/* Navigation Modules */}
          {filteredModules.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                {language === 'id' ? 'Navigasi Modul' : 'Application Modules'}
              </div>
              <div className="space-y-0.5">
                {filteredModules.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => runAndClose(() => setActiveModule(m.id))}
                    className="flex w-full items-center justify-between rounded-xs px-2.5 py-2 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {m.icon}
                      {m.label}
                    </span>
                    <Badge variant="mono">{m.shortcut}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Owned Accounts */}
          {filteredAccounts.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                {language === 'id' ? 'Akun Internal & Valuasi' : 'Owned Accounts & Valuation'}
              </div>
              <div className="space-y-0.5">
                {filteredAccounts.map((acc) => (
                  <button
                    key={acc.accountId}
                    type="button"
                    onClick={() => runAndClose(() => setActiveModule('accounts'))}
                    className="flex w-full items-center justify-between rounded-xs px-2.5 py-1.5 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Badge variant="mono">{acc.accountId}</Badge>
                      <span>{acc.accountName}</span>
                    </span>
                    <span className="font-mono-code font-semibold">
                      {formatCurrency(acc.currentBalance, acc.currency, locale)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">
                {language === 'id' ? 'Jurnal Peristiwa Keuangan' : 'Financial Event Records'}
              </div>
              <div className="space-y-0.5">
                {filteredEvents.map((ev) => (
                  <button
                    key={ev.uuid}
                    type="button"
                    onClick={() => runAndClose(() => setActiveModule('transactions'))}
                    className="flex w-full items-center justify-between rounded-xs px-2.5 py-1.5 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Badge variant="mono">{ev.eventClassId}</Badge>
                      <span className="truncate">{ev.description}</span>
                    </span>
                    <span className="font-mono-code font-semibold">
                      {formatCurrency(ev.baseAmount, 'IDR', locale)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
