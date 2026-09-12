import { useCallback, useEffect, useReducer, useRef } from 'react'
import { FileDownloadHelper } from '../../shared/infraestructure/helpers/file-download.helper'
import { ApiValidationErrorHelper } from '../../shared/infraestructure/errors/api-validation-error.helper'
import { BlobErrorHelper } from '../../shared/infraestructure/errors/blob-error.helper'
import { importRepository } from '../infraestructure/repositories/import.repository'
import { ImportErrorHelper } from '../infraestructure/helpers/import-error.helper'
import { ImportStatusHelper } from '../infraestructure/helpers/import-status.helper'
import { importReducer } from '../application/import.reducer'
import { INITIAL_IMPORT_STATE } from '../application/import-state.model'
import type { ImportTab } from '../application/import-state.model'
import type { ImportBatch } from '../domain/import-batch.entity'
import type { ImportAuditEntryAction } from '../domain/import-audit-entry.entity'

const POLL_INTERVAL_MS = 3000
/** Reintentos consecutivos del sondeo antes de rendirse y ofrecer el reintento manual. */
const MAX_POLL_FAILURES = 3
const POLL_FALLBACK_MESSAGE = 'No se pudo consultar el estado de la importación.'
const TEMPLATE_FALLBACK_MESSAGE = 'No se pudo descargar la plantilla.'
const RESOLVE_FALLBACK_MESSAGE = 'No se pudo resolver el duplicado.'

interface UseImportOptions {
  open: boolean
  onImported?: () => void
}

export function useImport({ open, onImported }: UseImportOptions) {
  const [state, dispatch] = useReducer(importReducer, INITIAL_IMPORT_STATE)
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Lote que el sondeo sigue ahora mismo: una respuesta de otro lote se descarta. */
  const activeBatchIdRef = useRef<string | null>(null)
  const pollFailuresRef = useRef(0)

  const clearPoll = useCallback(() => {
    activeBatchIdRef.current = null
    pollFailuresRef.current = 0
    if (pollTimeoutRef.current !== null) {
      clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearPoll, [clearPoll])

  useEffect(() => {
    clearPoll()
    if (open) dispatch({ type: 'RESET' })
  }, [open, clearPoll])

  const schedulePollRef = useRef<(batchId: string) => void>(() => {})

  const pollOnce = useCallback(
    (batchId: string) => {
      if (activeBatchIdRef.current !== batchId) return
      importRepository
        .getBatch(batchId)
        .then((batch) => {
          if (activeBatchIdRef.current !== batchId) return
          pollFailuresRef.current = 0
          dispatch({ type: 'BATCH_REFRESHED', batch })
          if (ImportStatusHelper.isFinished(batch.status)) {
            activeBatchIdRef.current = null
            onImported?.()
          } else {
            schedulePollRef.current(batchId)
          }
        })
        .catch((error: unknown) => {
          if (activeBatchIdRef.current !== batchId) return
          pollFailuresRef.current += 1
          if (pollFailuresRef.current < MAX_POLL_FAILURES) {
            schedulePollRef.current(batchId)
            return
          }
          activeBatchIdRef.current = null
          dispatch({
            type: 'POLL_ERROR',
            message: ApiValidationErrorHelper.messageFrom(error, POLL_FALLBACK_MESSAGE),
          })
        })
    },
    [onImported],
  )

  const schedulePoll = useCallback(
    (batchId: string) => {
      if (pollTimeoutRef.current !== null) clearTimeout(pollTimeoutRef.current)
      activeBatchIdRef.current = batchId
      pollTimeoutRef.current = setTimeout(() => pollOnce(batchId), POLL_INTERVAL_MS)
    },
    [pollOnce],
  )

  useEffect(() => {
    schedulePollRef.current = schedulePoll
  }, [schedulePoll])

  const retryPoll = useCallback(() => {
    const batch = state.batch
    if (batch === null) return
    pollFailuresRef.current = 0
    activeBatchIdRef.current = batch.id
    dispatch({ type: 'POLL_START' })
    pollOnce(batch.id)
  }, [state.batch, pollOnce])

  const setTab = useCallback((tab: ImportTab) => dispatch({ type: 'SET_TAB', tab }), [])

  const selectFile = useCallback((file: File | null) => dispatch({ type: 'SET_FILE', file }), [])

  const downloadTemplate = useCallback(async () => {
    dispatch({ type: 'TEMPLATE_START' })
    try {
      const file = await importRepository.downloadTemplate()
      FileDownloadHelper.save(file)
    } catch (error) {
      dispatch({
        type: 'TEMPLATE_ERROR',
        message: await BlobErrorHelper.messageFrom(error, TEMPLATE_FALLBACK_MESSAGE),
      })
    } finally {
      dispatch({ type: 'TEMPLATE_DONE' })
    }
  }, [])

  const upload = useCallback(async () => {
    if (state.selectedFile === null) return
    dispatch({ type: 'UPLOAD_START' })
    try {
      const batch: ImportBatch = await importRepository.upload(state.selectedFile)
      dispatch({ type: 'UPLOAD_SUCCESS', batch })
      // Con `QUEUE_CONNECTION=sync` el 202 ya llega terminado: no hay sondeo que avise después.
      if (ImportStatusHelper.isFinished(batch.status)) onImported?.()
      else schedulePoll(batch.id)
    } catch (error) {
      dispatch({ type: 'UPLOAD_ERROR', message: ImportErrorHelper.messageFrom(error) })
    }
  }, [state.selectedFile, schedulePoll, onImported])

  const resolveEntry = useCallback(
    async (entryId: string, action: ImportAuditEntryAction) => {
      if (state.batch === null) return
      dispatch({ type: 'RESOLVE_START', entryId })
      try {
        await importRepository.resolveEntry(entryId, action)
        const batch = await importRepository.getBatch(state.batch.id)
        dispatch({ type: 'BATCH_REFRESHED', batch })
      } catch (error) {
        dispatch({
          type: 'RESOLVE_ERROR',
          message: ApiValidationErrorHelper.messageFrom(error, RESOLVE_FALLBACK_MESSAGE),
        })
      } finally {
        dispatch({ type: 'RESOLVE_DONE' })
      }
    },
    [state.batch],
  )

  const loadHistory = useCallback(async () => {
    dispatch({ type: 'HISTORY_START' })
    try {
      const page = await importRepository.listHistory()
      dispatch({ type: 'HISTORY_SUCCESS', history: page.batches })
    } catch {
      dispatch({ type: 'HISTORY_ERROR' })
    }
  }, [])

  useEffect(() => {
    if (open && state.tab === 'history' && state.historyStatus === 'idle') {
      void loadHistory()
    }
  }, [open, state.tab, state.historyStatus, loadHistory])

  return {
    state,
    setTab,
    selectFile,
    downloadTemplate,
    upload,
    resolveEntry,
    retryPoll,
    loadHistory,
  }
}
