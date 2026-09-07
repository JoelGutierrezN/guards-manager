/** Cuerpo de los 409 de negocio del API: `{message, reasons?: string[]}` (sección 2.2 del plan). */
export interface ApiConflictDetail {
  message: string
  reasons: string[]
}
