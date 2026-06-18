import { useContext } from 'react'
import { AuthContext } from '../infraestructure/providers/auth.context'
import type { AuthContextValue } from '../infraestructure/providers/auth-context.interfaces'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
