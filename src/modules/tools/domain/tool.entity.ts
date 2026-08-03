export type ToolStatus = 'ok' | 'warn' | 'low'

export interface Tool {
  id: string
  name: string
  brand: string
  model: string
  total: number
  assigned: number
  status: ToolStatus
}
