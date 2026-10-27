import type { SerialCorrectionAction, SerialCorrectionState } from './serial-correction-state.model'

export function serialCorrectionReducer(
  state: SerialCorrectionState,
  action: SerialCorrectionAction,
): SerialCorrectionState {
  switch (action.type) {
    case 'FIELD':
      return {
        ...state,
        [action.field]: action.value,
        confirming: false,
        errors: { message: null, stale: false },
      }
    case 'CONFIRM':
      return { ...state, confirming: action.value }
    case 'SAVE_START':
      return { ...state, saving: true, errors: { message: null, stale: false }, notice: null }
    case 'SAVE_SUCCESS':
      return {
        ...state,
        unit: action.unit,
        latest: action.correction,
        serial: '',
        reason: '',
        saving: false,
        confirming: false,
        notice: 'Serie corregida. El cambio quedó en el historial de la unidad.',
      }
    case 'SAVE_ERROR':
      return {
        ...state,
        saving: false,
        confirming: false,
        errors: action.errors,
        unit: action.errors.stale
          ? { ...state.unit, serial: action.errors.currentSerial ?? null }
          : state.unit,
      }
    case 'HISTORY_START':
      return { ...state, historyLoading: true, historyError: null }
    case 'HISTORY_SUCCESS':
      return { ...state, history: action.history, historyLoading: false, historyError: null }
    case 'HISTORY_ERROR':
      return { ...state, historyLoading: false, historyError: action.message }
    case 'DOWNLOAD':
      return { ...state, downloadingId: action.id, notice: action.notice ?? state.notice }
  }
}
