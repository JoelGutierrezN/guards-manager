import { useCallback, useEffect, useReducer } from 'react'
import type { ToolsStats } from '../domain/tools-stats.entity'
import type { CatalogTree } from '../domain/catalog-option.model'
import { toolsRepository } from '../infraestructure/repositories/tools.repository'

export type OverviewStatus = 'loading' | 'ready' | 'error'

interface OverviewState {
  stats: ToolsStats | null
  catalog: CatalogTree | null
  status: OverviewStatus
}

type OverviewAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; stats: ToolsStats; catalog: CatalogTree }
  | { type: 'FETCH_ERROR' }

function overviewReducer(state: OverviewState, action: OverviewAction): OverviewState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading' }
    case 'FETCH_SUCCESS':
      return { stats: action.stats, catalog: action.catalog, status: 'ready' }
    case 'FETCH_ERROR':
      return { ...state, status: 'error' }
  }
}

const initialState: OverviewState = {
  stats: null,
  catalog: null,
  status: 'loading',
}

export function useToolsOverview() {
  const [state, dispatch] = useReducer(overviewReducer, initialState)

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const [stats, catalog] = await Promise.all([
        toolsRepository.getStats(),
        toolsRepository.getCatalogTree(),
      ])
      dispatch({ type: 'FETCH_SUCCESS', stats, catalog })
    } catch {
      dispatch({ type: 'FETCH_ERROR' })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    stats: state.stats,
    catalog: state.catalog,
    status: state.status,
    reload: load,
  }
}
