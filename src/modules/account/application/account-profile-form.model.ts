import type { AccountProfile } from '../domain/account-profile.model'

export interface AccountProfileFormErrors {
  name?: string
  email?: string
  username?: string
  phone?: string
}

export interface AccountProfileFormState {
  name: string
  email: string
  username: string
  phone: string
  touched: boolean
  isSaving: boolean
  apiErrors: AccountProfileFormErrors
  apiMessage: string | null
}

export type AccountProfileFormAction =
  | { type: 'HYDRATE'; profile: AccountProfile }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_USERNAME'; username: string }
  | { type: 'SET_PHONE'; phone: string }
  | { type: 'TOUCH' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; errors: AccountProfileFormErrors; message: string }
  | { type: 'SAVE_DONE' }
