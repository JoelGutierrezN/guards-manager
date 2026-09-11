import type { UserFormAction, UserFormState } from './user-form.model'

export function userFormReducer(state: UserFormState, action: UserFormAction): UserFormState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name }
    case 'SET_EMAIL':
      return { ...state, email: action.email }
    case 'SET_USERNAME':
      return { ...state, username: action.username }
    case 'SET_PHONE':
      return { ...state, phone: action.phone }
    case 'SET_PASSWORD':
      return { ...state, password: action.password }
    case 'TOUCH':
      return { ...state, touched: true }
    default:
      return state
  }
}
