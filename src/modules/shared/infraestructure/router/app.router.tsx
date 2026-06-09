import { createBrowserRouter } from 'react-router'
import AuthPage from '../../../auth/infraestructure/pages/auth.page'
import { DashboardLayout } from '../layouts/dashboard.layout'

export default createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('../pages/dashboard-panel.page')).DashboardPanelPage,
        }),
      },
      {
        path: 'tools',
        lazy: async () => ({
          Component: (await import('../../../tools')).ToolsPage,
        }),
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('../pages/coming-soon.page')).ComingSoonPage,
        }),
      },
    ],
  },
])
