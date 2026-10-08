export interface ProductModelPendingCustody {
  custodyId: string
  custodyCode: string
  employeeId: string | null
  employeeName: string
  employeeIdentifier: string | null
  stockId: string
  stockConsecutive: string
  productName: string
}

export interface ProductModelAffectedProduct {
  id: string
  name: string
  stocksTotal: number
}

export interface ProductModelDeletionPreview {
  canBeDeleted: boolean
  isDiscontinued: boolean
  pendingCustodiesCount: number
  pendingCustodies: ProductModelPendingCustody[]
  affectedProducts: ProductModelAffectedProduct[]
}
