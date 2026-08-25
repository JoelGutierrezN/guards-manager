import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { employeesReducer } from '../application/employees.reducer'
import { EmployeesStatsHelper } from '../application/employees-stats.helper'
import { employeesRepository } from '../infrastructure/repositories/employees.repository'
import {
  EmployeeQueryParamsHelper,
  type EmployeesListRequest,
} from '../infrastructure/helpers/employee-query-params.helper'

const SEARCH_DEBOUNCE_MS = 250

export function useEmployees() {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(
    employeesReducer,
    params,
    EmployeeQueryParamsHelper.initialStateFrom,
  )
  const requestRef = useRef<EmployeesListRequest>({ page: state.page, query: state.query })

  useEffect(() => {
    requestRef.current = { page: state.page, query: state.query }
  }, [state.page, state.query])

  useEffect(() => {
    setQueryParams(EmployeeQueryParamsHelper.toParams({ page: state.page, query: state.query }))
  }, [state.page, state.query, setQueryParams])

  const load = useCallback(async (request: EmployeesListRequest) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await employeesRepository.list(EmployeeQueryParamsHelper.toApiParams(request))
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch {
      dispatch({ type: 'LOAD_ERROR', error: 'No se pudo cargar el personal.' })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load({ page: state.page, query: state.query })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [state.page, state.query, load])

  const reloadList = useCallback(() => {
    void load(requestRef.current)
  }, [load])

  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const setQuery = useCallback((query: string) => dispatch({ type: 'SET_QUERY', query }), [])
  const clearQuery = useCallback(() => dispatch({ type: 'SET_QUERY', query: '' }), [])

  const kpis = useMemo(
    () => ({
      total: EmployeesStatsHelper.quantityLabel(state.stats, 'totalEmployees'),
      withActiveTools: EmployeesStatsHelper.quantityLabel(state.stats, 'withActiveTools'),
      withAlerts: EmployeesStatsHelper.quantityLabel(state.stats, 'withAlerts'),
      assignedPercent: EmployeesStatsHelper.assignedPercentLabel(state.stats),
      lede: EmployeesStatsHelper.ledeText(state.stats),
    }),
    [state.stats],
  )

  return { state, kpis, reloadList, setPage, setQuery, clearQuery }
}
