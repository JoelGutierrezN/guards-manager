import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/use-auth.hook'
import type { FromLocationState } from '../from-location-state.interfaces'

export function GuestMiddleware() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const state = location.state as FromLocationState | null

  if (isAuthenticated) {
    return <Navigate to={state?.from?.pathname ?? '/dashboard'} replace />
  }

  return <Outlet />
}
