import type { SignAction, SignState } from './sign-state.model'

export function signReducer(state: SignState, action: SignAction): SignState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', loadError: null, error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        signDocument: action.payload,
        status: 'editing',
        loadError: null,
        signerName: state.signerName === '' ? action.payload.employeeName : state.signerName,
      }
    case 'LOAD_ERROR':
      return { ...state, signDocument: null, status: 'error', loadError: action.payload }
    case 'SIGNER_NAME_CHANGED':
      return {
        ...state,
        signerName: action.payload,
        error: state.error === null ? null : { ...state.error, fieldErrors: {} },
      }
    case 'SIGNATURE_CHANGED':
      return {
        ...state,
        signatureImage: action.payload,
        error: state.error === null ? null : { ...state.error, fieldErrors: {} },
      }
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', error: null }
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'done', result: action.payload, error: null }
    case 'SUBMIT_ERROR':
      return { ...state, status: 'editing', error: action.payload }
    default:
      return state
  }
}
