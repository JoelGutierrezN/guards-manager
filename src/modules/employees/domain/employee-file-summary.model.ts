export interface EmployeeFileSummary {
  activeItems: number
  historicalItems: number
  returnedItems: number
  // TODO API: daños todavía no existen en backend, el contrato siempre envía null
  damagedItems: number | null
}
