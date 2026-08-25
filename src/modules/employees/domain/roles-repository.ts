import type { RoleOption } from './role-option.model'

export interface RolesRepository {
  select(): Promise<RoleOption[]>
}
