import type { Pagination } from '../../shared/domain/pagination.model'
import type { Tool } from './tool.entity'

export interface ToolsPage extends Pagination {
  tools: Tool[]
}
