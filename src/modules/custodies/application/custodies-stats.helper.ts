import type { CustodiesStats } from '../domain/custodies-stats.entity'

const PENDING_LABEL = '—'

export class CustodiesStatsHelper {
  static quantityLabel(stats: CustodiesStats | null, key: keyof CustodiesStats): string {
    if (stats == null) return PENDING_LABEL
    return stats[key].toLocaleString('es-MX')
  }

  static activePercentLabel(stats: CustodiesStats | null): string | undefined {
    if (stats == null || stats.total === 0) return undefined
    return `${Math.round((stats.active / stats.total) * 100)}%`
  }

  static ledeText(stats: CustodiesStats | null): string {
    const total = CustodiesStatsHelper.quantityLabel(stats, 'total')
    const active = CustodiesStatsHelper.quantityLabel(stats, 'active')
    const partial = CustodiesStatsHelper.quantityLabel(stats, 'partial')
    const returned = CustodiesStatsHelper.quantityLabel(stats, 'returned')
    return `${total} resguardos registrados. ${active} activos, ${partial} parcialmente devueltos y ${returned} devueltos por completo.`
  }
}
