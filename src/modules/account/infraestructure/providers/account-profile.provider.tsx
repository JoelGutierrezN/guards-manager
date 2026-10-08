import { type JSX, type ReactNode } from 'react'
import { useAccountMe } from '../../hooks/use-account-me.hook'
import { AccountProfileContext } from './account-profile.context'

interface Props {
  children: ReactNode
}

/**
 * Fuente única del perfil de la cuenta: se monta una vez en el layout privado para que la tarjeta
 * del sidebar y `/profile` compartan un solo `GET /me` y se refresquen juntas al guardar.
 */
export function AccountProfileProvider({ children }: Props): JSX.Element {
  const value = useAccountMe()

  return <AccountProfileContext.Provider value={value}>{children}</AccountProfileContext.Provider>
}
