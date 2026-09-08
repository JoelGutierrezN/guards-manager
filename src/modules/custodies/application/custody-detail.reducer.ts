import {
  custodyDetailStateFrom,
  type CustodyDetailAction,
  type CustodyDetailState,
} from './custody-detail-state.model'

export function custodyDetailReducer(
  state: CustodyDetailState,
  action: CustodyDetailAction,
): CustodyDetailState {
  switch (action.type) {
    case 'HYDRATED':
      return custodyDetailStateFrom(action.data)
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return { ...state, custody: action.custody, status: 'ready', error: null }
    case 'LOAD_ERROR':
      return { ...state, custody: null, status: 'error', error: action.error }
    case 'CANCEL_DIALOG_OPENED':
      return { ...state, cancelDialogOpen: true, cancelError: null }
    case 'CANCEL_DIALOG_CLOSED':
      return { ...state, cancelDialogOpen: false, cancelling: false }
    case 'CANCEL_START':
      return { ...state, cancelling: true, cancelError: null }
    case 'CANCEL_ERROR':
      return { ...state, cancelling: false, cancelError: action.detail }
    case 'CANCEL_DONE':
      return { ...state, cancelling: false, cancelDialogOpen: false, cancelError: null }
    default:
      return state
  }
}
