import { createContext } from 'react'
import type { AccountProfileContextValue } from './account-profile-context.interfaces'

export const AccountProfileContext = createContext<AccountProfileContextValue | null>(null)
