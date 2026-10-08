import { useContext } from 'react'
import { AccountProfileContext } from '../infraestructure/providers/account-profile.context'
import type { AccountProfileContextValue } from '../infraestructure/providers/account-profile-context.interfaces'

export function useAccountProfile(): AccountProfileContextValue {
  const context = useContext(AccountProfileContext)
  if (!context) throw new Error('useAccountProfile debe usarse dentro de AccountProfileProvider')
  return context
}
