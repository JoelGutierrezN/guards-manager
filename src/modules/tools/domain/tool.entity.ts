export type ToolStatus = 'ok' | 'warn' | 'low'

export interface Tool {
  id: number
  name: string
  brand: string
  model: string
  total: number
  available: number
  assigned: number
  status: ToolStatus
}
