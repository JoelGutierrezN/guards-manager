import Axios from 'axios'
import { ApiValidationErrorHelper } from './api-validation-error.helper'

/** Con `responseType: 'blob'` el cuerpo de error de Axios llega como Blob en vez de JSON. */
export class BlobErrorHelper {
  static async messageFrom(error: unknown, fallback: string): Promise<string> {
    if (!Axios.isAxiosError(error)) return fallback

    const body: unknown = error.response?.data
    if (!(body instanceof Blob)) return ApiValidationErrorHelper.messageFrom(error, fallback)

    return ApiValidationErrorHelper.messageFromBody(await BlobErrorHelper.parse(body), fallback)
  }

  private static async parse(body: Blob): Promise<unknown> {
    try {
      return JSON.parse(await body.text())
    } catch {
      return undefined
    }
  }
}
