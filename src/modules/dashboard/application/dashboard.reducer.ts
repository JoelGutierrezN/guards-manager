import type { DashboardAction, DashboardState } from './dashboard-state.model'

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return { status: 'ready', overview: action.overview, error: null }
    case 'LOAD_ERROR':
      return { status: 'error', overview: null, error: action.error }
    default:
      return state
  }
}
