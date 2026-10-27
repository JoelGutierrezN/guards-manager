import { useCallback, useEffect, useReducer } from 'react'
import { FileDownloadHelper } from '../../shared/infraestructure/helpers/file-download.helper'
import { SerialCorrectionStateHelper } from '../application/serial-correction-state.model'
import { serialCorrectionReducer } from '../application/serial-correction.reducer'
import type { SerialCorrection } from '../domain/serial-correction.model'
import type { ToolUnit } from '../domain/tool-unit.model'
import { SerialCorrectionErrorHelper } from '../infraestructure/helpers/serial-correction-error.helper'
import { serialCorrectionsRepository } from '../infraestructure/repositories/serial-corrections.repository'

export function useSerialCorrection(unit: ToolUnit, onSaved: (unit: ToolUnit) => void) {
  const [state, dispatch] = useReducer(
    serialCorrectionReducer,
    unit,
    SerialCorrectionStateHelper.initial,
  )

  const loadHistory = useCallback(
    async (page: number) => {
      dispatch({ type: 'HISTORY_START' })
      try {
        const history = await serialCorrectionsRepository.list(unit.id, page)
        dispatch({ type: 'HISTORY_SUCCESS', history })
      } catch {
        dispatch({ type: 'HISTORY_ERROR', message: 'No se pudo cargar el historial de series.' })
      }
    },
    [unit.id],
  )

  useEffect(() => {
    void loadHistory(1)
  }, [loadHistory])

  const download = useCallback(async (correction: SerialCorrection) => {
    dispatch({ type: 'DOWNLOAD', id: correction.id })
    try {
      FileDownloadHelper.save(await serialCorrectionsRepository.download(correction))
      dispatch({
        type: 'DOWNLOAD',
        id: null,
        notice: 'Acuse descargado. Imprímelo y entrégalo al responsable.',
      })
    } catch {
      dispatch({
        type: 'DOWNLOAD',
        id: null,
        notice: 'No se pudo descargar el acuse. Puedes reintentarlo desde el historial.',
      })
    }
  }, [])

  const save = useCallback(async () => {
    if (state.saving || !state.confirming) return
    dispatch({ type: 'SAVE_START' })
    try {
      const result = await serialCorrectionsRepository.create(unit.id, {
        serial: state.serial,
        reason: state.reason,
        expectedSerial: state.unit.serial,
      })
      dispatch({ type: 'SAVE_SUCCESS', unit: result.stock, correction: result.correction })
      onSaved(result.stock)
      await loadHistory(1)
      if (result.correction.receipt !== null) await download(result.correction)
    } catch (error) {
      dispatch({ type: 'SAVE_ERROR', errors: SerialCorrectionErrorHelper.from(error) })
    }
  }, [
    state.saving,
    state.confirming,
    state.serial,
    state.reason,
    state.unit.serial,
    unit.id,
    onSaved,
    loadHistory,
    download,
  ])

  const setField = useCallback(
    (field: 'serial' | 'reason', value: string) => dispatch({ type: 'FIELD', field, value }),
    [],
  )
  const setConfirming = useCallback((value: boolean) => dispatch({ type: 'CONFIRM', value }), [])
  const canReview =
    state.serial.trim() !== '' &&
    state.serial.trim().toUpperCase() !== state.unit.serial &&
    state.serial.trim().length <= 255 &&
    !state.saving
  return { state, setField, setConfirming, canReview, save, download, loadHistory }
}
