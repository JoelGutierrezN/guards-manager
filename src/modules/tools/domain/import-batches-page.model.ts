import type { Pagination } from '../../shared/domain/pagination.model'
import type { ImportBatch } from './import-batch.entity'

export interface ImportBatchesPage extends Pagination {
  batches: ImportBatch[]
}
