import type { EmployeesStats } from '../domain/employees-stats.entity'

const PENDING_LABEL = '—'

export class EmployeesStatsHelper {
  static quantityLabel(stats: EmployeesStats | null, key: keyof EmployeesStats): string {
    if (!stats) return PENDING_LABEL
    return stats[key].toLocaleString('es-MX')
  }

  static assignedPercentLabel(stats: EmployeesStats | null): string | undefined {
    if (!stats || stats.totalEmployees === 0) return undefined
    const percent = Math.round((stats.withActiveTools / stats.totalEmployees) * 100)
    return `${percent}%`
  }

  static ledeText(stats: EmployeesStats | null): string {
    const total = EmployeesStatsHelper.quantityLabel(stats, 'totalEmployees')
    const withTools = EmployeesStatsHelper.quantityLabel(stats, 'withActiveTools')
    const withAlerts = EmployeesStatsHelper.quantityLabel(stats, 'withAlerts')
    return `${total} colaboradores activos. ${withTools} con herramientas en uso, ${withAlerts} requieren tu atención por devoluciones vencidas.`
  }
}
