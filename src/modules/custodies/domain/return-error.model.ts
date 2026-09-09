export interface ReturnFieldErrors {
  items?: string
  notes?: string
}

/**
 * Error de la devolución listo para pintar: mensaje general, razones del 409, errores por
 * campo del 422 y errores por unidad (clave `items.{i}.stock_id` traducida a su `stockId`).
 */
export interface ReturnErrorReport {
  message: string
  reasons: string[]
  fieldErrors: ReturnFieldErrors
  itemErrors: Record<string, string>
}
