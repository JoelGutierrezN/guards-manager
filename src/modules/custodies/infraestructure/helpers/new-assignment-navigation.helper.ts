import type { QueryParams } from '../../../shared/hooks/query-params.model'

const CUSTODIES_PATH = '/assignments'

export class NewAssignmentNavigationHelper {
  /** `useQueryParams` convierte a número los valores numéricos; el id llega en cualquiera de las dos formas. */
  static employeeIdFrom(params: QueryParams): string | null {
    const value = params.employeeId
    if (typeof value === 'number') return String(value)
    if (typeof value !== 'string') return null
    const trimmedValue = value.trim()
    return trimmedValue === '' ? null : trimmedValue
  }

  static custodyPath(custodyId: string): string {
    return `${CUSTODIES_PATH}/${custodyId}`
  }
}
