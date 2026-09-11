import { useCallback, useReducer } from 'react'
import type { Employee } from '../domain/employee.entity'
import type { EmployeeStatus } from '../domain/employee-status.model'
import { EmployeeStatusHelper } from '../application/employee-status.helper'
import {
  INITIAL_EMPLOYEE_LIFECYCLE_STATE,
  type EmployeeLifecycleConfirmKind,
} from '../application/employee-lifecycle-state.model'
import { employeeLifecycleReducer } from '../application/employee-lifecycle.reducer'
import { employeesRepository } from '../infraestructure/repositories/employees.repository'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'

const STATUS_FALLBACK_MESSAGE = 'No se pudo actualizar el estado del empleado.'
const DELETE_FALLBACK_MESSAGE = 'No se pudo eliminar al empleado.'

interface UseEmployeeLifecycleOptions {
  employeeId: string
  status: EmployeeStatus
  onStatusChanged: (employee: Employee) => void
  onDeleted: () => void
}

export function useEmployeeLifecycle({
  employeeId,
  status,
  onStatusChanged,
  onDeleted,
}: UseEmployeeLifecycleOptions) {
  const [state, dispatch] = useReducer(employeeLifecycleReducer, INITIAL_EMPLOYEE_LIFECYCLE_STATE)

  const openStatusConfirm = useCallback(
    () => dispatch({ type: 'OPEN_CONFIRM', kind: 'status' }),
    [],
  )
  const openDeleteConfirm = useCallback(
    () => dispatch({ type: 'OPEN_CONFIRM', kind: 'delete' }),
    [],
  )
  const closeConfirm = useCallback(() => dispatch({ type: 'CLOSE_CONFIRM' }), [])

  const confirm = useCallback(async () => {
    const kind: EmployeeLifecycleConfirmKind | null = state.confirmKind
    dispatch({ type: 'ACTION_START' })
    try {
      if (kind === 'delete') {
        await employeesRepository.remove(employeeId)
        dispatch({ type: 'ACTION_SUCCESS' })
        onDeleted()
        return
      }
      const updated = await employeesRepository.updateStatus(
        employeeId,
        EmployeeStatusHelper.opposite(status),
      )
      dispatch({ type: 'ACTION_SUCCESS' })
      onStatusChanged(updated)
    } catch (error) {
      const fallback = kind === 'delete' ? DELETE_FALLBACK_MESSAGE : STATUS_FALLBACK_MESSAGE
      const message = ApiConflictErrorHelper.isConflict(error)
        ? ApiConflictErrorHelper.messageFrom(error, fallback)
        : fallback
      dispatch({ type: 'ACTION_ERROR', message })
    }
  }, [employeeId, status, state.confirmKind, onStatusChanged, onDeleted])

  return {
    confirmKind: state.confirmKind,
    loading: state.loading,
    errorMessage: state.errorMessage,
    openStatusConfirm,
    openDeleteConfirm,
    closeConfirm,
    confirm,
  }
}
