export interface ProductModel {
  id: string
  name: string
  brandId: string
  brandName: string
  stocksTotal: number
  stocksAssigned: number
  usagePercentage: number
  active: boolean
  discontinuationReason: string | null
}
