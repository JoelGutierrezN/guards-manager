import Axios from 'axios'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

export class ApiValidationErrorHelper {
  static messageFrom(error: unknown, fallback: string): string {
    if (!Axios.isAxiosError(error)) return fallback
    return ApiValidationErrorHelper.messageFromBody(error.response?.data, fallback)
  }

  static messageFromBody(body: unknown, fallback: string): string {
    const validation = body as ValidationErrorBody | undefined
    const fieldMessages = validation?.errors != null ? Object.values(validation.errors).flat() : []
    const [firstFieldMessage] = fieldMessages
    if (typeof firstFieldMessage === 'string' && firstFieldMessage !== '') return firstFieldMessage
    if (typeof validation?.message === 'string' && validation.message !== '') {
      return validation.message
    }
    return fallback
  }
}
