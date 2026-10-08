import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'

const OVERVIEW_MESSAGE = 'No se pudo cargar el panel.'

export class DashboardErrorHelper {
  static overviewMessageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, OVERVIEW_MESSAGE)
  }
}
