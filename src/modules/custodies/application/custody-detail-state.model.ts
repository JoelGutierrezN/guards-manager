import type { ApiConflictDetail } from '../../shared/infraestructure/errors/api-conflict.model'
import type { CustodyDetail } from '../domain/custody.entity'
import type { CustodyDetailLoaderData } from '../domain/custody-detail-loader.model'

export type CustodyDetailStatus = 'loading' | 'ready' | 'error'

export interface CustodyDetailState {
  custody: CustodyDetail | null
  status: CustodyDetailStatus
  error: string | null
  cancelDialogOpen: boolean
  cancelling: boolean
  cancelError: ApiConflictDetail | null
}

export function custodyDetailStateFrom(data: CustodyDetailLoaderData): CustodyDetailState {
  return {
    custody: data.custody,
    status: data.custody == null ? 'error' : 'ready',
    error: data.error,
    cancelDialogOpen: false,
    cancelling: false,
    cancelError: null,
  }
}

export type CustodyDetailAction =
  | { type: 'HYDRATED'; data: CustodyDetailLoaderData }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; custody: CustodyDetail }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'CANCEL_DIALOG_OPENED' }
  | { type: 'CANCEL_DIALOG_CLOSED' }
  | { type: 'CANCEL_START' }
  | { type: 'CANCEL_ERROR'; detail: ApiConflictDetail }
  | { type: 'CANCEL_DONE' }
