import type { QueryParamValue } from '../../../shared/hooks/query-params.model'

export class ToolsEntryParamsHelper {
  static isCreateRequested(value: QueryParamValue): boolean {
    return value === 1 || value === '1' || value === true
  }

  /** Solo se aceptan rutas internas para evitar redirigir fuera de la aplicación. */
  static safeReturnTo(value: QueryParamValue): string | null {
    if (typeof value !== 'string') return null
    if (!value.startsWith('/') || value.startsWith('//')) return null
    return value
  }

  /** Devuelve al origen con la herramienta recién creada ya seleccionada. */
  static withProductId(path: string, productId: string): string {
    const [pathname, search] = path.split('?')
    const params = new URLSearchParams(search ?? '')
    params.set('productId', productId)
    return `${pathname}?${params.toString()}`
  }
}
