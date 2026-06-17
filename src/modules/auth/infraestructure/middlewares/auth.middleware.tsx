import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/use-auth.hook'

export function AuthMiddleware() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}
