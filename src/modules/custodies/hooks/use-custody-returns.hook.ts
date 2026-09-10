import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { CustodyReturnSummary } from '../domain/custody.entity'
import { custodyReturnsReducer } from '../application/custody-returns.reducer'
import {
  RETURNS_PAGE_SIZE,
  initialCustodyReturnsState,
} from '../application/custody-returns-state.model'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'

const LOAD_ERROR_MESSAGE = 'No se pudo cargar el historial de devoluciones.'

export function useCustodyReturns(custodyId: string, initialReturns: CustodyReturnSummary[]) {
  const [state, dispatch] = useReducer(
    custodyReturnsReducer,
    initialReturns,
    initialCustodyReturnsState,
  )
  const seedReturns = useRef(initialReturns)

  const loadPage = useCallback(
    async (targetPage: number) => {
      dispatch({ type: 'LOAD_START', page: targetPage })
      try {
        const listPage = await custodiesRepository.listReturns(custodyId, targetPage)
        dispatch({
          type: 'LOAD_SUCCESS',
          returns: listPage.returns,
          page: listPage.page,
          lastPage: listPage.lastPage,
          total: listPage.total,
        })
      } catch {
        dispatch({ type: 'LOAD_ERROR', error: LOAD_ERROR_MESSAGE })
      }
    },
    [custodyId],
  )

  /**
   * El detalle no se desmonta al pasar de un resguardo a otro, así que el historial se
   * resiembra cuando cambian las props antes de pedir su primera página.
   */
  useEffect(() => {
    if (seedReturns.current !== initialReturns) {
      seedReturns.current = initialReturns
      dispatch({ type: 'RESET', returns: initialReturns })
    }
    if (initialReturns.length > RETURNS_PAGE_SIZE) void loadPage(1)
  }, [initialReturns, loadPage])

  const setPage = useCallback(
    (page: number) => {
      void loadPage(page)
    },
    [loadPage],
  )

  return {
    returns: state.returns,
    page: state.page,
    requestedPage: state.requestedPage,
    lastPage: state.lastPage,
    total: state.total,
    loading: state.status === 'loading',
    error: state.error,
    isPaginated: state.lastPage > 1,
    setPage,
  }
}
