import type { EmployeeFileDocumentType } from '../../domain/employee-file-document.model'

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
  // Pendiente Fase 5: daños pendientes, el backend siempre responde null
  damagedItems: number | null
  documents: number
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

export interface EmployeeFileDocumentDto {
  id: string
  type: EmployeeFileDocumentType
  code: string
  title: string
  sizeBytes: number
  createdAt: string
  url: string
}

export interface EmployeeFileDto {
  employee: EmployeeFileProfileDto
  summary: EmployeeFileSummaryDto
  activeItems: EmployeeFileItemDto[]
  history: EmployeeFileEventDto[]
  documents: EmployeeFileDocumentDto[]
  // Pendiente Fase 5: daños pendientes, el backend siempre responde []
  damages: unknown[]
}
