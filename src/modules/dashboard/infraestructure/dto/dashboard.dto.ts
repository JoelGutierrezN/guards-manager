export interface DashboardKpisDto {
  toolsTotal?: number
  toolsAvailable?: number
  toolsAssigned?: number
  toolsUnusable?: number
  employeesActive?: number
  custodiesActive?: number
  pendingSignatures?: number
  alerts?: number
  criticalStockProducts?: number
}

export interface DashboardSeriesPointDto {
  weekStart?: string
  assignments?: number
  returns?: number
}

export interface DashboardRecentActivityDto {
  type?: string
  code?: string
  employeeName?: string
  employeeId?: string
  itemsCount?: number
  date?: string
  custodyId?: string
}

export interface DashboardPendingSignatureDto {
  id?: string
  type?: string
  code?: string
  employeeName?: string
  date?: string
  custodyId?: string
}

export interface DashboardCriticalStockItemDto {
  productId?: string
  name?: string
  brandName?: string | null
  available?: number
  threshold?: number
}

export interface DashboardOverviewDto {
  kpis?: DashboardKpisDto
  series?: DashboardSeriesPointDto[]
  recent?: DashboardRecentActivityDto[]
  pendingSignatures?: DashboardPendingSignatureDto[]
  criticalStock?: DashboardCriticalStockItemDto[]
}
