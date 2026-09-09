import { useCallback, useEffect, useReducer } from 'react'
import type { CustodyReturnSummary } from '../domain/custody.entity'
import { custodyReturnsReducer } from '../application/custody-returns.reducer'
import { initialCustodyReturnsState } from '../application/custody-returns-state.model'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'

const RETURNS_PAGINATION_THRESHOLD = 10
const LOAD_ERROR_MESSAGE = 'No se pudo cargar el historial de devoluciones.'

export function useCustodyReturns(custodyId: string, initialReturns: CustodyReturnSummary[]) {
  const isPaginated = initialReturns.length > RETURNS_PAGINATION_THRESHOLD
  const [state, dispatch] = useReducer(
    custodyReturnsReducer,
    initialReturns,
    initialCustodyReturnsState,
  )

  const loadPage = useCallback(
    async (targetPage: number) => {
      dispatch({ type: 'LOAD_START' })
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

  useEffect(() => {
    if (isPaginated) void loadPage(1)
  }, [isPaginated, loadPage])

  const setPage = useCallback(
    (page: number) => {
      void loadPage(page)
    },
    [loadPage],
  )

  return {
    returns: state.returns,
    page: state.page,
    lastPage: state.lastPage,
    total: state.total,
    loading: state.status === 'loading',
    error: state.error,
    isPaginated,
    setPage,
  }
}
