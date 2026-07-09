import { createBrowserRouter } from 'react-router'
import { AuthProvider } from '../../../auth/infraestructure/providers/auth.provider'
import { AuthMiddleware } from '../../../auth/infraestructure/middlewares/auth.middleware'
import { GuestMiddleware } from '../../../auth/infraestructure/middlewares/guest.middleware'
import AuthPage from '../../../auth/infraestructure/pages/auth.page'
import { AppLayout } from '../layouts/app.layout'

export default createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <GuestMiddleware />,
        children: [
          {
            path: '/',
            element: <AuthPage />,
          },
        ],
      },
      {
        element: <AuthMiddleware />,
        children: [
          {
            Component: AppLayout,
            children: [
              {
                path: 'dashboard',
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
                path: 'brands',
                lazy: async () => ({
                  Component: (await import('../../../brands')).BrandsScreen,
                }),
              },
              {
                path: 'models',
                lazy: async () => ({
                  Component: (await import('../../../models/infraestructure')).ModelsPage,
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
        ],
      },
    ],
  },
])
