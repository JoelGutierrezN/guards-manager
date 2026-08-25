import { type JSX } from 'react'
import { Checkbox } from '../../../shared/infraestructure/components/ui'
import type { RoleOption } from '../../domain/role-option.model'

interface Props {
  role: RoleOption
  checked: boolean
  onToggle: (roleId: string, checked: boolean) => void
}

export function EmployeeRoleFilterOption({ role, checked, onToggle }: Props): JSX.Element {
  return (
    <li className="px-2.5 py-1.5">
      <Checkbox
        label={role.name}
        checked={checked}
        onChange={(event) => onToggle(role.id, event.target.checked)}
      />
    </li>
  )
}
