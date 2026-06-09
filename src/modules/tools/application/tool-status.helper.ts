import type { ToolStatus } from '../domain/tool.entity'
import type { ChipTone } from '../../shared/infraestructure/components/ui/chip.component'

export class ToolStatusHelper {
  static tone(status: ToolStatus): ChipTone {
    if (status === 'ok') return 'ok'
    if (status === 'warn') return 'warn'
    return 'danger'
  }

  static label(status: ToolStatus): string {
    if (status === 'ok') return 'disponible'
    if (status === 'warn') return 'stock bajo'
    return 'agotado'
  }

  static barColorClass(status: ToolStatus): string {
    if (status === 'low') return 'bg-danger'
    if (status === 'warn') return 'bg-warn'
    return 'bg-brand'
  }
}
