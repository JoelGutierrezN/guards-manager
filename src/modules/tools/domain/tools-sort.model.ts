export const TOOLS_SORT_KEYS = ['name', 'stock', 'created_at'] as const

export type ToolsSortKey = (typeof TOOLS_SORT_KEYS)[number]

export type ToolsSortDirection = 'asc' | 'desc'

export interface ToolsSort {
  key: ToolsSortKey
  direction: ToolsSortDirection
}
