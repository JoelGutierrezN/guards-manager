import type { DownloadedFile } from '../../shared/domain/downloaded-file.model'
import type { ImportBatch } from './import-batch.entity'
import type { ImportAuditEntryAction } from './import-audit-entry.entity'
import type { ImportBatchesPage } from './import-batches-page.model'

export interface ImportRepository {
  downloadTemplate(): Promise<DownloadedFile>
  upload(file: File): Promise<ImportBatch>
  getBatch(id: string): Promise<ImportBatch>
  listHistory(): Promise<ImportBatchesPage>
  resolveEntry(entryId: string, action: ImportAuditEntryAction): Promise<void>
}
