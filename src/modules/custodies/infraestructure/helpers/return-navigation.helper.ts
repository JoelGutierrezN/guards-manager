import type { QueryParams } from '../../../shared/hooks/query-params.model'

const CUSTODIES_PATH = '/assignments'
const EMPLOYEES_PATH = '/personal'
const STOCK_IDS_SEPARATOR = ','

export class ReturnNavigationHelper {
  /** `/assignments/:custodyId/return?stockIds=a,b` con las unidades preseleccionadas. */
  static returnPath(custodyId: string, stockIds: readonly string[] = []): string {
    const basePath = `${CUSTODIES_PATH}/${custodyId}/return`
    if (stockIds.length === 0) return basePath
    const query = new URLSearchParams({ stockIds: stockIds.join(STOCK_IDS_SEPARATOR) })
    return `${basePath}?${query.toString()}`
  }

  static custodyPath(custodyId: string): string {
    return `${CUSTODIES_PATH}/${custodyId}`
  }

  static custodiesPath(): string {
    return CUSTODIES_PATH
  }

  static employeeFilePath(employeeId: string): string {
    return `${EMPLOYEES_PATH}/${employeeId}`
  }

  /** `useQueryParams` convierte a número los valores numéricos; el id llega en ambas formas. */
  static stockIdsFrom(params: QueryParams): string[] {
    const value = params.stockIds
    if (typeof value === 'number') return [String(value)]
    if (Array.isArray(value)) {
      return value
        .map((entry) => (entry == null ? '' : String(entry).trim()))
        .filter((entry) => entry !== '')
    }
    if (typeof value !== 'string') return []
    return value
      .split(STOCK_IDS_SEPARATOR)
      .map((entry) => entry.trim())
      .filter((entry) => entry !== '')
  }
}
