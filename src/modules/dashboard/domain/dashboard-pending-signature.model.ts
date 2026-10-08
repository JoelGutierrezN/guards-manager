import type { DashboardActivityType } from './dashboard-activity-type.model'

export interface DashboardPendingSignature {
  id: string
  type: DashboardActivityType
  code: string
  employeeName: string
  date: string
  custodyId: string
}
