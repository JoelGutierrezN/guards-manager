import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { ComboboxItem, ComboboxOptionsLoader, ComboboxSearchStatus } from './combobox.model'
import { COMBOBOX_SEARCH_INITIAL_STATE, comboboxSearchReducer } from './combobox.reducer'

const DEFAULT_DEBOUNCE_MS = 280
const LOAD_ERROR_MESSAGE = 'No se pudieron cargar las opciones.'

interface ComboboxSearchResult {
  status: ComboboxSearchStatus
  items: ComboboxItem[]
  errorMessage: string | null
  retry: () => void
}

export function useComboboxSearch(
  loadOptions: ComboboxOptionsLoader,
  query: string,
  isEnabled: boolean,
  debounceMs: number = DEFAULT_DEBOUNCE_MS,
): ComboboxSearchResult {
  const [state, dispatch] = useReducer(comboboxSearchReducer, COMBOBOX_SEARCH_INITIAL_STATE)
  const [retryToken, setRetryToken] = useState(0)
  const loadOptionsRef = useRef(loadOptions)
  const requestIdRef = useRef(0)

  useEffect(() => {
    loadOptionsRef.current = loadOptions
  }, [loadOptions])

  useEffect(() => {
    if (!isEnabled) {
      requestIdRef.current += 1
      dispatch({ type: 'SEARCH_RESET' })
      return
    }

    requestIdRef.current += 1
    const requestId = requestIdRef.current
    dispatch({ type: 'SEARCH_START' })

    const timer = setTimeout(() => {
      loadOptionsRef
        .current(query)
        .then((items) => {
          if (requestIdRef.current !== requestId) return
          dispatch({ type: 'SEARCH_SUCCESS', payload: items })
        })
        .catch(() => {
          if (requestIdRef.current !== requestId) return
          dispatch({ type: 'SEARCH_ERROR', payload: LOAD_ERROR_MESSAGE })
        })
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, isEnabled, debounceMs, retryToken])

  const retry = useCallback(() => setRetryToken((token) => token + 1), [])

  return { status: state.status, items: state.items, errorMessage: state.errorMessage, retry }
}
