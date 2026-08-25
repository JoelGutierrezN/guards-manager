import { useCallback, useReducer } from 'react'
import { useOverlayState } from '@heroui/react'
import type { Employee } from '../domain/employee.entity'
import type { UpdateEmployeeInput } from '../domain/employee-input.model'
import { INITIAL_EMPLOYEE_EDIT_STATE } from '../application/employee-edit-state.model'
import { employeeEditReducer } from '../application/employee-edit.reducer'
import { employeesRepository } from '../infrastructure/repositories/employees.repository'
import { EmployeeFormErrorHelper } from '../infrastructure/helpers/employee-form-error.helper'

export function useEmployeeEdit(onSaved: (employee: Employee) => void) {
  const modal = useOverlayState()
  const [state, dispatch] = useReducer(employeeEditReducer, INITIAL_EMPLOYEE_EDIT_STATE)
  const { editingEmployee, saving, formError } = state

  const openEdit = useCallback(
    (employee: Employee) => {
      dispatch({ type: 'EDIT_OPENED', employee })
      modal.open()
    },
    [modal],
  )

  const closeModal = useCallback(() => {
    dispatch({ type: 'SAVE_DONE' })
    modal.close()
  }, [modal])

  const save = useCallback(
    async (input: UpdateEmployeeInput): Promise<string | null> => {
      if (editingEmployee == null) return null
      dispatch({ type: 'SAVE_START' })
      try {
        const updated = await employeesRepository.update(editingEmployee.id, input)
        dispatch({ type: 'SAVE_DONE' })
        modal.close()
        onSaved(updated)
        return `Empleado "${updated.name}" actualizado`
      } catch (error) {
        dispatch({ type: 'SAVE_ERROR', message: EmployeeFormErrorHelper.messageFrom(error) })
        return null
      }
    },
    [editingEmployee, modal, onSaved],
  )

  return {
    modalOpen: modal.isOpen,
    modalKey: modal.isOpen ? `edit-${editingEmployee?.id ?? 'new'}` : 'closed',
    editingEmployee,
    saving,
    formError,
    openEdit,
    closeModal,
    save,
  }
}
