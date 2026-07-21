import { useCallback } from 'react'
import axios from 'axios'
import { ApiError } from './api.error'

export function useHandleApiError(): (error: unknown) => never {
  return useCallback(function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        // throw new NetworkError()
      }

      const status = error?.response?.status

      switch (status) {
        case 401:
          // TODO Paso 4: limpiar sesión, dispatch AUTH_LOGOUT y navegar a /session-expired.
          throw 'UnauthorizedError'

        case 500:
          throw 'InternalServerError'

        default:
          throw new ApiError(
            error.response?.data?.message ?? 'Error en la petición',
            status,
            error?.response?.data,
          )
      }
    }
    throw 'UnexpectedError'
  }, [])
}
