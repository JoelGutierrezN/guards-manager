export interface ToolsKpis {
  total: string
  totalDelta: string
  available: string
  availableDelta: string
  assigned: string
  assignedDelta: string
  maintenance: string
  maintenanceDelta: string
  critical: string
  criticalDelta: string
}

export interface ToolsStockRange {
  min: number
  max: number
}

export interface ToolsStats {
  kpis: ToolsKpis
  statusCounts: Record<string, number>
  brandCounts: Record<string, number>
  totalCount: number
  pageCount: number
  stockRange: ToolsStockRange
}
