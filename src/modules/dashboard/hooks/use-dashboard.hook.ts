import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { DashboardChartHelper } from '../application/dashboard-chart.helper'
import { DashboardKpiCardsHelper } from '../application/dashboard-kpi-cards.helper'
import { DashboardSummaryHelper } from '../application/dashboard-summary.helper'
import { dashboardReducer } from '../application/dashboard.reducer'
import { INITIAL_DASHBOARD_STATE } from '../application/dashboard-state.model'
import { DashboardErrorHelper } from '../infraestructure/helpers/dashboard-error.helper'
import { dashboardRepository } from '../infraestructure/repositories/dashboard.repository'

export function useDashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_DASHBOARD_STATE)
  const { overview } = state

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })
    try {
      const loadedOverview = await dashboardRepository.getOverview()
      dispatch({ type: 'LOAD_SUCCESS', overview: loadedOverview })
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', error: DashboardErrorHelper.overviewMessageFrom(error) })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const reload = useCallback(() => {
    void load()
  }, [load])

  const kpiCards = useMemo(
    () => (overview === null ? [] : DashboardKpiCardsHelper.build(overview.kpis)),
    [overview],
  )

  const chart = useMemo(
    () => DashboardChartHelper.build(overview === null ? [] : overview.series),
    [overview],
  )

  const lede = useMemo(
    () => (overview === null ? '' : DashboardSummaryHelper.ledeFrom(overview.kpis)),
    [overview],
  )

  return { state, kpiCards, chart, lede, reload }
}
