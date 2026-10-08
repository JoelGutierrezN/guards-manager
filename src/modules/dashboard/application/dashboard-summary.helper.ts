import type { DashboardKpis } from '../domain/dashboard-kpis.model'

export class DashboardSummaryHelper {
  static ledeFrom(kpis: DashboardKpis): string {
    return [
      DashboardSummaryHelper.phrase(kpis.custodiesActive, 'resguardo activo', 'resguardos activos'),
      DashboardSummaryHelper.phrase(kpis.pendingSignatures, 'firma pendiente', 'firmas pendientes'),
      DashboardSummaryHelper.phrase(kpis.alerts, 'alerta abierta', 'alertas abiertas'),
    ].join(' · ')
  }

  private static phrase(value: number, singular: string, plural: string): string {
    return `${value.toLocaleString('es-MX')} ${value === 1 ? singular : plural}`
  }
}
