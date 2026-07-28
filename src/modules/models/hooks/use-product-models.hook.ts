import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { modelsReducer } from '../application/models.reducer'
import { productModelRepository } from '../infraestructure/repositories/product-model.repository'
import { ModelsQueryParamsHelper } from '../infraestructure/helpers/models-query-params.helper'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'

const SEARCH_DEBOUNCE_MS = 250

export function useProductModels(brandId: string | null) {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(modelsReducer, params, ModelsQueryParamsHelper.initialStateFrom)
  const requestRef = useRef({ page: state.page, query: state.query, brandId: state.brandId })

  useEffect(() => {
    requestRef.current = { page: state.page, query: state.query, brandId: state.brandId }
  }, [state.page, state.query, state.brandId])

  useEffect(() => {
    if (brandId !== state.brandId) {
      dispatch({ type: 'SET_BRAND', brandId })
    }
  }, [brandId, state.brandId])

  useEffect(() => {
    setQueryParams(ModelsQueryParamsHelper.toParams({ page: state.page, query: state.query }))
  }, [state.page, state.query, setQueryParams])

  const load = useCallback(async (request: { page: number; query: string; brandId: string | null }) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await productModelRepository.list(ModelsQueryParamsHelper.toApiParams(request))
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch {
      dispatch({ type: 'LOAD_ERROR', error: 'No se pudieron cargar los modelos.' })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load({ page: state.page, query: state.query, brandId: state.brandId })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [state.page, state.query, state.brandId, load])

  const reload = useCallback(() => {
    void load(requestRef.current)
  }, [load])

  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const setQuery = useCallback((query: string) => dispatch({ type: 'SET_QUERY', query }), [])

  const showSkeletons = state.status === 'loading' || state.status === 'reloading'
  const skeletonSlots = useMemo(() => [...Array(state.perPage).keys()], [state.perPage])

  return {
    state,
    showSkeletons,
    skeletonSlots,
    reload,
    setPage,
    setQuery,
  }
}
