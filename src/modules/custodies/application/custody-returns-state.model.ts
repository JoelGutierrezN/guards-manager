import type { CustodyReturnSummary } from '../domain/custody.entity'

/** Tamaño de página del API (`GET /custodies/{id}/returns`) y umbral para paginar el panel. */
export const RETURNS_PAGE_SIZE = 10

export type CustodyReturnsStatus = 'ready' | 'loading' | 'error'

export interface CustodyReturnsState {
  status: CustodyReturnsStatus
  returns: CustodyReturnSummary[]
  /** Página que se está mostrando (la última que cargó bien). */
  page: number
  /** Página que se pidió: la que debe reintentarse cuando la carga falla. */
  requestedPage: number
  lastPage: number
  total: number
  error: string | null
}

/**
 * El detalle del resguardo ya trae el historial completo: si cabe en una página se pinta tal
 * cual, y si no se arranca con su primer tramo en «loading» para que la primera pintura ya
 * cuadre con el paginador mientras llega la página real.
 */
export function initialCustodyReturnsState(returns: CustodyReturnSummary[]): CustodyReturnsState {
  const total = returns.length
  const paginated = total > RETURNS_PAGE_SIZE

  return {
    status: paginated ? 'loading' : 'ready',
    returns: paginated ? returns.slice(0, RETURNS_PAGE_SIZE) : returns,
    page: 1,
    requestedPage: 1,
    lastPage: paginated ? Math.ceil(total / RETURNS_PAGE_SIZE) : 1,
    total,
    error: null,
  }
}
