import Axios from 'axios'

const GENERIC_MESSAGE = 'No se pudo guardar el modelo.'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

export class ModelFormErrorHelper {
  static messageFrom(error: unknown): string {
    if (!Axios.isAxiosError(error)) return GENERIC_MESSAGE
    const body = error.response?.data as ValidationErrorBody | undefined
    const fieldMessages = body?.errors != null ? Object.values(body.errors).flat() : []
    const [firstFieldMessage] = fieldMessages
    if (typeof firstFieldMessage === 'string' && firstFieldMessage !== '') return firstFieldMessage
    if (typeof body?.message === 'string' && body.message !== '') return body.message
    return GENERIC_MESSAGE
  }
}
