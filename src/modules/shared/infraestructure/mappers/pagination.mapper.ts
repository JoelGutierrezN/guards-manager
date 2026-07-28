import type { Pagination } from '../../domain/pagination.model'
import type { PaginationMetaDto } from '../dto/pagination-meta.dto'

export class PaginationMapper {
  static toPagination(meta: PaginationMetaDto): Pagination {
    const { current_page, last_page, per_page, total } = meta

    return {
      page: current_page,
      perPage: per_page,
      lastPage: last_page,
      total,
    }
  }
}
