import type { ImportBatch } from '../domain/import-batch.entity'
import type { ImportState, ImportTab } from './import-state.model'
import { INITIAL_IMPORT_STATE } from './import-state.model'

export type ImportAction =
  | { type: 'RESET' }
  | { type: 'SET_TAB'; tab: ImportTab }
  | { type: 'SET_FILE'; file: File | null }
  | { type: 'TEMPLATE_START' }
  | { type: 'TEMPLATE_DONE' }
  | { type: 'UPLOAD_START' }
  | { type: 'UPLOAD_SUCCESS'; batch: ImportBatch }
  | { type: 'UPLOAD_ERROR'; message: string }
  | { type: 'BATCH_REFRESHED'; batch: ImportBatch }
  | { type: 'RESOLVE_START'; entryId: string }
  | { type: 'RESOLVE_DONE' }
  | { type: 'HISTORY_START' }
  | { type: 'HISTORY_SUCCESS'; history: ImportBatch[] }
  | { type: 'HISTORY_ERROR' }

export function importReducer(state: ImportState, action: ImportAction): ImportState {
  switch (action.type) {
    case 'RESET':
      return INITIAL_IMPORT_STATE
    case 'SET_TAB':
      return { ...state, tab: action.tab }
    case 'SET_FILE':
      return { ...state, selectedFile: action.file, uploadError: null }
    case 'TEMPLATE_START':
      return { ...state, isDownloadingTemplate: true }
    case 'TEMPLATE_DONE':
      return { ...state, isDownloadingTemplate: false }
    case 'UPLOAD_START':
      return { ...state, isUploading: true, uploadError: null }
    case 'UPLOAD_SUCCESS':
      return { ...state, isUploading: false, selectedFile: null, batch: action.batch }
    case 'UPLOAD_ERROR':
      return { ...state, isUploading: false, uploadError: action.message }
    case 'BATCH_REFRESHED':
      return { ...state, batch: action.batch }
    case 'RESOLVE_START':
      return { ...state, resolvingEntryId: action.entryId }
    case 'RESOLVE_DONE':
      return { ...state, resolvingEntryId: null }
    case 'HISTORY_START':
      return { ...state, historyStatus: 'loading' }
    case 'HISTORY_SUCCESS':
      return { ...state, historyStatus: 'success', history: action.history }
    case 'HISTORY_ERROR':
      return { ...state, historyStatus: 'error' }
    default:
      return state
  }
}
