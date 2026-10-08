import type { RoleOption } from './role-option.model'

export interface RolesRepository {
  select(): Promise<RoleOption[]>
  create(name: string): Promise<RoleOption>
}
