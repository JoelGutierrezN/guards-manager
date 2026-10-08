import type { UserFormAction, UserFormState } from './user-form.model'

export function userFormReducer(state: UserFormState, action: UserFormAction): UserFormState {
  switch (action.type) {
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
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.password,
        apiErrors: { ...state.apiErrors, password: undefined },
      }
    case 'SET_API_ERRORS':
      return { ...state, apiErrors: action.errors }
    case 'TOUCH':
      return { ...state, touched: true }
    default:
      return state
  }
}
