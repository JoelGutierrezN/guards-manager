import type { ImportBatch } from '../domain/import-batch.entity'

export type ImportTab = 'upload' | 'history'
export type ImportHistoryStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ImportState {
  tab: ImportTab
  selectedFile: File | null
  isDownloadingTemplate: boolean
  templateError: string | null
  isUploading: boolean
  uploadError: string | null
  batch: ImportBatch | null
  /** Falla del sondeo del lote (403/404/500 o red): corta el ciclo y habilita el reintento. */
  pollError: string | null
  resolvingEntryId: string | null
  resolveError: string | null
  history: ImportBatch[]
  historyStatus: ImportHistoryStatus
}

export const INITIAL_IMPORT_STATE: ImportState = {
  tab: 'upload',
  selectedFile: null,
  isDownloadingTemplate: false,
  templateError: null,
  isUploading: false,
  uploadError: null,
  batch: null,
  pollError: null,
  resolvingEntryId: null,
  resolveError: null,
  history: [],
  historyStatus: 'idle',
}
