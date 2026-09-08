export interface NewAssignmentFieldErrors {
  employee?: string
  items?: string
  notes?: string
}

/**
 * Error del wizard listo para pintar: mensaje general, razones del 409, errores por campo
 * del 422 y errores por unidad (clave `items.{i}.stock_id` traducida a su `stockId`).
 */
export interface NewAssignmentErrorReport {
  message: string
  reasons: string[]
  fieldErrors: NewAssignmentFieldErrors
  itemErrors: Record<string, string>
}
