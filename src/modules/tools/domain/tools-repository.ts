import type { ToolsStats } from './tools-stats.entity'
import type { CatalogTree } from './catalog-option.model'
import type { Tool } from './tool.entity'
import type { ToolInput } from './tool-input.model'
import type { ToolsPage } from './tools-page.model'

export interface ToolsRepository {
  getStats(): Promise<ToolsStats>
  getCatalogTree(): Promise<CatalogTree>
  listProducts(params: URLSearchParams): Promise<ToolsPage>
  create(input: ToolInput): Promise<Tool>
  update(id: string, input: ToolInput): Promise<Tool>
  remove(id: string): Promise<void>
}
