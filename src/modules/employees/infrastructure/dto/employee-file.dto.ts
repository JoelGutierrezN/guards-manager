export interface EmployeeFileProfileDto {
  id: string
  identifier: string
  name: string
  roleId: string
  roleName: string
  email: string | null
  phone: string | null
  status: 'activo' | 'inactivo'
  hireDate: string
}

export interface EmployeeFileSummaryDto {
  activeItems: number
  historicalItems: number
  returnedItems: number
  // TODO API: daños pendientes, el backend siempre responde null
  damagedItems: number | null
}

export interface EmployeeFileItemDto {
  id: string
  custodyId: string
  custodyCode: string
  stockId: string
  stockConsecutive: string
  productName: string
  brandName: string | null
  modelName: string | null
  condition: string
  assignedAt: string
}

export interface EmployeeFileEventDto {
  id: string
  type: 'alta' | 'asignacion' | 'devolucion'
  title: string
  body: string
  date: string
  time: string
  occurredAt: string
}

export interface EmployeeFileDto {
  employee: EmployeeFileProfileDto
  summary: EmployeeFileSummaryDto
  activeItems: EmployeeFileItemDto[]
  history: EmployeeFileEventDto[]
  // TODO API: documentos pendientes, el backend siempre responde []
  documents: unknown[]
  // TODO API: daños pendientes, el backend siempre responde []
  damages: unknown[]
}
