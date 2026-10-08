import type { ChipTone } from '../../shared/infraestructure/components/ui'
import type { DashboardActivityType } from '../domain/dashboard-activity-type.model'

const LABELS: Record<DashboardActivityType, string> = {
  asignacion: 'Asignación',
  devolucion: 'Devolución',
}

const TONES: Record<DashboardActivityType, ChipTone> = {
  asignacion: 'navy',
  devolucion: 'ok',
}

export class DashboardActivityTypeHelper {
  static label(type: DashboardActivityType): string {
    return LABELS[type]
  }

  static tone(type: DashboardActivityType): ChipTone {
    return TONES[type]
  }
}
