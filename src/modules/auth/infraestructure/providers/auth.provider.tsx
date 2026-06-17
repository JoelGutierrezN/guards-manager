import { useReducer } from 'react'
import { Outlet } from 'react-router'
import { authReducer } from '../../application/auth.reducer'
import { AuthInitialStateHelper } from '../../application/auth-initial-state.helper'
import { AuthUseCase } from '../../application/auth.usecase'
import { authRepository } from '../repositories/auth.repository'
import { AuthContext } from './auth.context'
import type { AuthContextValue } from './auth-context.interfaces'

const authUseCase = new AuthUseCase(authRepository)

export function AuthProvider() {
  const [state, dispatch] = useReducer(authReducer, undefined, AuthInitialStateHelper.build)

  async function login(identifier: string, password: string): Promise<void> {
    dispatch({ type: 'AUTH_START' })
    try {
      const session = await authUseCase.login(identifier, password)
      dispatch({ type: 'AUTH_SUCCESS', payload: session })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de autenticación'
      dispatch({ type: 'AUTH_ERROR', payload: message })
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
  }

  return <AuthContext.Provider value={contextValue}><Outlet /></AuthContext.Provider>
}
