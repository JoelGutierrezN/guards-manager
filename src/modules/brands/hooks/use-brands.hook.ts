import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { Brand } from '../domain/brand.entity'
import { brandsReducer } from '../application/brands.reducer'
import { INITIAL_BRANDS_STATE } from '../application/brands-state.model'
import { brandRepository } from '../infraestructure/repositories/brand.repository'

const SEARCH_DEBOUNCE_MS = 250

export function useBrands() {
  const [state, dispatch] = useReducer(brandsReducer, INITIAL_BRANDS_STATE)
  const requestRef = useRef({ page: state.page, query: state.query })
  requestRef.current = { page: state.page, query: state.query }

  const load = useCallback(async (page: number, query: string) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const result = await brandRepository.list(page, query)
      dispatch({ type: 'LOAD_SUCCESS', result })
    } catch {
      dispatch({ type: 'LOAD_ERROR', error: 'No se pudieron cargar las marcas.' })
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      void load(state.page, state.query)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [state.page, state.query, load])

  const reload = useCallback(() => {
    void load(requestRef.current.page, requestRef.current.query)
  }, [load])

  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const setQuery = useCallback((query: string) => dispatch({ type: 'SET_QUERY', query }), [])
  const openCreate = useCallback(() => dispatch({ type: 'OPEN_CREATE' }), [])
  const closeCreate = useCallback(() => dispatch({ type: 'CLOSE_CREATE' }), [])
  const openEdit = useCallback((brand: Brand) => dispatch({ type: 'OPEN_EDIT', brand }), [])
  const closeEdit = useCallback(() => dispatch({ type: 'CLOSE_EDIT' }), [])

  const createBrand = useCallback(
    async (name: string): Promise<boolean> => {
      dispatch({ type: 'SAVE_START' })
      try {
        await brandRepository.create({ name })
        dispatch({ type: 'SAVE_DONE' })
        await load(requestRef.current.page, requestRef.current.query)
        return true
      } catch {
        dispatch({ type: 'SAVE_ERROR' })
        return false
      }
    },
    [load],
  )

  const renameBrand = useCallback(
    async (id: string, name: string): Promise<boolean> => {
      dispatch({ type: 'SAVE_START' })
      try {
        await brandRepository.update(id, { name })
        dispatch({ type: 'SAVE_DONE' })
        await load(requestRef.current.page, requestRef.current.query)
        return true
      } catch {
        dispatch({ type: 'SAVE_ERROR' })
        return false
      }
    },
    [load],
  )

  return {
    state,
    reload,
    setPage,
    setQuery,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    createBrand,
    renameBrand,
  }
}
