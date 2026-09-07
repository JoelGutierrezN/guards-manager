export interface StockInFieldErrors {
  product?: string
  quantity?: string
  condition?: string
}

/** Error del ingreso listo para pintar: mensaje general, razones del 409 y errores por campo del 422. */
export interface StockInErrorReport {
  message: string
  reasons: string[]
  fieldErrors: StockInFieldErrors
}
