export interface ToolModel {
  brand: string
  code: string
  desc: string
  tools: number
  asg: number
}

export const BRANDS_FILTER = ['Todas', 'DeWalt', 'Makita', 'Milwaukee', 'Bosch', 'Fluke'] as const

export const MODELS: ToolModel[] = []

export const usagePct = (asg: number, tools: number): number =>
  tools > 0 ? Math.round((asg / tools) * 100) : 0
