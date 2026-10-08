export interface StockInRange {
  from: string
  to: string
}

export interface StockInProductSummary {
  id: string
  name: string
  total: number
  available: number
  assigned: number
  unusable: number
}

export interface StockInResult {
  createdCount: number
  range: StockInRange
  product: StockInProductSummary
}
