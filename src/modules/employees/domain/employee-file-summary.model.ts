export interface EmployeeFileSummary {
  activeItems: number
  historicalItems: number
  returnedItems: number
  // Pendiente Fase 5: los daños todavía no existen en el backend, el contrato siempre envía null
  damagedItems: number | null
}
