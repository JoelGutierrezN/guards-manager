export interface BrandDeletionModelSummary {
  id: string
  name: string
  isDiscontinued: boolean
  pendingCustodiesCount: number
}

export interface BrandDeletionPendingCustody {
  custodyId: string
  custodyCode: string
  employeeId: string | null
  employeeName: string
  employeeIdentifier: string | null
  stockId: string
  stockConsecutive: string
  productName: string
  productModelName: string | null
}

export interface BrandDeletionAffectedProduct {
  id: string
  name: string
  productModelName: string | null
  stocksTotal: number
}

export interface BrandDeletionPreview {
  canBeDeleted: boolean
  reasons: string[]
  models: BrandDeletionModelSummary[]
  pendingCustodiesCount: number
  pendingCustodies: BrandDeletionPendingCustody[]
  affectedProducts: BrandDeletionAffectedProduct[]
}
