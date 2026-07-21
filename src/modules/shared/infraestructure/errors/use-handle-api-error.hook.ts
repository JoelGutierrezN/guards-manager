import { useCallback, useEffect, useRef, type Dispatch } from 'react'
import { useLocation, useNavigate } from 'react-router'
import axios from 'axios'
import { ApiError } from './api.error'
import { AuthSessionStorage } from '../../../auth/infraestructure/storage/auth-session.storage'
import type { AuthAction } from '../../../auth/application/auth-state.interfaces'

let sessionExpiredTriggered = false

export function resetSessionExpiredGuard(): void {
  sessionExpiredTriggered = false
}

export function useHandleApiError(dispatch: Dispatch<AuthAction>): (error: unknown) => never {
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)

  useEffect(() => {
    locationRef.current = location
  }, [location])

  return useCallback(function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status

      switch (status) {
        case 401: {
          const hasActiveSession = AuthSessionStorage.read() !== null
          if (hasActiveSession && !sessionExpiredTriggered) {
            sessionExpiredTriggered = true
            AuthSessionStorage.clear()
            dispatch({ type: 'AUTH_LOGOUT' })
            const { pathname, search } = locationRef.current
            navigate('/session-expired', { state: { from: { pathname, search } } })
          }
          throw 'UnauthorizedError'
        }

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
  }, [dispatch, navigate])
}
