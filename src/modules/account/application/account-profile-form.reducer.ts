import type {
  AccountProfileFormAction,
  AccountProfileFormState,
} from './account-profile-form.model'

export function accountProfileFormReducer(
  state: AccountProfileFormState,
  action: AccountProfileFormAction,
): AccountProfileFormState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        name: action.profile.name,
        email: action.profile.email,
        username: action.profile.username,
        phone: action.profile.phone ?? '',
      }
    case 'SET_NAME':
      return { ...state, name: action.name, apiErrors: { ...state.apiErrors, name: undefined } }
    case 'SET_EMAIL':
      return { ...state, email: action.email, apiErrors: { ...state.apiErrors, email: undefined } }
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.username,
        apiErrors: { ...state.apiErrors, username: undefined },
      }
    case 'SET_PHONE':
      return { ...state, phone: action.phone, apiErrors: { ...state.apiErrors, phone: undefined } }
    case 'TOUCH':
      return { ...state, touched: true }
    case 'SAVE_START':
      return { ...state, isSaving: true, apiErrors: {}, apiMessage: null }
    case 'SAVE_ERROR':
      return { ...state, isSaving: false, apiErrors: action.errors, apiMessage: action.message }
    case 'SAVE_DONE':
      return { ...state, isSaving: false, apiErrors: {}, apiMessage: null }
    default:
      return state
  }
}
