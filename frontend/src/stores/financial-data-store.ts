import { create } from 'zustand'
import type {
  AccountDetail,
  AccountOwnerDetail,
  AccountPlatformDetail,
  AiAssistantAdvisory,
  AnnualWealthMetric,
  BudgetCategoryItem,
  CategoryDetail,
  EtlBatchSupervisorRecord,
  EventTypeDetail,
  FinancialEventRecord,
  LocationDetail,
  MonthlyMtmSnapshot,
  OrganizationUnit,
  PaymentDetail,
  PortfolioBucket,
  WorkspaceEnvironment,
} from '@/types/financial'
import type { SupportedCurrency } from '@/lib/utils'
import {
  INITIAL_ACCOUNTS,
  INITIAL_AI_ADVISORIES,
  INITIAL_ANNUAL_WEALTH,
  INITIAL_BUDGET_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_ETL_RECORDS,
  INITIAL_EVENT_TYPES,
  INITIAL_FINANCIAL_EVENTS,
  INITIAL_LOCATIONS,
  INITIAL_MTM_HISTORY,
  INITIAL_ORGANIZATION,
  INITIAL_OWNERS,
  INITIAL_PAYMENTS,
  INITIAL_PLATFORMS,
  INITIAL_PORTFOLIO_BUCKETS,
  IS_EXPLICIT_DEV_MOCK_DATA,
} from '@/lib/api/mock-excel-dataset'

export interface NewFinancialEventInput {
  eventDate: string
  eventTypeId: string
  accountSourceId: string
  accountDestinationId: string
  paymentId: string
  categoryId: string
  description: string
  locationId: string
  actualCurrency: SupportedCurrency
  actualAmount: number
  exchangeRate: number
  noteContext?: string
  environment: WorkspaceEnvironment
}

interface FinancialDataState {
  isExplicitDevMock: boolean
  backendConnectionStatus: 'MOCK_SIMULATION' | 'CONNECTED_KOTLIN_API'
  platforms: AccountPlatformDetail[]
  owners: AccountOwnerDetail[]
  accounts: AccountDetail[]
  eventTypes: EventTypeDetail[]
  payments: PaymentDetail[]
  categories: CategoryDetail[]
  locations: LocationDetail[]
  events: FinancialEventRecord[]
  mtmHistory: MonthlyMtmSnapshot[]
  annualWealth: AnnualWealthMetric
  budgets: BudgetCategoryItem[]
  portfolioBuckets: PortfolioBucket[]
  aiAdvisories: AiAssistantAdvisory[]
  organization: OrganizationUnit
  etlRecords: EtlBatchSupervisorRecord[]

  // Actions
  addFinancialEvent: (input: NewFinancialEventInput) => void
  reconcileAccountBalance: (accountId: string, newActualBalance: number) => void
  applyAiBudgetRecommendation: (budgetId: string) => void
  updateBudgetAllocation: (budgetId: string, newAmountIdr: number) => void
  reviewAiAdvisory: (
    advisoryId: string,
    decision: 'APPROVED_BY_USER' | 'DISMISSED'
  ) => void
  addOrganizationCostCenterSpend: (code: string, spendIdr: number) => void
}

export const useFinancialDataStore = create<FinancialDataState>((set) => ({
  isExplicitDevMock: IS_EXPLICIT_DEV_MOCK_DATA,
  backendConnectionStatus: 'MOCK_SIMULATION',
  platforms: INITIAL_PLATFORMS,
  owners: INITIAL_OWNERS,
  accounts: INITIAL_ACCOUNTS,
  eventTypes: INITIAL_EVENT_TYPES,
  payments: INITIAL_PAYMENTS,
  categories: INITIAL_CATEGORIES,
  locations: INITIAL_LOCATIONS,
  events: INITIAL_FINANCIAL_EVENTS,
  mtmHistory: INITIAL_MTM_HISTORY,
  annualWealth: INITIAL_ANNUAL_WEALTH,
  budgets: INITIAL_BUDGET_ITEMS,
  portfolioBuckets: INITIAL_PORTFOLIO_BUCKETS,
  aiAdvisories: INITIAL_AI_ADVISORIES,
  organization: INITIAL_ORGANIZATION,
  etlRecords: INITIAL_ETL_RECORDS,

  addFinancialEvent: (input) =>
    set((state) => {
      const evType = state.eventTypes.find((e) => e.eventTypeId === input.eventTypeId)
      const baseAmount = Math.round(
        input.actualCurrency === 'IDR'
          ? input.actualAmount
          : input.actualAmount * input.exchangeRate
      )

      // Update source and destination account balances
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.accountId === input.accountSourceId && acc.isOwnedByUser) {
          const deltaNative =
            acc.currency === input.actualCurrency
              ? input.actualAmount
              : Math.round(baseAmount / (acc.currency === 'USD' ? 17587 : 1))
          const nextBal = acc.currentBalance - deltaNative
          const nextIdr = acc.currency === 'IDR' ? nextBal : Math.round(nextBal * 17587)
          return {
            ...acc,
            currentBalance: nextBal,
            balanceInIdr: nextIdr,
            lastReconciledAt: input.eventDate,
          }
        }
        if (acc.accountId === input.accountDestinationId && acc.isOwnedByUser) {
          const deltaNative =
            acc.currency === input.actualCurrency
              ? input.actualAmount
              : Math.round(baseAmount / (acc.currency === 'USD' ? 17587 : 1))
          const nextBal = acc.currentBalance + deltaNative
          const nextIdr = acc.currency === 'IDR' ? nextBal : Math.round(nextBal * 17587)
          return {
            ...acc,
            currentBalance: nextBal,
            balanceInIdr: nextIdr,
            lastReconciledAt: input.eventDate,
          }
        }
        return acc
      })

      const ownedAccounts = updatedAccounts.filter((a) => a.isOwnedByUser)
      const nextRunningSaldo = ownedAccounts
        .filter((a) => a.accountType === 'Liquid' || a.accountType === 'Foreign Currency')
        .reduce((sum, a) => sum + a.balanceInIdr, 0)

      const nextRunningTotalAsset = ownedAccounts.reduce(
        (sum, a) => sum + a.balanceInIdr,
        0
      )

      const srcAcc = state.accounts.find((a) => a.accountId === input.accountSourceId)
      const dstAcc = state.accounts.find((a) => a.accountId === input.accountDestinationId)
      const isInternalTransfer = Boolean(
        (srcAcc?.isOwnedByUser && dstAcc?.isOwnedByUser) ||
          evType?.generalEventTypeName === 'Internal' ||
          evType?.generalEventTypeName === 'Deposito'
      )

      const nextSeq = state.events.length + 101
      const newRecord: FinancialEventRecord = {
        uuid: crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now()}`,
        batchId: 'BTC-202611-LIVE',
        writtenAt: new Date().toISOString(),
        entryId: 'ETR-1',
        eventDate: input.eventDate,
        eventClassId:
          evType?.generalEventTypeName === 'Reconciliation'
            ? `MTM-${nextSeq}`
            : `TRX-${nextSeq}`,
        eventTypeId: input.eventTypeId,
        accountSourceId: input.accountSourceId,
        accountDestinationId: input.accountDestinationId,
        paymentId: input.paymentId,
        categoryId: input.categoryId,
        description: input.description,
        locationId: input.locationId,
        actualCurrency: input.actualCurrency,
        actualAmount: input.actualAmount,
        baseCurrency: 'IDR',
        exchangeRate: input.actualCurrency === 'IDR' ? 1 : input.exchangeRate,
        baseAmount,
        runningSaldo: nextRunningSaldo,
        runningTotalAsset: nextRunningTotalAsset,
        isInternalTransfer,
        noteContext: input.noteContext,
        environment: input.environment,
      }

      // If Expense, also reflect on matching budget item
      const updatedBudgets =
        evType?.specificEventTypeName === 'Expense'
          ? state.budgets.map((b) =>
              b.categoryId === input.categoryId
                ? { ...b, spentAmountIdr: b.spentAmountIdr + baseAmount }
                : b
            )
          : state.budgets

      return {
        accounts: updatedAccounts,
        events: [newRecord, ...state.events],
        budgets: updatedBudgets,
        annualWealth: {
          ...state.annualWealth,
          saldo: nextRunningSaldo,
          totalAsset: nextRunningTotalAsset,
          netWorth: nextRunningTotalAsset - state.annualWealth.totalLiabilities,
        },
      }
    }),

  reconcileAccountBalance: (accountId, newActualBalance) =>
    set((state) => {
      const target = state.accounts.find((a) => a.accountId === accountId)
      if (!target) return state

      const diffNative = newActualBalance - target.currentBalance
      if (diffNative === 0) return state

      const rate = target.currency === 'USD' ? 17587 : 1
      const newBalanceIdr = Math.round(newActualBalance * rate)
      const diffIdr = Math.abs(Math.round(diffNative * rate))
      const todayIso = '2026-11-16'

      const updatedAccounts = state.accounts.map((a) =>
        a.accountId === accountId
          ? {
              ...a,
              currentBalance: newActualBalance,
              balanceInIdr: newBalanceIdr,
              lastReconciledAt: todayIso,
            }
          : a
      )

      const ownedAccounts = updatedAccounts.filter((a) => a.isOwnedByUser)
      const nextRunningSaldo = ownedAccounts
        .filter((a) => a.accountType === 'Liquid' || a.accountType === 'Foreign Currency')
        .reduce((sum, a) => sum + a.balanceInIdr, 0)
      const nextRunningTotalAsset = ownedAccounts.reduce(
        (sum, a) => sum + a.balanceInIdr,
        0
      )

      const mtmEvent: FinancialEventRecord = {
        uuid: `mtm-${Date.now()}`,
        batchId: 'BTC-202611-MTM',
        writtenAt: new Date().toISOString(),
        entryId: 'ETR-1',
        eventDate: todayIso,
        eventClassId: `MTM-${state.events.length + 12}`,
        eventTypeId: 'EVTP-9',
        accountSourceId: diffNative >= 0 ? 'ACC-1' : accountId,
        accountDestinationId: diffNative >= 0 ? accountId : 'ACC-1',
        paymentId: 'PAY-1',
        categoryId: 'CAT-6',
        description: `Rekonsiliasi MTM Manual: ${target.accountName} (${diffNative >= 0 ? '+' : '-'}${target.currency} ${Math.abs(diffNative)})`,
        locationId: 'LCT-1',
        actualCurrency: target.currency,
        actualAmount: Math.abs(diffNative),
        baseCurrency: 'IDR',
        exchangeRate: rate,
        baseAmount: diffIdr,
        runningSaldo: nextRunningSaldo,
        runningTotalAsset: nextRunningTotalAsset,
        isInternalTransfer: false,
        environment: 'INDIVIDUAL',
      }

      return {
        accounts: updatedAccounts,
        events: [mtmEvent, ...state.events],
        annualWealth: {
          ...state.annualWealth,
          saldo: nextRunningSaldo,
          totalAsset: nextRunningTotalAsset,
          netWorth: nextRunningTotalAsset - state.annualWealth.totalLiabilities,
        },
      }
    }),

  applyAiBudgetRecommendation: (budgetId) =>
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.budgetId === budgetId
          ? { ...b, allocatedAmountIdr: b.aiRecommendedAmountIdr }
          : b
      ),
    })),

  updateBudgetAllocation: (budgetId, newAmountIdr) =>
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.budgetId === budgetId ? { ...b, allocatedAmountIdr: newAmountIdr } : b
      ),
    })),

  reviewAiAdvisory: (advisoryId, decision) =>
    set((state) => ({
      aiAdvisories: state.aiAdvisories.map((adv) =>
        adv.advisoryId === advisoryId ? { ...adv, status: decision } : adv
      ),
    })),

  addOrganizationCostCenterSpend: (code, spendIdr) =>
    set((state) => ({
      organization: {
        ...state.organization,
        totalTreasuryIdr: state.organization.totalTreasuryIdr - spendIdr,
        monthlyOperatingBurnIdr: state.organization.monthlyOperatingBurnIdr + spendIdr,
        costCenters: state.organization.costCenters.map((cc) =>
          cc.code === code ? { ...cc, utilizedIdr: cc.utilizedIdr + spendIdr } : cc
        ),
      },
    })),
}))
