import type { DashboardOverview } from '../domain/dashboard-overview.model'

export type DashboardStatus = 'loading' | 'ready' | 'error'

export interface DashboardState {
  status: DashboardStatus
  overview: DashboardOverview | null
  error: string | null
}

export type DashboardAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; overview: DashboardOverview }
  | { type: 'LOAD_ERROR'; error: string }

export const INITIAL_DASHBOARD_STATE: DashboardState = {
  status: 'loading',
  overview: null,
  error: null,
}
