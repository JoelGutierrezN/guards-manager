export interface BrandDeletionModelSummaryDto {
  id: string
  name: string
  isDiscontinued: boolean
  pendingCustodiesCount: number
}

export interface BrandDeletionPendingCustodyDto {
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

export interface BrandDeletionAffectedProductDto {
  id: string
  name: string
  productModelName: string | null
  stocksTotal: number
}

export interface BrandDeletionPreviewDto {
  canBeDeleted: boolean
  reasons: string[]
  models: BrandDeletionModelSummaryDto[]
  pendingCustodiesCount: number
  pendingCustodies: BrandDeletionPendingCustodyDto[]
  affectedProducts: BrandDeletionAffectedProductDto[]
}
