import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { DownloadedFile } from '../../../shared/domain/downloaded-file.model'
import type { ImportRepository as ImportRepositoryContract } from '../../domain/import-repository'
import type { ImportBatch } from '../../domain/import-batch.entity'
import type { ImportAuditEntryAction } from '../../domain/import-audit-entry.entity'
import type { ImportBatchesPage } from '../../domain/import-batches-page.model'
import type { ImportBatchCollectionDto, ImportBatchDto } from '../dto/import-batch.dto'
import { ImportMapper } from '../mappers/import.mapper'

const TEMPLATE_FALLBACK_FILENAME = 'plantilla-productos.xlsx'

class ImportRepositoryImpl implements ImportRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  downloadTemplate(): Promise<DownloadedFile> {
    return this.datasource.getFile('/products/import/template', TEMPLATE_FALLBACK_FILENAME)
  }

  async upload(file: File): Promise<ImportBatch> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await this.datasource.post<ImportBatchDto>('/products/import', formData)
    return ImportMapper.toBatch(response)
  }

  async getBatch(id: string): Promise<ImportBatch> {
    const response = await this.datasource.get<ImportBatchDto>(`/import-batches/${id}`)
    return ImportMapper.toBatch(response)
  }

  async listHistory(): Promise<ImportBatchesPage> {
    const response = await this.datasource.get<ImportBatchCollectionDto>('/import-batches')
    return ImportMapper.toBatchesPage(response)
  }

  async resolveEntry(entryId: string, action: ImportAuditEntryAction): Promise<void> {
    await this.datasource.post(`/import-audit-entries/${entryId}/resolve`, { action })
  }
}

export const importRepository = new ImportRepositoryImpl()
