import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useOverlayState } from '@heroui/react'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import type { Employee } from '../domain/employee.entity'
import type { CreateEmployeeInput } from '../domain/employee-input.model'
import type { EmployeesFilters } from '../domain/employees-filters.model'
import type { EmployeesWindowManager } from '../application/employees-window.model'
import { employeesReducer } from '../application/employees.reducer'
import { EmployeesStatsHelper } from '../application/employees-stats.helper'
import { employeesRepository } from '../infrastructure/repositories/employees.repository'
import { EmployeeFormErrorHelper } from '../infrastructure/helpers/employee-form-error.helper'
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
  const { page, query, filters } = state
  const requestRef = useRef<EmployeesListRequest>({ page, query, filters })

  useEffect(() => {
    requestRef.current = { page, query, filters }
  }, [page, query, filters])

  useEffect(() => {
    setQueryParams(EmployeeQueryParamsHelper.toParams({ page, query, filters }))
  }, [page, query, filters, setQueryParams])

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
    (nextFilters: Partial<EmployeesFilters>) =>
      dispatch({ type: 'SET_FILTERS', filters: nextFilters }),
    [],
  )
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), [])

  const modal = useOverlayState()
  const [windowManager, setWindowManager] = useState<EmployeesWindowManager>({
    window: 'create',
    payload: null,
  })

  const openCreate = useCallback(() => {
    dispatch({ type: 'SAVE_DONE' })
    setWindowManager({ window: 'create', payload: null })
    modal.open()
  }, [modal])

  const openEdit = useCallback(
    (employee: Employee) => {
      dispatch({ type: 'SAVE_DONE' })
      setWindowManager({ window: 'edit', payload: employee })
      modal.open()
    },
    [modal],
  )

  const saveEmployee = useCallback(
    async (input: CreateEmployeeInput): Promise<string | null> => {
      const { window, payload } = windowManager
      dispatch({ type: 'SAVE_START' })
      try {
        if (window === 'edit' && payload != null) {
          const updated = await employeesRepository.update(payload.id, input)
          dispatch({ type: 'ROW_UPDATED', employee: updated })
        } else {
          const created = await employeesRepository.create(input)
          dispatch({ type: 'ROW_ADDED', employee: created })
        }
        dispatch({ type: 'SAVE_DONE' })
        modal.close()
        return window === 'edit'
          ? `Empleado "${input.name}" actualizado`
          : `Empleado "${input.name}" creado`
      } catch (error) {
        dispatch({ type: 'SAVE_ERROR', message: EmployeeFormErrorHelper.messageFrom(error) })
        return null
      }
    },
    [windowManager, modal],
  )

  const editingEmployee = windowManager.window === 'edit' ? windowManager.payload : null
  const modalKey = modal.isOpen
    ? `${windowManager.window}-${editingEmployee?.id ?? 'new'}`
    : 'closed'

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

  return {
    state,
    kpis,
    reloadList,
    setPage,
    setQuery,
    clearQuery,
    setFilters,
    clearFilters,
    openCreate,
    openEdit,
    saveEmployee,
    editingEmployee,
    modalKey,
    modalOpen: modal.isOpen,
    closeModal: modal.close,
  }
}
