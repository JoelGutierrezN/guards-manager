import { createBrowserRouter, type UIMatch } from 'react-router'
import { AuthProvider } from '../../../auth/infraestructure/providers/auth.provider'
import { AuthMiddleware } from '../../../auth/infraestructure/middlewares/auth.middleware'
import { GuestMiddleware } from '../../../auth/infraestructure/middlewares/guest.middleware'
import AuthPage from '../../../auth/infraestructure/pages/auth.page'
import { AppLayout } from '../layouts/app.layout'
import { SessionExpiredPage } from '../pages/session-expired.page'
import { AppErrorPage } from '../pages/app-error.page'
import { NotFoundPage } from '../pages/not-found.page'
import type { CrumbHandle } from '../components/topbar/topbar.crumbs'
import type { CustodyDetailLoaderData } from '../../../custodies/domain/custody-detail-loader.model'

export default createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <AppErrorPage />,
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
                handle: { crumb: 'Panel general' },
                lazy: async () => ({
                  Component: (await import('../pages/dashboard-panel.page')).DashboardPanelPage,
                }),
              },
              {
                path: 'stockIn',
                handle: { crumb: ['Inventario', 'Ingreso de inventario'] },
                lazy: async () => ({
                  Component: (await import('../../../inventory')).StockInPage,
                }),
              },
              {
                path: 'newAssignment',
                handle: { crumb: ['Operación', 'Nueva asignación'] },
                lazy: async () => ({
                  Component: (await import('../pages/coming-soon.page')).ComingSoonPage,
                }),
              },
              {
                path: 'assignments',
                handle: { crumb: ['Operación', 'Resguardo'] },
                lazy: async () => ({
                  Component: (await import('../../../custodies')).CustodiesPage,
                }),
              },
              {
                path: 'assignments/:custodyId',
                handle: {
                  crumb: (match: UIMatch) => [
                    'Operación',
                    'Resguardo',
                    (match.data as CustodyDetailLoaderData | undefined)?.custody?.code ?? 'Detalle',
                  ],
                } satisfies CrumbHandle,
                lazy: async () => {
                  const custodiesModule = await import('../../../custodies')
                  return {
                    Component: custodiesModule.CustodyDetailPage,
                    loader: custodiesModule.custodyDetailLoader,
                  }
                },
              },
              {
                path: 'tools',
                handle: { crumb: ['Catálogos', 'Herramientas'] },
                lazy: async () => ({
                  Component: (await import('../../../tools')).ToolsPage,
                }),
              },
              {
                path: 'brands',
                handle: { crumb: ['Catálogos', 'Marcas'] },
                lazy: async () => ({
                  Component: (await import('../../../brands')).BrandsScreen,
                }),
              },
              {
                path: 'models',
                handle: { crumb: ['Catálogos', 'Modelos'] },
                lazy: async () => ({
                  Component: (await import('../../../models/infraestructure')).ModelsPage,
                }),
              },
              {
                path: 'personal',
                handle: { crumb: ['Catálogos', 'Personal'] },
                lazy: async () => ({
                  Component: (await import('../../../employees')).EmployeesPage,
                }),
              },
              {
                path: 'personal/:employeeId',
                handle: { crumb: ['Catálogos', 'Personal', 'Expediente'] },
                lazy: async () => ({
                  Component: (
                    await import('../../../employees/infraestructure/pages/employee-file.page')
                  ).EmployeeFilePage,
                }),
              },
              {
                path: 'profile',
                handle: { crumb: ['Cuenta', 'Mi perfil'] },
                lazy: async () => ({
                  Component: (await import('../pages/coming-soon.page')).ComingSoonPage,
                }),
              },
              {
                path: '*',
                element: <NotFoundPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])
