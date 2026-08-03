import { useEffect, useReducer, useRef } from 'react'
import axios from 'axios'
import { Outlet } from 'react-router'
import { authReducer } from '../../application/auth.reducer'
import { AuthInitialStateHelper } from '../../application/auth-initial-state.helper'
import { AuthUseCase } from '../../application/auth.usecase'
import { authRepository } from '../repositories/auth.repository'
import { AuthSessionStorage } from '../storage/auth-session.storage'
import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import { AuthContext } from './auth.context'
import type { AuthContextValue } from './auth-context.interfaces'

const authUseCase = new AuthUseCase(authRepository)

export function AuthProvider() {
  const [state, dispatch] = useReducer(authReducer, undefined, AuthInitialStateHelper.build)
  const authenticatedRef = useRef(state.token !== null)

  useEffect(() => {
    authenticatedRef.current = state.token !== null
  }, [state.token])

  useEffect(() => {
    const datasource = HttpDataSource.getInstance()
    datasource.setUnauthorizedHandler(() => {
      if (!authenticatedRef.current) return
      authenticatedRef.current = false
      AuthSessionStorage.clear()
      dispatch({ type: 'AUTH_SESSION_EXPIRED' })
    })
    return () => datasource.setUnauthorizedHandler(null)
  }, [])

  async function login(identifier: string, password: string): Promise<void> {
    dispatch({ type: 'AUTH_START' })
    try {
      const session = await authUseCase.login(identifier, password)
      dispatch({ type: 'AUTH_SUCCESS', payload: session })
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? 'Credenciales inválidas')
        : 'Error de autenticación'
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
    sessionExpired: state.sessionExpired,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      <Outlet />
    </AuthContext.Provider>
  )
}
