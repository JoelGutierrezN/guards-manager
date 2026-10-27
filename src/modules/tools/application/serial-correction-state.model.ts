import type {
  SerialCorrection,
  SerialCorrectionErrors,
  SerialCorrectionsPage,
} from '../domain/serial-correction.model'
import type { ToolUnit } from '../domain/tool-unit.model'

export interface SerialCorrectionState {
  unit: ToolUnit
  serial: string
  reason: string
  confirming: boolean
  saving: boolean
  downloadingId: string | null
  latest: SerialCorrection | null
  errors: SerialCorrectionErrors
  history: SerialCorrectionsPage | null
  historyLoading: boolean
  historyError: string | null
  notice: string | null
}

export type SerialCorrectionAction =
  | { type: 'FIELD'; field: 'serial' | 'reason'; value: string }
  | { type: 'CONFIRM'; value: boolean }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; unit: ToolUnit; correction: SerialCorrection }
  | { type: 'SAVE_ERROR'; errors: SerialCorrectionErrors }
  | { type: 'HISTORY_START' }
  | { type: 'HISTORY_SUCCESS'; history: SerialCorrectionsPage }
  | { type: 'HISTORY_ERROR'; message: string }
  | { type: 'DOWNLOAD'; id: string | null; notice?: string }

export class SerialCorrectionStateHelper {
  static initial(unit: ToolUnit): SerialCorrectionState {
    return {
      unit,
      serial: '',
      reason: '',
      confirming: false,
      saving: false,
      downloadingId: null,
      latest: null,
      errors: { message: null, stale: false },
      history: null,
      historyLoading: true,
      historyError: null,
      notice: null,
    }
  }
}
