import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useOverlayState } from '@heroui/react'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import type { Employee } from '../domain/employee.entity'
import type { CreateEmployeeInput } from '../domain/employee-input.model'
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
          await employeesRepository.update(payload.id, input)
        } else {
          await employeesRepository.create(input)
        }
        dispatch({ type: 'SAVE_DONE' })
        modal.close()
        void load(requestRef.current)
        return window === 'edit'
          ? `Empleado "${input.name}" actualizado`
          : `Empleado "${input.name}" creado`
      } catch (error) {
        dispatch({ type: 'SAVE_ERROR', message: EmployeeFormErrorHelper.messageFrom(error) })
        return null
      }
    },
    [windowManager, modal, load],
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
    openCreate,
    openEdit,
    saveEmployee,
    editingEmployee,
    modalKey,
    modalOpen: modal.isOpen,
    closeModal: modal.close,
  }
}
