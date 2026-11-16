import type { SupportedCurrency } from '@/lib/utils'

/**
 * Subscription & Backend Entitlements
 * Controlled by Kotlin Backend; UI reflects dynamically without hardcoding restrictions.
 */
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE'
export type WorkspaceEnvironment = 'INDIVIDUAL' | 'ORGANIZATION'

export interface UserEntitlements {
  tier: SubscriptionTier
  environmentAccess: WorkspaceEnvironment[]
  features: {
    multiCurrencyValuation: boolean
    aiBudgetAssistant: boolean
    aiInvestmentAdvisor: boolean
    aiLiabilityGuard: boolean
    organizationLedger: boolean
    customExportAudit: boolean
    advancedMtmAnalytics: boolean
  }
  quotas: {
    maxAccounts: number | null
    maxOrganizations: number | null
  }
}

/**
 * Relational Lookup Entities (Direct mapping from tracker_financial_and_economy.xlsx
 * and Prototype_Database_SQL_Archer_V1.xlsx)
 */
export interface AccountPlatformDetail {
  accountPlatformId: string // e.g., APLT-1 .. APLT-9
  platformType:
    | 'Fund Management'
    | 'Bank'
    | 'Digital Bank'
    | 'E-wallet'
    | 'Investment Platform'
    | 'Physical Cash'
    | 'RDN wallet'
    | 'Monthly-MTM'
    | 'Unknown'
  platformName: string // e.g., Jago, Krom, SeaBank, Bibit, Dana, Gopay, Shopeepay, Cash
}

export interface AccountOwnerDetail {
  accountOwnerId: string // e.g., AOWN-1
  ownerType: 'Individu' | 'Instansi' | 'Unknown'
  ownerName: string // e.g., Azkal Hafidz Annabawi, Ibu, Warung Madura, SPBU Pertamina
}

export interface AccountDetail {
  accountId: string // e.g., ACC-1 .. ACC-15
  accountName: string
  accountType: 'Liquid' | 'Investment' | 'Deposito' | 'Foreign Currency' | 'External Counterparty' | 'System MTM'
  accountSequence: number
  currency: SupportedCurrency
  accountPlatformId: string
  accountOwnerId: string
  currentBalance: number
  balanceInIdr: number
  isOwnedByUser: boolean
  lastReconciledAt: string
}

export type GeneralEventTypeName =
  | 'Opening'
  | 'Inflow'
  | 'Outflow'
  | 'Internal'
  | 'Deposito'
  | 'Reconciliation'

export type SpecificEventTypeName =
  | 'Opening Balance'
  | 'Income'
  | 'Expense'
  | 'Transfer'
  | 'Investment'
  | 'Investment Return'
  | 'Redemption'
  | 'Placement'
  | 'Withdrawal'
  | 'Fee'

export interface EventTypeDetail {
  eventTypeId: string // e.g., EVTP-1 .. EVTP-9
  generalEventTypeId: string // GETP-1 .. GETP-6
  generalEventTypeName: GeneralEventTypeName
  specificEventTypeId: string // SETP-1 .. SETP-9
  specificEventTypeName: SpecificEventTypeName
}

export interface PaymentDetail {
  paymentId: string // PAY-1 .. PAY-13
  paymentMethodId: string // PAM-1 .. PAM-8
  paymentMethodName: string // Cash, QRIS, Inter-Bank Transfer, Intra-Bank Transfer, Direct Debit, Virtual Account
  paymentChannelId: string // PAC-1 .. PAC-8
  paymentChannelName: string // In Person, Mobile Banking, Digital Wallet, Wealthtech, Over The Counter, Core Bank System
}

export interface CategoryDetail {
  categoryId: string // CAT-1 .. CAT-25
  mainCategoryId: string // MCAT-1 .. MCAT-12
  mainCategoryName: string // Investment Product, Food & Beverage, Transportation, Allowance, Side Hustle, Banking, etc.
  subCategoryId: string // SCAT-1 .. SCAT-25
  subCategoryName: string // Mutual Fund, Fuel, Local Food, Coffee, Pocket Money, Freelancing, Transfer Fee, etc.
}

export interface LocationDetail {
  locationId: string // LCT-1 .. LCT-9
  country: string
  province: string
  regency: string
  district: string
}

/**
 * Core Double-Entry Financial Event Record (`financial_events` / `Main_Tabel`)
 */
export interface FinancialEventRecord {
  uuid: string
  batchId: string
  writtenAt: string
  entryId: string
  eventDate: string // ISO YYYY-MM-DD
  eventClassId: string // TRX-1, MTM-1, FEE-1
  eventTypeId: string
  accountSourceId: string
  accountDestinationId: string
  paymentId: string
  categoryId: string
  description: string
  locationId: string
  actualCurrency: SupportedCurrency
  actualAmount: number
  baseCurrency: 'IDR'
  exchangeRate: number
  baseAmount: number
  runningSaldo: number // Liquid cash balance after event
  runningTotalAsset: number // Total asset balance including investments after event
  isInternalTransfer: boolean
  receiptUrl?: string
  noteContext?: string
  environment: WorkspaceEnvironment
}

/**
 * Monthly Mark-to-Market & Maintenance History (`MTM_Detail` & `Maintenance_History.xlsx`)
 */
export interface MonthlyMtmSnapshot {
  yearId: string // PKT-1
  eventClassId: string // MTM-1 .. MTM-12
  monthName: string
  monthIndex: number // 1..12
  year: number
  saldoBulanIni: number
  totalAssetBulanIni: number
  investmentReturn: number
  investmentReturnPercent: number
  capitalGrowth: number
  capitalGrowthPercent: number
  organicGrowth: number
  organicGrowthPercent: number
  averageMonthlyGrowthPercent: number
  cagrMonthlyGrowthPercent: number
  noteContext?: string
}

/**
 * Annual Wealth & Macroeconomic Real Return (`Pertumbuhan_Kekayaan_Tahunan` & `Tracker_Kekayaan_Tahunan.xlsx`)
 */
export interface AnnualWealthMetric {
  eventClassId: string // PKT-1
  year: number
  saldo: number
  totalAsset: number
  totalLiabilities: number
  netWorth: number
  nominalReturnPercent: number
  localInflationBiPercent: number // Bank Indonesia YoY
  localInflationEffectPercent: number
  globalInflationUsCpiPercent: number // US CPI YoY
  globalInflationEffectPercent: number
  idrDepreciationPercent: number // Kurs USD/IDR change
  idrDepreciationEffectPercent: number
  weightedInflationPercent: number
  taxAndFrictionPercent: number
  realReturnPercent: number
  kpiTargetPercent: number // Default 9.0% from Tracker_Short_KPI
  sourceCitation: string
}

/**
 * Budgeting & AI Assistant Module
 */
export interface BudgetCategoryItem {
  budgetId: string
  categoryId: string
  mainCategoryName: string
  subCategoryName: string
  allocatedAmountIdr: number
  spentAmountIdr: number
  aiRecommendedAmountIdr: number
  aiRationaleId: string
  aiRationaleEn: string
  isEssential: boolean
}

/**
 * Investment Intelligence & Portfolio Buckets (`Tracker_Short_KPI`)
 */
export interface PortfolioBucket {
  bucketId: 'SSSF' | 'EQUITY' | 'EXPLORE'
  bucketCode: string
  nameId: string
  nameEn: string
  targetAllocationPercent: number
  currentAllocationPercent: number
  currentValueIdr: number
  weightedReturnPercent: number
  instruments: {
    code: string
    name: string
    platform: string
    currency: SupportedCurrency
    unitsOrAmount: number
    valueIdr: number
    returnPercent: number
  }[]
}

/**
 * AI Financial Assistant Recommendation (Strictly Advisory — Never Auto-Executes)
 */
export interface AiAssistantAdvisory {
  advisoryId: string
  domain: 'BUDGETING' | 'LIABILITY_RECEIVABLE' | 'INVESTMENT_ALLOCATION'
  titleId: string
  titleEn: string
  summaryId: string
  summaryEn: string
  impactMetric: string
  confidenceLevel: 'HIGH' | 'MEDIUM'
  status: 'PENDING_REVIEW' | 'APPROVED_BY_USER' | 'DISMISSED'
}

/**
 * Organization Financial Management
 */
export interface OrganizationMember {
  memberId: string
  fullName: string
  email: string
  role: 'OWNER' | 'FINANCE_CONTROLLER' | 'AUDITOR' | 'MEMBER'
  department: string
  allocationLimitIdr: number
  status: 'ACTIVE' | 'INVITED'
}

export interface OrganizationUnit {
  orgId: string
  orgName: string
  legalEntityType: string
  taxIdNpwp: string
  baseCurrency: SupportedCurrency
  totalTreasuryIdr: number
  monthlyOperatingBurnIdr: number
  receivablesIdr: number
  payablesIdr: number
  members: OrganizationMember[]
  costCenters: {
    code: string
    name: string
    allocatedBudgetIdr: number
    utilizedIdr: number
    ownerName: string
  }[]
}

/**
 * ETL Batch & Audit Supervisor (`tabel_pengawas.xlsx`)
 */
export interface EtlBatchSupervisorRecord {
  etlRecordId: string
  ticketBatchId: string
  triggeredBy: string
  recordType: 'EXCEL_SYNC' | 'API_INGEST' | 'MTM_RECONCILE'
  recordStartAt: string
  recordEndAt: string
  totalDetected: number
  totalInserted: number
  totalFail: number
  lastSuccessEntry: string
  batchStatus: 'SUCCESS' | 'PARTIAL_WARN' | 'FAILED'
  message: string
}
