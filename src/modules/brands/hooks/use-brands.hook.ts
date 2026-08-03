import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useOverlayState } from '@heroui/react'
import type { Brand } from '../domain/brand.entity'
import type { BrandsWindowManager } from '../application/brands-window.model'
import { brandsReducer } from '../application/brands.reducer'
import { brandRepository } from '../infraestructure/repositories/brand.repository'
import { BrandsQueryParamsHelper } from '../infraestructure/helpers/brands-query-params.helper'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'

const SEARCH_DEBOUNCE_MS = 250
const MIN_SKELETON_CARDS = 3

export function useBrands() {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(
    brandsReducer,
    params,
    BrandsQueryParamsHelper.initialStateFrom,
  )
  const requestRef = useRef({ page: state.page, query: state.query })

  useEffect(() => {
    requestRef.current = { page: state.page, query: state.query }
  }, [state.page, state.query])

  useEffect(() => {
    setQueryParams(BrandsQueryParamsHelper.toParams({ page: state.page, query: state.query }))
  }, [state.page, state.query, setQueryParams])

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

  const modal = useOverlayState()
  const [windowManager, setWindowManager] = useState<BrandsWindowManager>({
    window: 'create',
    payload: null,
  })

  const openCreate = useCallback(() => {
    setWindowManager({ window: 'create', payload: null })
    modal.open()
  }, [modal])

  const openEdit = useCallback(
    (brand: Brand) => {
      setWindowManager({ window: 'edit', payload: brand })
      modal.open()
    },
    [modal],
  )

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

  const saveBrand = useCallback(
    async (name: string): Promise<string> => {
      const { window, payload } = windowManager
      if (window === 'edit' && payload) {
        const renamed = await renameBrand(payload.id, name)
        if (renamed) modal.close()
        return renamed ? `Marca actualizada a "${name}"` : 'No se pudo actualizar la marca'
      }
      const created = await createBrand(name)
      if (created) modal.close()
      return created ? `Marca "${name}" creada` : 'No se pudo crear la marca'
    },
    [windowManager, renameBrand, createBrand, modal],
  )

  const editingBrand = windowManager.window === 'edit' ? windowManager.payload : null
  const modalKey = modal.isOpen ? `${windowManager.window}-${editingBrand?.id ?? 'new'}` : 'closed'

  const showSkeletons = state.status === 'loading' || state.status === 'reloading'
  const hasPagination = state.lastPage > 1
  const skeletonSlots = useMemo(
    () =>
      state.status === 'loading' || hasPagination
        ? [...Array(state.perPage).keys()]
        : [...Array(Math.max(state.brands.length, MIN_SKELETON_CARDS)).keys()],
    [state.status, hasPagination, state.perPage, state.brands.length],
  )

  return {
    state,
    showSkeletons,
    skeletonSlots,
    reload,
    setPage,
    setQuery,
    openCreate,
    openEdit,
    saveBrand,
    editingBrand,
    modalKey,
    modalOpen: modal.isOpen,
    closeModal: modal.close,
  }
}
