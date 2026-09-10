import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import { FileDownloadHelper } from '../../../shared/infraestructure/helpers/file-download.helper'
import { BlobErrorHelper } from '../../../shared/infraestructure/errors/blob-error.helper'
import type { EmployeeFileDocument } from '../../domain/employee-file-document.model'
import type { EmployeeFileDocumentDownloadResult } from './employee-file-document-download-result.model'

const DOWNLOAD_GENERIC_MESSAGE = 'No se pudo descargar el documento.'

export class EmployeeFileDocumentDownloadService {
  static async download(
    document: EmployeeFileDocument,
  ): Promise<EmployeeFileDocumentDownloadResult> {
    try {
      const file = await HttpDataSource.getInstance().getFile(document.url, `${document.code}.pdf`)
      FileDownloadHelper.save(file)
      return { succeeded: true, message: `Documento descargado: ${file.filename}` }
    } catch (error) {
      const message = await BlobErrorHelper.messageFrom(error, DOWNLOAD_GENERIC_MESSAGE)
      return { succeeded: false, message }
    }
  }
}
