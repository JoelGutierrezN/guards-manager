import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useOverlayState } from '@heroui/react'
import type { ProductModel } from '../domain/product-model.entity'
import type { ModelsFilters } from '../domain/models-filters.model'
import type { CreateProductModelInput } from '../domain/product-model-input.model'
import type { ModelsWindowManager } from '../application/models-window.model'
import { modelsReducer } from '../application/models.reducer'
import { productModelRepository } from '../infraestructure/repositories/product-model.repository'
import { ModelsQueryParamsHelper } from '../infraestructure/helpers/models-query-params.helper'
import { ModelFormErrorHelper } from '../infraestructure/helpers/model-form-error.helper'
import { DeactivateWarningStorage } from '../infraestructure/storage/deactivate-warning.storage'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'

const SEARCH_DEBOUNCE_MS = 250
const DELETE_FALLBACK_MESSAGE = 'No se pudo eliminar el modelo.'

export function useProductModels(brandId: string | null, onMutated?: () => void) {
  const { params, setQueryParams } = useQueryParams()
  const [state, dispatch] = useReducer(
    modelsReducer,
    params,
    ModelsQueryParamsHelper.initialStateFrom,
  )
  const requestRef = useRef({
    page: state.page,
    query: state.query,
    brandId: state.brandId,
    filters: state.filters,
  })

  useEffect(() => {
    requestRef.current = {
      page: state.page,
      query: state.query,
      brandId: state.brandId,
      filters: state.filters,
    }
  }, [state.page, state.query, state.brandId, state.filters])

  useEffect(() => {
    if (brandId !== state.brandId) {
      dispatch({ type: 'SET_BRAND', brandId })
    }
  }, [brandId, state.brandId])

  useEffect(() => {
    setQueryParams(
      ModelsQueryParamsHelper.toParams({
        page: state.page,
        query: state.query,
        filters: state.filters,
      }),
    )
  }, [state.page, state.query, state.filters, setQueryParams])

  const load = useCallback(
    async (
      request: { page: number; query: string; brandId: string | null; filters: ModelsFilters },
      silent = false,
    ) => {
      if (!silent) dispatch({ type: 'LOAD_START' })
      try {
        const result = await productModelRepository.list(
          ModelsQueryParamsHelper.toApiParams(request),
        )
        dispatch({ type: 'LOAD_SUCCESS', result })
      } catch {
        dispatch({ type: 'LOAD_ERROR', error: 'No se pudieron cargar los modelos.' })
      }
    },
    [],
  )

  useEffect(() => {
    const handle = setTimeout(() => {
      void load({
        page: state.page,
        query: state.query,
        brandId: state.brandId,
        filters: state.filters,
      })
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [state.page, state.query, state.brandId, state.filters, load])

  const reload = useCallback(() => {
    void load(requestRef.current)
  }, [load])

  const setPage = useCallback((page: number) => dispatch({ type: 'SET_PAGE', page }), [])
  const setQuery = useCallback((query: string) => dispatch({ type: 'SET_QUERY', query }), [])
  const setFilters = useCallback(
    (filters: Partial<ModelsFilters>) => dispatch({ type: 'SET_FILTERS', filters }),
    [],
  )

  const modal = useOverlayState()
  const [windowManager, setWindowManager] = useState<ModelsWindowManager>({
    window: 'create',
    payload: null,
  })

  const openCreate = useCallback(() => {
    dispatch({ type: 'SAVE_DONE' })
    setWindowManager({ window: 'create', payload: null })
    modal.open()
  }, [modal])

  const openEdit = useCallback(
    (model: ProductModel) => {
      dispatch({ type: 'SAVE_DONE' })
      setWindowManager({ window: 'edit', payload: model })
      modal.open()
    },
    [modal],
  )

  const saveModel = useCallback(
    async (input: CreateProductModelInput): Promise<string | null> => {
      const { window, payload } = windowManager
      dispatch({ type: 'SAVE_START' })
      try {
        if (window === 'edit' && payload != null) {
          await productModelRepository.update(payload.id, input)
        } else {
          await productModelRepository.create(input)
        }
        dispatch({ type: 'SAVE_DONE' })
        modal.close()
        void load(requestRef.current)
        onMutated?.()
        return window === 'edit'
          ? `Modelo "${input.name}" actualizado`
          : `Modelo "${input.name}" creado`
      } catch (error) {
        dispatch({ type: 'SAVE_ERROR', message: ModelFormErrorHelper.messageFrom(error) })
        return null
      }
    },
    [windowManager, modal, load, onMutated],
  )

  const setModelActive = useCallback(
    async (model: ProductModel, active: boolean): Promise<string> => {
      dispatch({ type: 'ROW_START', id: model.id })
      try {
        const updated = await productModelRepository.setActive(model.id, active)
        dispatch({ type: 'ROW_UPDATED', model: updated })
        dispatch({ type: 'ROW_DONE' })
        return active ? `Modelo "${model.name}" reactivado` : `Modelo "${model.name}" dado de baja`
      } catch {
        dispatch({ type: 'ROW_DONE' })
        return active ? 'No se pudo reactivar el modelo.' : 'No se pudo dar de baja el modelo.'
      }
    },
    [],
  )

  const deactivateModel = useCallback(
    async (model: ProductModel): Promise<string | null> => {
      if (!DeactivateWarningStorage.hasSeen()) {
        setWindowManager({ window: 'deactivate', payload: model })
        modal.open()
        return null
      }
      return setModelActive(model, false)
    },
    [modal, setModelActive],
  )

  const confirmDeactivate = useCallback(async (): Promise<string | null> => {
    const { window, payload } = windowManager
    if (window !== 'deactivate' || payload == null) return null
    DeactivateWarningStorage.markSeen()
    modal.close()
    return setModelActive(payload, false)
  }, [windowManager, modal, setModelActive])

  const reactivateModel = useCallback(
    (model: ProductModel): Promise<string> => setModelActive(model, true),
    [setModelActive],
  )

  const openDelete = useCallback(
    (model: ProductModel) => {
      setWindowManager({ window: 'delete', payload: model })
      modal.open()
    },
    [modal],
  )

  const confirmDelete = useCallback(async (): Promise<string | null> => {
    const { window, payload } = windowManager
    if (window !== 'delete' || payload == null) return null
    modal.close()
    dispatch({ type: 'ROW_START', id: payload.id })
    try {
      await productModelRepository.remove(payload.id)
      dispatch({ type: 'ROW_REMOVED', id: payload.id })
      dispatch({ type: 'ROW_DONE' })
      if (state.models.length === 1 && state.page > 1) {
        dispatch({ type: 'SET_PAGE', page: state.page - 1 })
      } else {
        void load(requestRef.current, true)
      }
      onMutated?.()
      return `Modelo "${payload.name}" eliminado`
    } catch (error) {
      dispatch({ type: 'ROW_DONE' })
      if (ApiConflictErrorHelper.isConflict(error)) {
        return ApiConflictErrorHelper.messageFrom(error, DELETE_FALLBACK_MESSAGE)
      }
      return DELETE_FALLBACK_MESSAGE
    }
  }, [windowManager, modal, state.models.length, state.page, load, onMutated])

  const editingModel = windowManager.window === 'edit' ? windowManager.payload : null
  const deactivatingModel = windowManager.window === 'deactivate' ? windowManager.payload : null
  const deletingModel = windowManager.window === 'delete' ? windowManager.payload : null
  const modalKey = modal.isOpen ? `${windowManager.window}-${editingModel?.id ?? 'new'}` : 'closed'
  const formModalOpen =
    modal.isOpen && (windowManager.window === 'create' || windowManager.window === 'edit')
  const deactivateModalOpen = modal.isOpen && windowManager.window === 'deactivate'
  const deleteModalOpen = modal.isOpen && windowManager.window === 'delete'

  const showSkeletons = state.status === 'loading' || state.status === 'reloading'
  const skeletonSlots = useMemo(() => [...Array(state.perPage).keys()], [state.perPage])

  return {
    state,
    showSkeletons,
    skeletonSlots,
    reload,
    setPage,
    setQuery,
    setFilters,
    openCreate,
    openEdit,
    saveModel,
    deactivateModel,
    confirmDeactivate,
    reactivateModel,
    openDelete,
    confirmDelete,
    editingModel,
    deactivatingModel,
    deletingModel,
    modalKey,
    modalOpen: formModalOpen,
    deactivateModalOpen,
    deleteModalOpen,
    closeModal: modal.close,
  }
}
