export interface StockBulkRangeDto {
  from: string
  to: string
}

export interface StockBulkProductDto {
  id: string
  name: string
  total: number
  available: number
  assigned: number
  unusable: number
}

export interface StockBulkCreatedDto {
  id: string
  consecutive: string
}

export interface StockBulkResponseDto {
  created: StockBulkCreatedDto[]
  range: StockBulkRangeDto
  product: StockBulkProductDto
}
