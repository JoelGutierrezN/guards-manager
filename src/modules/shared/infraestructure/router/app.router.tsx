import { createBrowserRouter } from 'react-router'
import AuthPage from '../../../auth/infraestructure/pages/auth.page'

export default createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />
  }
])
