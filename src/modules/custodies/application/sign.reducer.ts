import type { SignErrorReport } from '../domain/sign-error.model'
import type { SignAction, SignState } from './sign-state.model'

/**
 * Al corregir un campo se retira el aviso completo: el texto «Revisa los datos marcados» no
 * puede sobrevivir a la corrección. El 409 es la excepción: no lo resuelve el usuario editando
 * el formulario, así que se conserva hasta el siguiente envío.
 */
function errorAfterEdit(error: SignErrorReport | null): SignErrorReport | null {
  return error !== null && error.alreadySigned ? error : null
}

export function signReducer(state: SignState, action: SignAction): SignState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', loadError: null, error: null }
    // Recarga disparada por un 409: el conflicto debe sobrevivir para avisar de que la firma
    // recién trazada no se registró.
    case 'RELOAD_START':
      return { ...state, status: 'loading', loadError: null }
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
      return { ...state, signerName: action.payload, error: errorAfterEdit(state.error) }
    case 'SIGNATURE_CHANGED':
      return { ...state, signatureImage: action.payload, error: errorAfterEdit(state.error) }
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
