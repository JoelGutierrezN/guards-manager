import { AppRouteHelper } from '../../router/app-route.helper'
import type { SidebarGroup } from '../sidebar'
import type { CommandPaletteNavItem, CommandPaletteSearchAction } from './command-palette.model'

const SEARCH_TARGETS = [
  { id: 'personal', label: 'Personal', param: 'q', path: '/personal' },
  { id: 'tools', label: 'Herramientas', param: 'name', path: '/tools' },
  { id: 'assignments', label: 'Resguardos', param: 'q', path: '/assignments' },
] as const

export class CommandPaletteHelper {
  static buildNavigationItems(groups: SidebarGroup[]): CommandPaletteNavItem[] {
    return groups.flatMap((group) =>
      group.items.map((item) => ({
        id: item.id,
        label: item.label,
        groupTitle: group.title,
        icon: item.icon,
        path: AppRouteHelper.pathForId(item.id),
      })),
    )
  }

  static filterNavigationItems(
    items: CommandPaletteNavItem[],
    query: string,
  ): CommandPaletteNavItem[] {
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery === '') return items
    return items.filter((item) => item.label.toLowerCase().includes(normalizedQuery))
  }

  static buildSearchActions(query: string): CommandPaletteSearchAction[] {
    const trimmedQuery = query.trim()
    if (trimmedQuery === '') return []

    return SEARCH_TARGETS.map((target) => ({
      id: target.id,
      label: `Buscar «${trimmedQuery}» en ${target.label}`,
      path: `${target.path}?${target.param}=${encodeURIComponent(trimmedQuery)}`,
    }))
  }
}
