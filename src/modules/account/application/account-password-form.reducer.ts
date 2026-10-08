import type {
  AccountPasswordFormAction,
  AccountPasswordFormState,
} from './account-password-form.model'

export function accountPasswordFormReducer(
  state: AccountPasswordFormState,
  action: AccountPasswordFormAction,
): AccountPasswordFormState {
  switch (action.type) {
    case 'SET_CURRENT_PASSWORD':
      return {
        ...state,
        currentPassword: action.currentPassword,
        apiErrors: { ...state.apiErrors, currentPassword: undefined },
      }
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.password,
        apiErrors: { ...state.apiErrors, password: undefined },
      }
    case 'SET_PASSWORD_CONFIRMATION':
      return {
        ...state,
        passwordConfirmation: action.passwordConfirmation,
        apiErrors: { ...state.apiErrors, passwordConfirmation: undefined },
      }
    case 'TOUCH':
      return { ...state, touched: true }
    case 'SAVE_START':
      return { ...state, isSaving: true, apiErrors: {}, apiMessage: null }
    case 'SAVE_ERROR':
      return { ...state, isSaving: false, apiErrors: action.errors, apiMessage: action.message }
    case 'SAVE_DONE':
      return {
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
        touched: false,
        isSaving: false,
        apiErrors: {},
        apiMessage: null,
      }
    default:
      return state
  }
}
