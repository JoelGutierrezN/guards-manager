export interface AccountPasswordFormErrors {
  currentPassword?: string
  password?: string
  passwordConfirmation?: string
}

export interface AccountPasswordFormState {
  currentPassword: string
  password: string
  passwordConfirmation: string
  touched: boolean
  isSaving: boolean
  apiErrors: AccountPasswordFormErrors
  apiMessage: string | null
}

export type AccountPasswordFormAction =
  | { type: 'SET_CURRENT_PASSWORD'; currentPassword: string }
  | { type: 'SET_PASSWORD'; password: string }
  | { type: 'SET_PASSWORD_CONFIRMATION'; passwordConfirmation: string }
  | { type: 'TOUCH' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; errors: AccountPasswordFormErrors; message: string }
  | { type: 'SAVE_DONE' }
