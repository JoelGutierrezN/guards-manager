import { useEffect, useReducer, useRef } from 'react'
import axios from 'axios'
import { Outlet, useLocation, useNavigate } from 'react-router'
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
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)

  useEffect(() => {
    locationRef.current = location
  }, [location])

  useEffect(() => {
    const datasource = HttpDataSource.getInstance()
    datasource.setUnauthorizedHandler(() => {
      AuthSessionStorage.clear()
      dispatch({ type: 'AUTH_LOGOUT' })
      const { pathname, search } = locationRef.current
      navigate('/session-expired', { state: { from: { pathname, search } } })
    })
    return () => datasource.setUnauthorizedHandler(null)
  }, [navigate])

  async function login(identifier: string, password: string): Promise<void> {
    dispatch({ type: 'AUTH_START' })
    try {
      const session = await authUseCase.login(identifier, password)
      dispatch({ type: 'AUTH_SUCCESS', payload: session })
      HttpDataSource.getInstance().resetUnauthorized()
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Credenciales inválidas'
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
  }

  return <AuthContext.Provider value={contextValue}><Outlet /></AuthContext.Provider>
}
