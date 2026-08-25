import { type JSX } from 'react'
import { Avatar, Chip } from '../../../shared/infraestructure/components/ui'
import type { Employee } from '../../domain/employee.entity'

interface Props {
  employee: Employee
}

export function EmployeeRow({ employee }: Props): JSX.Element {
  return (
    <tr className="group transition-colors [&_td]:hover:bg-paper-tint">
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2.5">
          <Avatar name={employee.name} size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium text-ink">{employee.name}</span>
            <span className="font-mono text-[11px] text-muted">{employee.identifier}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 align-middle">
        <Chip size="sm">{employee.roleName}</Chip>
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
        {employee.activeToolsCount}
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {employee.historicalToolsCount}
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {employee.hireDate}
      </td>
      {/* TODO API: acciones por empleado (editar / eliminar) con PUT y DELETE /employees/{id}. */}
      <td className="px-3 py-2.5 align-middle" />
    </tr>
  )
}
