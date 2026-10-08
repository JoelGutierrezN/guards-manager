import type { ItemCondition } from '../../shared/domain/item-condition.model'

export interface EmployeeFileDamageStock {
  id: string
  consecutive: string
  productName: string
  brandName: string | null
  modelName: string | null
}

export interface EmployeeFileDamage {
  id: string
  returnId: string
  returnCode: string
  date: string
  condition: ItemCondition
  notes: string | null
  stock: EmployeeFileDamageStock
  sheetUrl: string | null
}
