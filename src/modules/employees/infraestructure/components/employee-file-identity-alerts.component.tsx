import { type JSX } from 'react'
import type { EmployeeFileAlert } from '../../domain/employee-file-alert.model'
import { EmployeeFileAlertRow } from './employee-file-alert-row.component'

interface Props {
  alerts: EmployeeFileAlert[]
}

export function EmployeeFileIdentityAlerts({ alerts }: Props): JSX.Element | null {
  if (alerts.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5 border-t border-hairline p-3.5 pt-2.5">
      {alerts.map((alert) => (
        <EmployeeFileAlertRow key={`${alert.type}-${alert.date}`} alert={alert} />
      ))}
    </div>
  )
}
