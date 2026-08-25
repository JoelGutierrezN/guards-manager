import type { RoleOption } from '../../domain/role-option.model'
import type { RoleSelectDto } from '../dto/role-select.dto'

export class RoleMapper {
  static toRoleOption(dto: RoleSelectDto): RoleOption {
    return { id: String(dto.id), name: dto.name }
  }
}
