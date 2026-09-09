import type { ReturnAction, ReturnItemDraft, ReturnState } from './return-state.model'

function withDraft(
  state: ReturnState,
  stockId: string,
  changes: Partial<ReturnItemDraft>,
): ReturnState {
  const current = state.drafts[stockId]
  if (current === undefined) return state
  return { ...state, drafts: { ...state.drafts, [stockId]: { ...current, ...changes } } }
}

export function returnReducer(state: ReturnState, action: ReturnAction): ReturnState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', loadError: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        status: 'editing',
        loadError: null,
        custody: action.payload.custody,
        drafts: action.payload.drafts,
        selectedStockIds: action.payload.selectedStockIds,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', loadError: action.payload, custody: null }
    case 'SELECTION_CHANGED':
      return { ...state, selectedStockIds: action.payload }
    case 'ITEM_CONDITION_CHANGED':
      return withDraft(state, action.payload.stockId, { condition: action.payload.condition })
    case 'ITEM_NOTES_CHANGED':
      return withDraft(state, action.payload.stockId, { notes: action.payload.notes })
    case 'NOTES_CHANGED':
      return { ...state, notes: action.payload }
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', error: null }
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'done', error: null, createdReturn: action.payload }
    case 'SUBMIT_ERROR':
      return { ...state, status: 'editing', error: action.payload }
    default:
      return state
  }
}
