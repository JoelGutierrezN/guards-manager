export interface UserFormState {
  name: string
  email: string
  username: string
  phone: string
  password: string
  touched: boolean
}

export interface UserFormErrors {
  name?: string
  email?: string
  username?: string
  phone?: string
  password?: string
}

export type UserFormAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_USERNAME'; username: string }
  | { type: 'SET_PHONE'; phone: string }
  | { type: 'SET_PASSWORD'; password: string }
  | { type: 'TOUCH' }
