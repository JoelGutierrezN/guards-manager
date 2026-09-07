import type { SidebarRoute } from './sidebar-route.model'

/** Espejo de `src/modules/shared/.../sidebar/sidebar.routes.ts`: si el menú cambia, el smoke falla. */
export const SIDEBAR_ROUTES: SidebarRoute[] = [
  { label: 'Panel', path: '/dashboard' },
  { label: 'Ingreso de inventario', path: '/stockIn' },
  { label: 'Nueva asignación', path: '/newAssignment' },
  { label: 'Resguardo', path: '/assignments' },
  { label: 'Herramientas', path: '/tools' },
  { label: 'Marcas', path: '/brands' },
  { label: 'Modelos', path: '/models' },
  { label: 'Personal', path: '/personal' },
  { label: 'Mi perfil', path: '/profile' },
]
