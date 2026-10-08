import { useCallback, useReducer } from 'react'
import type { Employee } from '../domain/employee.entity'
import { EmployeeStatusHelper } from '../application/employee-status.helper'
import {
  INITIAL_EMPLOYEE_LIFECYCLE_STATE,
  type EmployeeLifecycleTarget,
} from '../application/employee-lifecycle-state.model'
import { employeeLifecycleReducer } from '../application/employee-lifecycle.reducer'
import { employeesRepository } from '../infraestructure/repositories/employees.repository'
import { ApiConflictErrorHelper } from '../../shared/infraestructure/errors/api-conflict-error.helper'

const STATUS_FALLBACK_MESSAGE = 'No se pudo actualizar el estado del empleado.'
const DELETE_FALLBACK_MESSAGE = 'No se pudo eliminar al empleado.'

interface UseEmployeeLifecycleOptions {
  onStatusChanged: (employee: Employee) => void
  onDeleted: (target: EmployeeLifecycleTarget) => void
}

export function useEmployeeLifecycle({ onStatusChanged, onDeleted }: UseEmployeeLifecycleOptions) {
  const [state, dispatch] = useReducer(employeeLifecycleReducer, INITIAL_EMPLOYEE_LIFECYCLE_STATE)
  const { target, confirmKind } = state

  const openStatusConfirm = useCallback(
    (employee: EmployeeLifecycleTarget) =>
      dispatch({ type: 'OPEN_CONFIRM', kind: 'status', target: employee }),
    [],
  )
  const openDeleteConfirm = useCallback(
    (employee: EmployeeLifecycleTarget) =>
      dispatch({ type: 'OPEN_CONFIRM', kind: 'delete', target: employee }),
    [],
  )
  const closeConfirm = useCallback(() => dispatch({ type: 'CLOSE_CONFIRM' }), [])

  const confirm = useCallback(async () => {
    if (target === null || confirmKind === null) return
    dispatch({ type: 'ACTION_START' })
    try {
      if (confirmKind === 'delete') {
        await employeesRepository.remove(target.id)
        dispatch({ type: 'ACTION_SUCCESS' })
        onDeleted(target)
        return
      }
      const updated = await employeesRepository.updateStatus(
        target.id,
        EmployeeStatusHelper.opposite(target.status),
      )
      dispatch({ type: 'ACTION_SUCCESS' })
      onStatusChanged(updated)
    } catch (error) {
      const fallback = confirmKind === 'delete' ? DELETE_FALLBACK_MESSAGE : STATUS_FALLBACK_MESSAGE
      const message = ApiConflictErrorHelper.isConflict(error)
        ? ApiConflictErrorHelper.messageFrom(error, fallback)
        : fallback
      dispatch({ type: 'ACTION_ERROR', message })
    }
  }, [target, confirmKind, onStatusChanged, onDeleted])

  return {
    target,
    confirmKind,
    loading: state.loading,
    errorMessage: state.errorMessage,
    openStatusConfirm,
    openDeleteConfirm,
    closeConfirm,
    confirm,
  }
}
