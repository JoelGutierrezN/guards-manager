export type ToolStatus = 'ok' | 'warn' | 'low'

export interface Tool {
  id: string
  name: string
  brand: string
  brandId: string | null
  model: string
  productModelId: string | null
  total: number
  available: number
  assigned: number
  unusable: number
  status: ToolStatus
}
