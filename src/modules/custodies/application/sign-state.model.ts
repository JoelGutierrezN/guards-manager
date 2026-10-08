import type { SignDocument } from '../domain/sign-document.model'
import type { SignErrorReport } from '../domain/sign-error.model'
import type { SignatureResult } from '../domain/signature.entity'

export type SignStatus = 'loading' | 'editing' | 'submitting' | 'done' | 'error'

export interface SignState {
  signDocument: SignDocument | null
  status: SignStatus
  loadError: string | null
  signerName: string
  signatureImage: string | null
  error: SignErrorReport | null
  result: SignatureResult | null
}

export const INITIAL_SIGN_STATE: SignState = {
  signDocument: null,
  status: 'loading',
  loadError: null,
  signerName: '',
  signatureImage: null,
  error: null,
  result: null,
}

export type SignAction =
  | { type: 'LOAD_START' }
  | { type: 'RELOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: SignDocument }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SIGNER_NAME_CHANGED'; payload: string }
  | { type: 'SIGNATURE_CHANGED'; payload: string | null }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: SignatureResult }
  | { type: 'SUBMIT_ERROR'; payload: SignErrorReport }
