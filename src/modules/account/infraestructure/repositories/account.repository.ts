import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { AccountRepository as AccountRepositoryContract } from '../../domain/account-repository'
import type { AccountProfile } from '../../domain/account-profile.model'
import type { UpdateAccountProfileInput } from '../../domain/update-account-profile-input.model'
import type { ChangeAccountPasswordInput } from '../../domain/change-account-password-input.model'
import type { MeDto } from '../dto/me.dto'
import { AccountMapper } from '../mappers/account.mapper'

class AccountRepositoryImpl implements AccountRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async getMe(): Promise<AccountProfile> {
    const response = await this.datasource.get<MeDto>('/me')
    return AccountMapper.toProfile(response)
  }

  async updateMe(input: UpdateAccountProfileInput): Promise<AccountProfile> {
    const response = await this.datasource.patch<MeDto>(
      '/me',
      AccountMapper.toUpdateRequestBody(input),
    )
    return AccountMapper.toProfile(response)
  }

  async changePassword(input: ChangeAccountPasswordInput): Promise<void> {
    await this.datasource.post<void>(
      '/me/password',
      AccountMapper.toChangePasswordRequestBody(input),
    )
  }
}

export const accountRepository = new AccountRepositoryImpl()
