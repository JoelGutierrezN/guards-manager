import type { ChipTone } from '../../../shared/infraestructure/components/ui'
import type { ImportBatchStatus } from '../../domain/import-batch.entity'

const LABELS: Record<ImportBatchStatus, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  failed: 'Con errores',
}

const TONES: Record<ImportBatchStatus, ChipTone> = {
  pending: 'default',
  processing: 'navy',
  completed: 'ok',
  failed: 'danger',
}

export class ImportStatusHelper {
  static label(status: ImportBatchStatus): string {
    return LABELS[status]
  }

  static tone(status: ImportBatchStatus): ChipTone {
    return TONES[status]
  }

  static isFinished(status: ImportBatchStatus): boolean {
    return status === 'completed' || status === 'failed'
  }
}
