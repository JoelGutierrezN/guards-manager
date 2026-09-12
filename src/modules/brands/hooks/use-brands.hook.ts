import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useOverlayState } from '@heroui/react'
import type { Brand } from '../domain/brand.entity'
import type { BrandsWindowManager } from '../application/brands-window.model'
import { brandsReducer } from '../application/brands.reducer'
import { brandRepository } from '../infraestructure/repositories/brand.repository'
import { BrandsQueryParamsHelper } from '../infraestructure/helpers/brands-query-params.helper'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'
import { ApiValidationErrorHelper } from '../../shared/infraestructure/errors/api-validation-error.helper'

const SEARCH_DEBOUNCE_MS = 250
const MIN_SKELETON_CARDS = 3
const DELETE_FALLBACK_MESSAGE = 'No se pudo eliminar la marca.'
const MERGE_FALLBACK_MESSAGE = 'No se pudo fusionar la marca.'

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

  const openDelete = useCallback(
    (brand: Brand) => {
      setWindowManager({ window: 'delete', payload: brand })
      modal.open()
      dispatch({ type: 'DELETION_PREVIEW_START' })
      brandRepository
        .deletionPreview(brand.id)
        .then((preview) => dispatch({ type: 'DELETION_PREVIEW_SUCCESS', preview }))
        .catch(() => dispatch({ type: 'DELETION_PREVIEW_ERROR' }))
    },
    [modal],
  )

  const confirmDelete = useCallback(async (): Promise<string | null> => {
    const { window, payload } = windowManager
    if (window !== 'delete' || payload == null) return null
    dispatch({ type: 'DELETE_START' })
    try {
      await brandRepository.remove(payload.id)
      dispatch({ type: 'DELETE_DONE' })
      modal.close()
      await load(requestRef.current.page, requestRef.current.query)
      return `Marca "${payload.name}" eliminada`
    } catch (error) {
      const message = ApiConflictErrorHelper.isConflict(error)
        ? ApiConflictErrorHelper.messageFrom(error, DELETE_FALLBACK_MESSAGE)
        : DELETE_FALLBACK_MESSAGE
      dispatch({ type: 'DELETE_ERROR', message })
      return message
    }
  }, [windowManager, modal, load])

  const openMerge = useCallback(
    (brand: Brand) => {
      setWindowManager({ window: 'merge', payload: brand })
      modal.open()
    },
    [modal],
  )

  const mergeBrand = useCallback(
    async (targetId: string): Promise<string | null> => {
      const { window, payload } = windowManager
      if (window !== 'merge' || payload == null) return null
      dispatch({ type: 'MERGE_START' })
      try {
        await brandRepository.merge(payload.id, targetId)
        dispatch({ type: 'MERGE_DONE' })
        modal.close()
        await load(requestRef.current.page, requestRef.current.query)
        return `Marca "${payload.name}" fusionada`
      } catch (error) {
        dispatch({
          type: 'MERGE_ERROR',
          message: ApiValidationErrorHelper.messageFrom(error, MERGE_FALLBACK_MESSAGE),
        })
        return null
      }
    },
    [windowManager, modal, load],
  )

  const editingBrand = windowManager.window === 'edit' ? windowManager.payload : null
  const deletingBrand = windowManager.window === 'delete' ? windowManager.payload : null
  const mergingBrand = windowManager.window === 'merge' ? windowManager.payload : null
  const modalKey = modal.isOpen ? `${windowManager.window}-${editingBrand?.id ?? 'new'}` : 'closed'
  const formModalOpen =
    modal.isOpen && (windowManager.window === 'create' || windowManager.window === 'edit')
  const deleteModalOpen = modal.isOpen && windowManager.window === 'delete'
  const mergeModalOpen = modal.isOpen && windowManager.window === 'merge'

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
    openDelete,
    confirmDelete,
    openMerge,
    mergeBrand,
    editingBrand,
    deletingBrand,
    mergingBrand,
    modalKey,
    modalOpen: formModalOpen,
    deleteModalOpen,
    mergeModalOpen,
    closeModal: modal.close,
  }
}
