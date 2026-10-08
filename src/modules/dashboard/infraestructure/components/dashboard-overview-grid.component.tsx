import { type JSX } from 'react'
import type { DashboardChartView } from '../../application/dashboard-chart.model'
import type { DashboardKpiCard } from '../../application/dashboard-kpi-card.model'
import type { DashboardCriticalStockItem } from '../../domain/dashboard-critical-stock-item.model'
import type { DashboardOverview } from '../../domain/dashboard-overview.model'
import type { DashboardPendingSignature } from '../../domain/dashboard-pending-signature.model'
import type { DashboardRecentActivity } from '../../domain/dashboard-recent-activity.model'
import { DashboardActivityCell } from './dashboard-activity-cell.component'
import { DashboardCriticalStockCell } from './dashboard-critical-stock-cell.component'
import { DashboardHighlightCell } from './dashboard-highlight-cell.component'
import { DashboardKpiList } from './dashboard-kpi-list.component'
import { DashboardPendingCell } from './dashboard-pending-cell.component'
import { DashboardRecentCell } from './dashboard-recent-cell.component'

interface Props {
  overview: DashboardOverview
  kpiCards: DashboardKpiCard[]
  chart: DashboardChartView
  onViewAssignments: () => void
  onOpenActivity: (activity: DashboardRecentActivity) => void
  onSignPending: (signature: DashboardPendingSignature) => void
  onOpenProduct: (item: DashboardCriticalStockItem) => void
}

export function DashboardOverviewGrid({
  overview,
  kpiCards,
  chart,
  onViewAssignments,
  onOpenActivity,
  onSignPending,
  onOpenProduct,
}: Props): JSX.Element {
  return (
    <div className="mt-6 grid grid-cols-6 gap-3.5 [grid-auto-flow:dense]">
      <DashboardHighlightCell kpis={overview.kpis} onViewAssignments={onViewAssignments} />
      <DashboardActivityCell chart={chart} />
      <DashboardKpiList cards={kpiCards} />
      <DashboardRecentCell
        activities={overview.recent}
        onOpenActivity={onOpenActivity}
        onViewAssignments={onViewAssignments}
      />
      <DashboardPendingCell signatures={overview.pendingSignatures} onSign={onSignPending} />
      <DashboardCriticalStockCell items={overview.criticalStock} onOpenProduct={onOpenProduct} />
    </div>
  )
}
