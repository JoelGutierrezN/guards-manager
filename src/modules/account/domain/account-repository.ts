import type { AccountProfile } from './account-profile.model'
import type { UpdateAccountProfileInput } from './update-account-profile-input.model'
import type { ChangeAccountPasswordInput } from './change-account-password-input.model'

export interface AccountRepository {
  getMe(): Promise<AccountProfile>
  updateMe(input: UpdateAccountProfileInput): Promise<AccountProfile>
  changePassword(input: ChangeAccountPasswordInput): Promise<void>
}
