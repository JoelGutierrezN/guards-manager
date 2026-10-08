import type { DashboardActivityType } from './dashboard-activity-type.model'

export interface DashboardRecentActivity {
  type: DashboardActivityType
  code: string
  employeeName: string
  employeeId: string
  itemsCount: number
  date: string
  custodyId: string
}
