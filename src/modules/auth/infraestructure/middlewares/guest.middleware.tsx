import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/use-auth.hook'
import { FromLocationHelper } from '../from-location.helper'
import type { FromLocationState } from '../from-location-state.interfaces'

export function GuestMiddleware() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const state = location.state as FromLocationState | null

  if (isAuthenticated) {
    return <Navigate to={FromLocationHelper.resolvePath(state)} replace />
  }

  return <Outlet />
}
