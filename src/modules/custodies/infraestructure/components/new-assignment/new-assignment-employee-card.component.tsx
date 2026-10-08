import { type JSX } from 'react'
import { Avatar, Chip } from '../../../../shared/infraestructure/components/ui'
import type { EmployeeOption } from '../../../domain/employee-option.model'
import { EmployeeOptionHelper } from '../../helpers/employee-option.helper'

interface Props {
  employee: EmployeeOption
}

export function NewAssignmentEmployeeCard({ employee }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-hairline bg-paper-tint px-4 py-3">
      <Avatar name={employee.name} />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13px] font-semibold text-ink">{employee.name}</p>
        <p className="m-0 text-[12px] text-muted">{EmployeeOptionHelper.descriptionOf(employee)}</p>
      </div>
      <Chip tone="navy" size="sm">
        {employee.identifier}
      </Chip>
    </div>
  )
}
