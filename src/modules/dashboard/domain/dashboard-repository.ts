import type { DashboardOverview } from './dashboard-overview.model'

export interface DashboardRepository {
  getOverview(): Promise<DashboardOverview>
}
