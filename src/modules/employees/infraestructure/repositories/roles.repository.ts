import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { RolesRepository as RolesRepositoryContract } from '../../domain/roles-repository'
import type { RoleOption } from '../../domain/role-option.model'
import type { RoleSelectDto } from '../dto/role-select.dto'
import { RoleMapper } from '../mappers/role.mapper'

class RolesRepositoryImpl implements RolesRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async select(): Promise<RoleOption[]> {
    const response = await this.datasource.get<RoleSelectDto[]>('/roles/select')
    return response.map((role) => RoleMapper.toRoleOption(role))
  }
}

export const rolesRepository = new RolesRepositoryImpl()
