import type {
  ComboboxSearchAction,
  ComboboxSearchState,
  ComboboxUiAction,
  ComboboxUiState,
} from './combobox.model'

export const COMBOBOX_SEARCH_INITIAL_STATE: ComboboxSearchState = {
  status: 'idle',
  items: [],
  errorMessage: null,
}

export const COMBOBOX_UI_INITIAL_STATE: ComboboxUiState = {
  isOpen: false,
  query: '',
  highlightedIndex: -1,
}

export function comboboxSearchReducer(
  state: ComboboxSearchState,
  action: ComboboxSearchAction,
): ComboboxSearchState {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, status: 'loading', errorMessage: null }
    case 'SEARCH_SUCCESS':
      return { status: 'ready', items: action.payload, errorMessage: null }
    case 'SEARCH_ERROR':
      return { status: 'error', items: [], errorMessage: action.payload }
    case 'SEARCH_RESET':
      return COMBOBOX_SEARCH_INITIAL_STATE
  }
}

export function comboboxUiReducer(
  state: ComboboxUiState,
  action: ComboboxUiAction,
): ComboboxUiState {
  switch (action.type) {
    case 'OPENED':
      return state.isOpen ? state : { isOpen: true, query: '', highlightedIndex: -1 }
    case 'CLOSED':
      return COMBOBOX_UI_INITIAL_STATE
    case 'QUERY_CHANGED':
      return { isOpen: true, query: action.payload, highlightedIndex: -1 }
    case 'HIGHLIGHT_SET':
      return { ...state, highlightedIndex: action.payload }
    case 'HIGHLIGHT_MOVED': {
      const { direction, total } = action.payload
      if (total === 0) return { ...state, highlightedIndex: -1 }
      if (state.highlightedIndex === -1) {
        return { ...state, highlightedIndex: direction > 0 ? 0 : total - 1 }
      }
      const nextIndex = (state.highlightedIndex + direction + total) % total
      return { ...state, highlightedIndex: nextIndex }
    }
  }
}
