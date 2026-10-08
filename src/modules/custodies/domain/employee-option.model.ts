export interface EmployeeOption {
  id: string
  identifier: string
  name: string
  roleName: string | null
  /** `null` cuando el origen no publica el conteo (`GET /employees/{id}` no lo incluye). */
  activeToolsCount: number | null
}
