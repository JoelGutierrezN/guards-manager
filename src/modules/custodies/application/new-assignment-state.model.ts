import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { CustodyDetail } from '../domain/custody.entity'
import type { EmployeeOption } from '../domain/employee-option.model'
import type { NewAssignmentErrorReport } from '../domain/new-assignment-error.model'
import type { AvailableStock } from '../domain/new-assignment-option.model'

export const NEW_ASSIGNMENT_STEP_IDS = ['employee', 'units', 'confirm'] as const

export type NewAssignmentStepId = (typeof NEW_ASSIGNMENT_STEP_IDS)[number]

export type NewAssignmentStatus = 'editing' | 'submitting' | 'done'

export interface NewAssignmentCartItem {
  stock: AvailableStock
  condition: ItemCondition
  notes: string
}

export interface NewAssignmentState {
  stepId: NewAssignmentStepId
  status: NewAssignmentStatus
  employee: EmployeeOption | null
  isEmployeeLoading: boolean
  cart: NewAssignmentCartItem[]
  notes: string
  error: NewAssignmentErrorReport | null
  createdCustody: CustodyDetail | null
}

export type NewAssignmentAction =
  | { type: 'STEP_SELECTED'; payload: NewAssignmentStepId }
  | { type: 'EMPLOYEE_LOAD_START' }
  | { type: 'EMPLOYEE_LOAD_SUCCESS'; payload: EmployeeOption }
  | { type: 'EMPLOYEE_LOAD_ERROR'; payload: NewAssignmentErrorReport }
  | { type: 'EMPLOYEE_SELECTED'; payload: EmployeeOption | null }
  | { type: 'UNITS_ADDED'; payload: AvailableStock[] }
  | { type: 'UNIT_REMOVED'; payload: string }
  | { type: 'CART_CLEARED' }
  | { type: 'ITEM_CONDITION_CHANGED'; payload: { stockId: string; condition: ItemCondition } }
  | { type: 'ITEM_NOTES_CHANGED'; payload: { stockId: string; notes: string } }
  | { type: 'NOTES_CHANGED'; payload: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: CustodyDetail }
  | { type: 'SUBMIT_ERROR'; payload: NewAssignmentErrorReport }
  | { type: 'ASSIGNMENT_RESTARTED' }

export const INITIAL_NEW_ASSIGNMENT_STATE: NewAssignmentState = {
  stepId: 'employee',
  status: 'editing',
  employee: null,
  isEmployeeLoading: false,
  cart: [],
  notes: '',
  error: null,
  createdCustody: null,
}
