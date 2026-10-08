import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  PackageOpenIcon,
  ToolsIcon,
  UserGroupIcon,
  WrenchIcon,
} from '@hugeicons/core-free-icons'
import type { DashboardKpis } from '../domain/dashboard-kpis.model'
import type { DashboardKpiCard } from './dashboard-kpi-card.model'

export class DashboardKpiCardsHelper {
  static build(kpis: DashboardKpis): DashboardKpiCard[] {
    return [
      {
        key: 'toolsTotal',
        label: 'Herramientas totales',
        value: kpis.toolsTotal,
        caption: 'unidades registradas',
        icon: ToolsIcon,
        tone: 'default',
      },
      {
        key: 'toolsAvailable',
        label: 'Disponibles',
        value: kpis.toolsAvailable,
        caption: DashboardKpiCardsHelper.shareCaption(kpis.toolsAvailable, kpis.toolsTotal),
        icon: CheckmarkCircle02Icon,
        tone: 'cream',
      },
      {
        key: 'toolsAssigned',
        label: 'Asignadas',
        value: kpis.toolsAssigned,
        caption: DashboardKpiCardsHelper.shareCaption(kpis.toolsAssigned, kpis.toolsTotal),
        icon: PackageOpenIcon,
        tone: 'default',
      },
      {
        key: 'toolsUnusable',
        label: 'Inutilizables',
        value: kpis.toolsUnusable,
        caption: DashboardKpiCardsHelper.shareCaption(kpis.toolsUnusable, kpis.toolsTotal),
        icon: WrenchIcon,
        tone: 'lavender',
      },
      {
        key: 'employeesActive',
        label: 'Empleados activos',
        value: kpis.employeesActive,
        caption: 'con alta vigente',
        icon: UserGroupIcon,
        tone: 'default',
      },
      {
        key: 'criticalStockProducts',
        label: 'Stock crítico',
        value: kpis.criticalStockProducts,
        caption: 'productos bajo el umbral',
        icon: Alert02Icon,
        tone: 'cream',
      },
    ]
  }

  private static shareCaption(value: number, total: number): string {
    if (total <= 0) return 'sin unidades registradas'
    return `${Math.round((value / total) * 100)} % del inventario`
  }
}
