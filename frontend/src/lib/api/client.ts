/**
 * Kotlin Spring Boot API Contract Layer
 * Respects existing backend architecture without inventing unauthorized business rules.
 * Uses VITE_API_BASE_URL (with fallback to http://localhost:8080) as standardized across the monorepo.
 */
export const KOTLIN_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  entitlements: '/api/v1/auth/entitlements',
  financialEvents: '/api/v1/ledger/financial-events',
  accounts: '/api/v1/accounts',
  reconcileMtm: '/api/v1/accounts/reconcile-mtm',
  mtmMonthlySnapshots: '/api/v1/intelligence/mtm-snapshots',
  annualWealthPkt: '/api/v1/intelligence/annual-wealth',
  budgets: '/api/v1/budgets',
  portfolioAllocation: '/api/v1/investments/portfolio-buckets',
  aiAdvisories: '/api/v1/assistant/advisories',
  organizations: '/api/v1/organizations',
  etlSupervisor: '/api/v1/system/etl-records',
} as const

export async function fetchFromKotlinBackend<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('archer_access_token')
  const headers = new Headers(options?.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${KOTLIN_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`Kotlin Backend HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
