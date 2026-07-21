import { useReducer } from 'react'
import { Outlet } from 'react-router'
import { authReducer } from '../../application/auth.reducer'
import { AuthInitialStateHelper } from '../../application/auth-initial-state.helper'
import { AuthUseCase } from '../../application/auth.usecase'
import { authRepository } from '../repositories/auth.repository'
import { useHandleApiError, resetSessionExpiredGuard } from '../../../shared/infraestructure/errors/use-handle-api-error.hook'
import { AuthContext } from './auth.context'
import type { AuthContextValue } from './auth-context.interfaces'

const authUseCase = new AuthUseCase(authRepository)

export function AuthProvider() {
  const [state, dispatch] = useReducer(authReducer, undefined, AuthInitialStateHelper.build)
  const handleApiError = useHandleApiError(dispatch)

  async function login(identifier: string, password: string): Promise<void> {
    dispatch({ type: 'AUTH_START' })
    try {
      const session = await authUseCase.login(identifier, password)
      dispatch({ type: 'AUTH_SUCCESS', payload: session })
      resetSessionExpiredGuard()
    } catch (error) {
      try {
        handleApiError(error)
      } catch (normalizedError) {
        const message = normalizedError instanceof Error ? normalizedError.message : 'Error de autenticación'
        dispatch({ type: 'AUTH_ERROR', payload: message })
      }
    }
  }

  async function logout(): Promise<void> {
    await authUseCase.logout()
    dispatch({ type: 'AUTH_LOGOUT' })
  }

  const contextValue: AuthContextValue = {
    user: state.user,
    isAuthenticated: state.token !== null,
    status: state.status,
    error: state.error,
    login,
    logout,
    dispatch,
  }

  return <AuthContext.Provider value={contextValue}><Outlet /></AuthContext.Provider>
}
