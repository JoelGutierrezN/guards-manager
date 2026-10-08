import type { AccountProfile } from '../../domain/account-profile.model'
import type { AccountMeStatus } from '../../application/account-me.model'

export interface AccountProfileContextValue {
  profile: AccountProfile | null
  status: AccountMeStatus
  reload: () => void
  setProfile: (profile: AccountProfile) => void
}
