export interface CreatedStock {
  id: string
  consecutive: string
}

export interface CreatedStockBatch {
  created: CreatedStock[]
}

export interface CreatedCustody {
  id: string
  code: string
}
