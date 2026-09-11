import { type JSX, type KeyboardEvent, type MouseEvent, useState } from 'react'
import {
  Delete02Icon,
  PencilEdit02Icon,
  UserBlock01Icon,
  UserCheck01Icon,
} from '@hugeicons/core-free-icons'
import {
  Avatar,
  Chip,
  ConfirmDialog,
  IconButton,
} from '../../../shared/infraestructure/components/ui'
import type { Employee } from '../../domain/employee.entity'
import { EmployeeStatusHelper } from '../../application/employee-status.helper'
import { useEmployeeLifecycle } from '../../hooks/use-employee-lifecycle.hook'
import { EmployeeContactCell } from './employee-contact-cell.component'

interface Props {
  employee: Employee
  onEdit: () => void
  onOpen: () => void
}

export function EmployeeRow({ employee, onEdit, onOpen }: Props): JSX.Element {
  const [employeeView, setEmployeeView] = useState(employee)
  const [removed, setRemoved] = useState(false)
  const lifecycle = useEmployeeLifecycle({
    employeeId: employeeView.id,
    status: employeeView.status,
    onStatusChanged: (updated) => setEmployeeView(updated),
    onDeleted: () => setRemoved(true),
  })

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    onEdit()
  }

  const handleStatusClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    lifecycle.openStatusConfirm()
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    lifecycle.openDeleteConfirm()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>): void => {
    // El teclado sobre el botón de editar no debe abrir el expediente: sólo la propia fila.
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen()
  }

  if (removed) return <></>

  const isActive = EmployeeStatusHelper.isActive(employeeView.status)
  const statusActionTitle = isActive ? 'Dar de baja' : 'Reactivar'

  return (
    <>
      <tr
        className="group cursor-pointer transition-colors outline-none [&_td]:hover:bg-paper-tint [&_td]:focus-visible:bg-paper-tint"
        tabIndex={0}
        aria-label={`Abrir expediente de ${employeeView.name}`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <td className="px-3 py-2.5 align-middle">
          <div className="flex items-center gap-2.5">
            <Avatar name={employeeView.name} size="sm" />
            <div className="flex min-w-0 flex-col">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-[13px] font-medium text-ink">
                  {employeeView.name}
                </span>
                {employeeView.status === 'inactivo' && <Chip size="sm">Inactivo</Chip>}
              </span>
              <span className="font-mono text-[11px] text-muted">{employeeView.identifier}</span>
            </div>
          </div>
        </td>
        <td className="px-3 py-2.5 align-middle">
          <Chip size="sm">{employeeView.roleName}</Chip>
        </td>
        <td className="px-3 py-2.5 align-middle">
          <EmployeeContactCell email={employeeView.email} phone={employeeView.phone} />
        </td>
        <td className="px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
          {employeeView.activeToolsCount}
        </td>
        <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
          {employeeView.historicalToolsCount}
        </td>
        <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
          {employeeView.hireDate}
        </td>
        <td className="px-3 py-2.5 text-right align-middle">
          <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <IconButton icon={PencilEdit02Icon} tip="Editar" size="sm" onClick={handleEditClick} />
            <IconButton
              icon={isActive ? UserBlock01Icon : UserCheck01Icon}
              tip={statusActionTitle}
              size="sm"
              onClick={handleStatusClick}
            />
            <IconButton
              icon={Delete02Icon}
              tip="Eliminar"
              size="sm"
              danger
              onClick={handleDeleteClick}
            />
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={lifecycle.confirmKind != null}
        title={
          lifecycle.confirmKind === 'delete'
            ? `¿Eliminar a ${employeeView.name}?`
            : `¿${statusActionTitle} a ${employeeView.name}?`
        }
        eyebrow={lifecycle.confirmKind === 'delete' ? 'Eliminar empleado' : 'Cambiar estado'}
        body={
          lifecycle.errorMessage ??
          (lifecycle.confirmKind === 'delete'
            ? 'Esta acción no se puede deshacer.'
            : isActive
              ? 'El empleado dejará de poder recibir nuevas asignaciones.'
              : 'El empleado volverá a estar disponible para nuevas asignaciones.')
        }
        confirmLabel={lifecycle.confirmKind === 'delete' ? 'Eliminar' : statusActionTitle}
        destructive={lifecycle.confirmKind === 'delete'}
        loading={lifecycle.loading}
        onConfirm={() => void lifecycle.confirm()}
        onClose={lifecycle.closeConfirm}
      />
    </>
  )
}
