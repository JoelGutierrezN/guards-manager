import type { ImportBatch } from '../domain/import-batch.entity'

export type ImportTab = 'upload' | 'history'
export type ImportHistoryStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ImportState {
  tab: ImportTab
  selectedFile: File | null
  isDownloadingTemplate: boolean
  isUploading: boolean
  uploadError: string | null
  batch: ImportBatch | null
  resolvingEntryId: string | null
  history: ImportBatch[]
  historyStatus: ImportHistoryStatus
}

export const INITIAL_IMPORT_STATE: ImportState = {
  tab: 'upload',
  selectedFile: null,
  isDownloadingTemplate: false,
  isUploading: false,
  uploadError: null,
  batch: null,
  resolvingEntryId: null,
  history: [],
  historyStatus: 'idle',
}
