export interface ComboboxItem {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export type ComboboxOptionsLoader = (query: string) => Promise<ComboboxItem[]>

export type ComboboxSearchStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ComboboxSearchState {
  status: ComboboxSearchStatus
  items: ComboboxItem[]
  errorMessage: string | null
}

export type ComboboxSearchAction =
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; payload: ComboboxItem[] }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SEARCH_RESET' }

export interface ComboboxUiState {
  isOpen: boolean
  query: string
  highlightedIndex: number
}

export type ComboboxUiAction =
  | { type: 'OPENED' }
  | { type: 'CLOSED' }
  | { type: 'QUERY_CHANGED'; payload: string }
  | { type: 'HIGHLIGHT_SET'; payload: number }
  | { type: 'HIGHLIGHT_MOVED'; payload: { direction: number; total: number } }
