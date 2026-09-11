import { type JSX } from 'react'
import { Icon } from '../../../shared/infraestructure/components/ui'
import { CustodyDateHelper } from '../../../custodies/application/custody-date.helper'
import type { EmployeeFileAlert } from '../../domain/employee-file-alert.model'
import { EMPLOYEE_FILE_ALERT_ICONS } from './employee-file-alert-type.model'

interface Props {
  alert: EmployeeFileAlert
}

export function EmployeeFileAlertRow({ alert }: Props): JSX.Element {
  return (
    <div className="flex items-start gap-2 rounded-[12px] bg-warn-soft px-2.5 py-2 text-[11px] text-warn">
      <Icon icon={EMPLOYEE_FILE_ALERT_ICONS[alert.type]} size={13} className="mt-px shrink-0" />
      <div className="min-w-0">
        <div className="font-medium text-ink">{alert.message}</div>
        <div className="font-mono text-[10px] text-muted">{CustodyDateHelper.date(alert.date)}</div>
      </div>
    </div>
  )
}
