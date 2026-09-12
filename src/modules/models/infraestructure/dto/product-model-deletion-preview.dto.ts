export interface ProductModelPendingCustodyDto {
  custodyId: string
  custodyCode: string
  employeeId: string | null
  employeeName: string
  employeeIdentifier: string | null
  stockId: string
  stockConsecutive: string
  productName: string
}

export interface ProductModelAffectedProductDto {
  id: string
  name: string
  stocksTotal: number
}

export interface ProductModelDeletionPreviewDto {
  canBeDeleted: boolean
  isDiscontinued: boolean
  pendingCustodiesCount: number
  pendingCustodies: ProductModelPendingCustodyDto[]
  affectedProducts: ProductModelAffectedProductDto[]
}
