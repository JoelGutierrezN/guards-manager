import { useCallback, useEffect, useReducer, useRef } from 'react'
import { FileDownloadHelper } from '../../shared/infraestructure/helpers/file-download.helper'
import { importRepository } from '../infraestructure/repositories/import.repository'
import { ImportErrorHelper } from '../infraestructure/helpers/import-error.helper'
import { ImportStatusHelper } from '../infraestructure/helpers/import-status.helper'
import { importReducer } from '../application/import.reducer'
import { INITIAL_IMPORT_STATE } from '../application/import-state.model'
import type { ImportTab } from '../application/import-state.model'
import type { ImportBatch } from '../domain/import-batch.entity'
import type { ImportAuditEntryAction } from '../domain/import-audit-entry.entity'

const POLL_INTERVAL_MS = 3000

interface UseImportOptions {
  open: boolean
  onImported?: () => void
}

export function useImport({ open, onImported }: UseImportOptions) {
  const [state, dispatch] = useReducer(importReducer, INITIAL_IMPORT_STATE)
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPoll = useCallback(() => {
    if (pollTimeoutRef.current !== null) {
      clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearPoll, [clearPoll])

  useEffect(() => {
    if (open) dispatch({ type: 'RESET' })
    else clearPoll()
  }, [open, clearPoll])

  const schedulePollRef = useRef<(batchId: string) => void>(() => {})

  const pollOnce = useCallback(
    (batchId: string) => {
      importRepository
        .getBatch(batchId)
        .then((batch) => {
          dispatch({ type: 'BATCH_REFRESHED', batch })
          if (ImportStatusHelper.isFinished(batch.status)) {
            onImported?.()
          } else {
            schedulePollRef.current(batchId)
          }
        })
        .catch(() => schedulePollRef.current(batchId))
    },
    [onImported],
  )

  const schedulePoll = useCallback(
    (batchId: string) => {
      clearPoll()
      pollTimeoutRef.current = setTimeout(() => pollOnce(batchId), POLL_INTERVAL_MS)
    },
    [clearPoll, pollOnce],
  )

  useEffect(() => {
    schedulePollRef.current = schedulePoll
  }, [schedulePoll])

  const setTab = useCallback((tab: ImportTab) => dispatch({ type: 'SET_TAB', tab }), [])

  const selectFile = useCallback((file: File | null) => dispatch({ type: 'SET_FILE', file }), [])

  const downloadTemplate = useCallback(async () => {
    dispatch({ type: 'TEMPLATE_START' })
    try {
      const file = await importRepository.downloadTemplate()
      FileDownloadHelper.save(file)
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
      if (!ImportStatusHelper.isFinished(batch.status)) schedulePoll(batch.id)
    } catch (error) {
      dispatch({ type: 'UPLOAD_ERROR', message: ImportErrorHelper.messageFrom(error) })
    }
  }, [state.selectedFile, schedulePoll])

  const resolveEntry = useCallback(
    async (entryId: string, action: ImportAuditEntryAction) => {
      if (state.batch === null) return
      dispatch({ type: 'RESOLVE_START', entryId })
      try {
        await importRepository.resolveEntry(entryId, action)
        const batch = await importRepository.getBatch(state.batch.id)
        dispatch({ type: 'BATCH_REFRESHED', batch })
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
    loadHistory,
  }
}
