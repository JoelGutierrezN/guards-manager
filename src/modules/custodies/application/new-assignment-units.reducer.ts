import {
  INITIAL_NEW_ASSIGNMENT_UNITS_STATE,
  type NewAssignmentUnitsAction,
  type NewAssignmentUnitsState,
} from './new-assignment-units-state.model'

const FIRST_PAGE = 1

export function newAssignmentUnitsReducer(
  state: NewAssignmentUnitsState,
  action: NewAssignmentUnitsAction,
): NewAssignmentUnitsState {
  switch (action.type) {
    case 'PRODUCT_SELECTED':
      return { ...state, product: action.payload, page: FIRST_PAGE, selectedIds: [] }
    case 'CONSECUTIVE_CHANGED':
      return { ...state, consecutive: action.payload, page: FIRST_PAGE, selectedIds: [] }
    case 'PAGE_CHANGED':
      return { ...state, page: action.payload, selectedIds: [] }
    case 'LOAD_START':
      return { ...state, status: 'loading', errorMessage: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        status: 'ready',
        stocks: action.payload.stocks,
        page: action.payload.page,
        lastPage: action.payload.lastPage,
        total: action.payload.total,
        errorMessage: null,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', stocks: [], errorMessage: action.payload }
    case 'SELECTION_CHANGED':
      return { ...state, selectedIds: action.payload }
    case 'SELECTION_CLEARED':
      return { ...state, selectedIds: [] }
    case 'RESET':
      return INITIAL_NEW_ASSIGNMENT_UNITS_STATE
    default:
      return state
  }
}
