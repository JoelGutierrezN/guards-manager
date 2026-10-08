import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { UserFormErrors } from '../../application/user-form.model'

const GENERIC_MESSAGE = 'No se pudo guardar el usuario.'
const UNPROCESSABLE_STATUS = 422

interface ValidationBody {
  errors?: Record<string, string[]>
}

export class UserFormErrorHelper {
  static fieldErrorsFrom(error: unknown): UserFormErrors {
    if (!Axios.isAxiosError(error) || error.response?.status !== UNPROCESSABLE_STATUS) return {}

    const body = error.response.data as ValidationBody | undefined
    return {
      name: UserFormErrorHelper.firstMessage(body, 'name'),
      email: UserFormErrorHelper.firstMessage(body, 'email'),
      username: UserFormErrorHelper.firstMessage(body, 'username'),
      phone: UserFormErrorHelper.firstMessage(body, 'phone'),
      password: UserFormErrorHelper.firstMessage(body, 'password'),
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
