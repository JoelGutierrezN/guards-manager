import {
  Alert02Icon,
  Book02Icon,
  DeliveryBox01Icon,
  File01Icon,
  Home09Icon,
  Layers01Icon,
  SentIcon,
  UserGroupIcon,
  UserIcon,
  Wrench01Icon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export interface SidebarItem {
  id: string
  label: string
  icon: IconSvgElement
  badge?: string
}

export interface SidebarGroup {
  title: string
  featured?: boolean
  items: SidebarItem[]
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: 'General',
    items: [{ id: 'dashboard', label: 'Panel', icon: Home09Icon }],
  },
  {
    title: 'Acciones principales',
    featured: true,
    items: [
      { id: 'stockIn', label: 'Ingreso de inventario', icon: DeliveryBox01Icon },
      { id: 'newAssignment', label: 'Nueva asignación', icon: SentIcon },
    ],
  },
  {
    title: 'Operación',
    items: [{ id: 'assignments', label: 'Resguardo', icon: File01Icon }],
  },
  {
    title: 'Catálogos',
    items: [
      { id: 'tools', label: 'Herramientas', icon: Wrench01Icon },
      { id: 'brands', label: 'Marcas', icon: Book02Icon },
      { id: 'models', label: 'Modelos', icon: Layers01Icon },
      { id: 'employees', label: 'Personal', icon: UserGroupIcon },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      { id: 'profile', label: 'Mi perfil', icon: UserIcon },
      { id: 'errors', label: 'Estados', icon: Alert02Icon, badge: 'demo' },
    ],
  },
]
