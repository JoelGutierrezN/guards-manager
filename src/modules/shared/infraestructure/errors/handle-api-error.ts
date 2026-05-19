import axios from 'axios'
import { ApiError } from './api.error'

export function handleApiError (error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      // throw new NetworkError()
    }

    const status = error?.response?.status

    switch (status) {
      case 401:
        throw 'UnauthorizedError'
      //   throw new UnauthorizedError()

      case 500:
        throw 'InternalServerError'
      //   throw new ApiError('Error interno del servidor', 500)

      default:
        throw new ApiError(
          error.response?.data?.message ?? 'Error en la petición',
          status,
          error?.response?.data
        )
    }
  }
  throw 'UnexpectedError'
  //   throw new UnexpectedError(error)
}
