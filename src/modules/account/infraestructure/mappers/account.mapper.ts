import type { AccountProfile } from '../../domain/account-profile.model'
import type { UpdateAccountProfileInput } from '../../domain/update-account-profile-input.model'
import type { ChangeAccountPasswordInput } from '../../domain/change-account-password-input.model'
import type { MeDto } from '../dto/me.dto'
import type { UpdateMeRequestDto } from '../dto/update-me.request.dto'
import type { ChangePasswordRequestDto } from '../dto/change-password.request.dto'

export class AccountMapper {
  static toProfile(dto: MeDto): AccountProfile {
    return {
      id: dto.id,
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone ?? null,
      createdAt: dto.createdAt,
    }
  }

  static toUpdateRequestBody(input: UpdateAccountProfileInput): UpdateMeRequestDto {
    return {
      name: input.name,
      email: input.email,
      username: input.username,
      phone: input.phone,
    }
  }

  static toChangePasswordRequestBody(input: ChangeAccountPasswordInput): ChangePasswordRequestDto {
    return {
      current_password: input.currentPassword,
      password: input.password,
      password_confirmation: input.passwordConfirmation,
    }
  }
}
