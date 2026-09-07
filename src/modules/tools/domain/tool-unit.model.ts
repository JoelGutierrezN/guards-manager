import type { ItemCondition } from '../../shared/domain/item-condition.model'

export type StockUnitStatus = 'available' | 'assigned' | 'unusable'

export interface StockUnitCustody {
  id: string
  code: string
  employeeId: string
  employeeName: string
  employeeIdentifier: string
  assignedAt: string
}

export interface ToolUnit {
  id: string
  consecutive: string
  condition: ItemCondition
  status: StockUnitStatus
  custody: StockUnitCustody | null
  createdAt: string
}
