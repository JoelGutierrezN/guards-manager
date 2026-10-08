import { NewAssignmentCartHelper } from './new-assignment-cart.helper'
import {
  INITIAL_NEW_ASSIGNMENT_STATE,
  type NewAssignmentAction,
  type NewAssignmentState,
} from './new-assignment-state.model'

export function newAssignmentReducer(
  state: NewAssignmentState,
  action: NewAssignmentAction,
): NewAssignmentState {
  switch (action.type) {
    case 'STEP_SELECTED':
      return { ...state, stepId: action.payload }
    case 'EMPLOYEE_LOAD_START':
      return { ...state, isEmployeeLoading: true, error: null }
    case 'EMPLOYEE_LOAD_SUCCESS':
      return { ...state, isEmployeeLoading: false, employee: action.payload, error: null }
    case 'EMPLOYEE_LOAD_ERROR':
      return { ...state, isEmployeeLoading: false, employee: null, error: action.payload }
    case 'EMPLOYEE_SELECTED':
      return { ...state, employee: action.payload, error: null }
    case 'UNITS_ADDED':
      return {
        ...state,
        cart: NewAssignmentCartHelper.add(state.cart, action.payload),
        error: null,
      }
    case 'UNIT_REMOVED':
      return {
        ...state,
        cart: NewAssignmentCartHelper.remove(state.cart, action.payload),
        error: null,
      }
    case 'CART_CLEARED':
      return { ...state, cart: [], error: null }
    case 'ITEM_CONDITION_CHANGED':
      return {
        ...state,
        cart: NewAssignmentCartHelper.withCondition(
          state.cart,
          action.payload.stockId,
          action.payload.condition,
        ),
      }
    case 'ITEM_NOTES_CHANGED':
      return {
        ...state,
        cart: NewAssignmentCartHelper.withNotes(
          state.cart,
          action.payload.stockId,
          action.payload.notes,
        ),
      }
    case 'NOTES_CHANGED':
      return { ...state, notes: action.payload }
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', error: null }
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'done', createdCustody: action.payload, error: null }
    case 'SUBMIT_ERROR':
      return { ...state, status: 'editing', error: action.payload }
    case 'ASSIGNMENT_RESTARTED':
      return INITIAL_NEW_ASSIGNMENT_STATE
    default:
      return state
  }
}
