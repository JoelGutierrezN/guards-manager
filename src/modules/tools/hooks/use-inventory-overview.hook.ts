import { useCallback, useEffect, useReducer } from 'react'
import type { InventoryStats } from '../domain/inventory-stats.entity'
import type { CatalogTree } from '../domain/catalog-option.model'
import { inventoryRepository } from '../infraestructure/repositories/inventory.repository'
import { useHandleApiError } from '../../shared/infraestructure/errors/use-handle-api-error.hook'
import { useAuth } from '../../auth/hooks/use-auth.hook'

export type OverviewStatus = 'loading' | 'ready' | 'error'

interface OverviewState {
  stats: InventoryStats | null
  catalog: CatalogTree | null
  status: OverviewStatus
}

type OverviewAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; stats: InventoryStats; catalog: CatalogTree }
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

export function useInventoryOverview() {
  const [state, dispatch] = useReducer(overviewReducer, initialState)
  const { dispatch: authDispatch } = useAuth()
  const handleApiError = useHandleApiError(authDispatch)

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const [stats, catalog] = await Promise.all([
        inventoryRepository.getStats(),
        inventoryRepository.getCatalogTree(),
      ])
      dispatch({ type: 'FETCH_SUCCESS', stats, catalog })
    } catch (error) {
      try {
        handleApiError(error)
      } catch {
        dispatch({ type: 'FETCH_ERROR' })
      }
    }
  }, [handleApiError])

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
