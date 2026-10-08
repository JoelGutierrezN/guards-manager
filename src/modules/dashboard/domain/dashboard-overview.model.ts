import type { DashboardCriticalStockItem } from './dashboard-critical-stock-item.model'
import type { DashboardKpis } from './dashboard-kpis.model'
import type { DashboardPendingSignature } from './dashboard-pending-signature.model'
import type { DashboardRecentActivity } from './dashboard-recent-activity.model'
import type { DashboardSeriesPoint } from './dashboard-series-point.model'

export interface DashboardOverview {
  kpis: DashboardKpis
  series: DashboardSeriesPoint[]
  recent: DashboardRecentActivity[]
  pendingSignatures: DashboardPendingSignature[]
  criticalStock: DashboardCriticalStockItem[]
}
