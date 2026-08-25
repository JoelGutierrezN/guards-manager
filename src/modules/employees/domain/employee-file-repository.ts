import type { DownloadedFile } from '../../shared/domain/downloaded-file.model'
import type { EmployeeFile } from './employee-file.entity'

export interface EmployeeFileRepository {
  find(employeeId: string): Promise<EmployeeFile>
  downloadPdf(employeeId: string): Promise<DownloadedFile>
}
