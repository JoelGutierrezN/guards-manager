import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/use-auth.hook'

export function AuthMiddleware() {
  const { isAuthenticated, sessionExpired } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const target = sessionExpired ? '/session-expired' : '/'
    return <Navigate to={target} state={{ from: { pathname: location.pathname, search: location.search } }} replace />
  }

  return <Outlet />
}
