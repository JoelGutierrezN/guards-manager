import { BlobErrorHelper } from '../../../shared/infraestructure/errors/blob-error.helper'

const GENERIC_MESSAGE = 'No se pudo exportar el personal.'

export class EmployeeExportErrorHelper {
  static messageFrom(error: unknown): Promise<string> {
    return BlobErrorHelper.messageFrom(error, GENERIC_MESSAGE)
  }
}
