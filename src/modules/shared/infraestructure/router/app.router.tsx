import { createBrowserRouter } from 'react-router'
import { AuthProvider } from '../../../auth/infraestructure/providers/auth.provider'
import { AuthMiddleware } from '../../../auth/infraestructure/middlewares/auth.middleware'
import { GuestMiddleware } from '../../../auth/infraestructure/middlewares/guest.middleware'
import AuthPage from '../../../auth/infraestructure/pages/auth.page'
import { AppLayout } from '../layouts/app.layout'
import { SessionExpiredPage } from '../pages/session-expired.page'

export default createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: '/session-expired',
        element: <SessionExpiredPage />,
      },
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
                path: 'personal',
                lazy: async () => ({
                  Component: (await import('../../../employees')).EmployeesPage,
                }),
              },
              {
                path: 'personal/:employeeId',
                lazy: async () => ({
                  Component: (
                    await import('../../../employees/infraestructure/pages/employee-file.page')
                  ).EmployeeFilePage,
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
