import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { ToolFormErrors } from '../../application/tool-form.model'

const GENERIC_MESSAGE = 'No se pudo guardar la herramienta.'
const UNPROCESSABLE_STATUS = 422

interface ValidationBody {
  errors?: Record<string, string[]>
}

export class ToolFormErrorHelper {
  static fieldErrorsFrom(error: unknown): ToolFormErrors {
    if (!Axios.isAxiosError(error) || error.response?.status !== UNPROCESSABLE_STATUS) return {}

    const body = error.response.data as ValidationBody | undefined
    return {
      name: ToolFormErrorHelper.firstMessage(body, 'name'),
      brandId: ToolFormErrorHelper.firstMessage(body, 'brand_id'),
      productModelId: ToolFormErrorHelper.firstMessage(body, 'product_model_id'),
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
