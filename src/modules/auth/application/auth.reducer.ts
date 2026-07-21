import type { AuthState, AuthAction } from './auth-state.interfaces'

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, status: 'authenticating', error: null, sessionExpired: false }

    case 'AUTH_SUCCESS': {
      const { user, token } = action.payload
      return { user, token, status: 'authenticated', error: null, sessionExpired: false }
    }

    case 'AUTH_ERROR': {
      const { payload: error } = action
      return { ...state, status: 'error', error }
    }

    case 'AUTH_LOGOUT':
      return { user: null, token: null, status: 'idle', error: null, sessionExpired: false }

    case 'AUTH_SESSION_EXPIRED':
      return { user: null, token: null, status: 'idle', error: null, sessionExpired: true }
  }
}
