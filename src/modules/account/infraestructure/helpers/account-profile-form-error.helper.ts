import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { AccountProfileFormErrors } from '../../application/account-profile-form.model'

const GENERIC_MESSAGE = 'No se pudo actualizar el perfil.'
const UNPROCESSABLE_STATUS = 422

interface ValidationBody {
  errors?: Record<string, string[]>
}

export class AccountProfileFormErrorHelper {
  static fieldErrorsFrom(error: unknown): AccountProfileFormErrors {
    if (!Axios.isAxiosError(error) || error.response?.status !== UNPROCESSABLE_STATUS) return {}

    const body = error.response.data as ValidationBody | undefined
    return {
      name: AccountProfileFormErrorHelper.firstMessage(body, 'name'),
      email: AccountProfileFormErrorHelper.firstMessage(body, 'email'),
      username: AccountProfileFormErrorHelper.firstMessage(body, 'username'),
      phone: AccountProfileFormErrorHelper.firstMessage(body, 'phone'),
    }
  }

  static messageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, GENERIC_MESSAGE)
  }

  private static firstMessage(body: ValidationBody | undefined, field: string): string | undefined {
    const messages = body?.errors?.[field]
    if (!Array.isArray(messages)) return undefined
    const [first] = messages
    return typeof first === 'string' && first !== '' ? first : undefined
  }
}
