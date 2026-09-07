import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { DownloadedFile } from '../../../shared/domain/downloaded-file.model'
import type { EmployeeFile } from '../../domain/employee-file.entity'
import type { EmployeeFileRepository as EmployeeFileRepositoryContract } from '../../domain/employee-file-repository'
import type { EmployeeFileDto } from '../dto/employee-file.dto'
import { EmployeeFileMapper } from '../mappers/employee-file.mapper'

const PDF_FALLBACK_FILENAME = 'expediente.pdf'

class EmployeeFileRepositoryImpl implements EmployeeFileRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async find(employeeId: string): Promise<EmployeeFile> {
    const response = await this.datasource.get<EmployeeFileDto>(`/employees/${employeeId}/file`)
    return EmployeeFileMapper.toEmployeeFile(response)
  }

  async downloadPdf(employeeId: string): Promise<DownloadedFile> {
    return this.datasource.getFile(`/employees/${employeeId}/file/pdf`, PDF_FALLBACK_FILENAME)
  }
}

export const employeeFileRepository = new EmployeeFileRepositoryImpl()
