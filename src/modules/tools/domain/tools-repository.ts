import type { ToolsStats } from './tools-stats.entity'
import type { CatalogTree } from './catalog-option.model'
import type { ToolsPage } from './tools-page.model'

export interface ToolsRepository {
  getStats(): Promise<ToolsStats>
  getCatalogTree(): Promise<CatalogTree>
  listProducts(params: URLSearchParams): Promise<ToolsPage>
}
