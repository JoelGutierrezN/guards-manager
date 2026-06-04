import { createBrowserRouter } from 'react-router'
import AuthPage from '../../../auth/infraestructure/pages/auth.page'
import DashboardPage from '../pages/dashboard.page'

export default createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  }
])
