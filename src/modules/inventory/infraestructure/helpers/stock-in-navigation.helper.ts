import type { QueryParams } from '../../../shared/hooks/query-params.model'

const STOCK_IN_PATH = '/stockIn'
const TOOLS_PATH = '/tools'

export class StockInNavigationHelper {
  /** `useQueryParams` convierte a número los valores numéricos; el id puede llegar en cualquiera de las dos formas. */
  static productIdFrom(params: QueryParams): string | null {
    const value = params.productId
    if (typeof value === 'number') return String(value)
    if (typeof value !== 'string') return null
    const trimmedValue = value.trim()
    return trimmedValue === '' ? null : trimmedValue
  }

  /** Herramientas abre su modal de alta con `?new=1` y vuelve aquí al terminar. */
  static newProductPath(): string {
    return `${TOOLS_PATH}?new=1&returnTo=${STOCK_IN_PATH}`
  }

  static toolsPathFor(productName: string): string {
    return `${TOOLS_PATH}?name=${encodeURIComponent(productName)}`
  }
}
