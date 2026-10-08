import type { Employee } from '../domain/employee.entity'
import type { EmployeeFile } from '../domain/employee-file.entity'
import { DEFAULT_EMPLOYEE_FILE_TAB, type EmployeeFileTab } from '../domain/employee-file-tab.model'

export type EmployeeFileStatus = 'loading' | 'ready' | 'error'

export interface EmployeeFileState {
  file: EmployeeFile | null
  status: EmployeeFileStatus
  error: string | null
  tab: EmployeeFileTab
  selectedItemIds: Set<string>
  downloadingPdf: boolean
}

export const INITIAL_EMPLOYEE_FILE_STATE: EmployeeFileState = {
  file: null,
  status: 'loading',
  error: null,
  tab: DEFAULT_EMPLOYEE_FILE_TAB,
  selectedItemIds: new Set<string>(),
  downloadingPdf: false,
}

export type EmployeeFileAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; file: EmployeeFile }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_TAB'; tab: EmployeeFileTab }
  | { type: 'TOGGLE_ITEM'; itemId: string }
  | { type: 'TOGGLE_ALL' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'PDF_START' }
  | { type: 'PDF_DONE' }
  | { type: 'EMPLOYEE_UPDATED'; employee: Employee }
