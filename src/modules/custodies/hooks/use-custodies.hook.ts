import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import type { CustodiesFilters } from '../domain/custodies-filters.model'
import { custodiesReducer } from '../application/custodies.reducer'
import { CustodiesStatsHelper } from '../application/custodies-stats.helper'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'
import { CustodyErrorHelper } from '../infraestructure/helpers/custody-error.helper'
import {
  CustodyQueryParamsHelper,
  type CustodiesListRequest,
} from '../infraestructure/helpers/custody-query-params.helper'

const SEARCH_DEBOUNCE_MS = 250

export function useCustodies() {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(
    custodiesReducer,
    params,
    CustodyQueryParamsHelper.initialStateFrom,
  )
  const { page, query, filters } = state
  const requestRef = useRef<CustodiesListRequest>({ page, query, filters })

  useEffect(() => {
    requestRef.current = { page, query, filters }
  }, [page, query, filters])

  useEffect(() => {
    setQueryParams(CustodyQueryParamsHelper.toParams({ page, query, filters }))
  }, [page, query, filters, setQueryParams])

  const load = useCallback(async (request: CustodiesListRequest) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await custodiesRepository.list(CustodyQueryParamsHelper.toApiParams(request))
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', error: CustodyErrorHelper.listMessageFrom(error) })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load({ page, query, filters })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [page, query, filters, load])

  const reloadList = useCallback(() => {
    void load(requestRef.current)
  }, [load])

  const setPage = useCallback(
    (nextPage: number) => dispatch({ type: 'SET_PAGE', page: nextPage }),
    [],
  )
  const setQuery = useCallback(
    (nextQuery: string) => dispatch({ type: 'SET_QUERY', query: nextQuery }),
    [],
  )
  const clearQuery = useCallback(() => dispatch({ type: 'SET_QUERY', query: '' }), [])
  const setFilters = useCallback(
    (nextFilters: Partial<CustodiesFilters>) =>
      dispatch({ type: 'SET_FILTERS', filters: nextFilters }),
    [],
  )
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), [])

  const kpis = useMemo(
    () => ({
      total: CustodiesStatsHelper.quantityLabel(state.stats, 'total'),
      active: CustodiesStatsHelper.quantityLabel(state.stats, 'active'),
      partial: CustodiesStatsHelper.quantityLabel(state.stats, 'partial'),
      returned: CustodiesStatsHelper.quantityLabel(state.stats, 'returned'),
      activePercent: CustodiesStatsHelper.activePercentLabel(state.stats),
      lede: CustodiesStatsHelper.ledeText(state.stats),
    }),
    [state.stats],
  )

  return {
    state,
    kpis,
    reloadList,
    setPage,
    setQuery,
    clearQuery,
    setFilters,
    clearFilters,
  }
}
