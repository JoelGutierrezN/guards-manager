import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import type { EmployeeFileAlertType } from '../../domain/employee-file-alert.model'
import type { EmployeeFileDocumentType } from '../../domain/employee-file-document.model'
import type {
  EmployeeFileEventTone,
  EmployeeFileEventType,
} from '../../domain/employee-file-event.model'

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
  damagedItems: number
  documents: number
}

export interface EmployeeFileAlertDto {
  type: EmployeeFileAlertType
  message: string
  date: string
}

export interface EmployeeFileDamageStockDto {
  id: string
  consecutive: string
  productName: string
  brandName: string | null
  modelName: string | null
}

export interface EmployeeFileDamageDto {
  id: string
  returnId: string
  returnCode: string
  date: string
  condition: ItemCondition
  notes: string | null
  stock: EmployeeFileDamageStockDto
  sheetUrl: string | null
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
  type: EmployeeFileEventType
  tone: EmployeeFileEventTone
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
  damages: EmployeeFileDamageDto[]
  alerts: EmployeeFileAlertDto[]
  alertsCount: number
}
