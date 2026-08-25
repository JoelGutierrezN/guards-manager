import type { EmployeeFileAction, EmployeeFileState } from './employee-file-state.model'
import { EmployeeFileSelectionHelper } from './employee-file-selection.helper'

export function employeeFileReducer(
  state: EmployeeFileState,
  action: EmployeeFileAction,
): EmployeeFileState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        file: action.file,
        status: 'ready',
        error: null,
        selectedItemIds: EmployeeFileSelectionHelper.clear(),
      }
    case 'LOAD_ERROR':
      return {
        ...state,
        file: null,
        status: 'error',
        error: action.error,
        selectedItemIds: EmployeeFileSelectionHelper.clear(),
      }
    case 'SET_TAB':
      return { ...state, tab: action.tab, selectedItemIds: EmployeeFileSelectionHelper.clear() }
    case 'TOGGLE_ITEM':
      return {
        ...state,
        selectedItemIds: EmployeeFileSelectionHelper.toggle(state.selectedItemIds, action.itemId),
      }
    case 'TOGGLE_ALL': {
      const itemIds = state.file?.activeItems.map((item) => item.id) ?? []
      const everySelected = EmployeeFileSelectionHelper.isAllSelected(
        state.selectedItemIds,
        itemIds.length,
      )
      return {
        ...state,
        selectedItemIds: everySelected
          ? EmployeeFileSelectionHelper.clear()
          : EmployeeFileSelectionHelper.selectAll(itemIds),
      }
    }
    case 'CLEAR_SELECTION':
      return { ...state, selectedItemIds: EmployeeFileSelectionHelper.clear() }
    case 'PDF_START':
      return { ...state, downloadingPdf: true }
    case 'PDF_DONE':
      return { ...state, downloadingPdf: false }
    case 'EMPLOYEE_UPDATED': {
      if (state.file === null) return state
      const { employee } = action
      return {
        ...state,
        file: {
          ...state.file,
          employee: {
            ...state.file.employee,
            name: employee.name,
            roleId: employee.roleId,
            roleName: employee.roleName,
            email: employee.email,
            phone: employee.phone,
            status: employee.status,
          },
        },
      }
    }
    default:
      return state
  }
}
