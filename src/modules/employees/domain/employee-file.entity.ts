import type { EmployeeStatus } from './employee-status.model'
import type { EmployeeFileAlert } from './employee-file-alert.model'
import type { EmployeeFileDamage } from './employee-file-damage.model'
import type { EmployeeFileDocument } from './employee-file-document.model'
import type { EmployeeFileEvent } from './employee-file-event.model'
import type { EmployeeFileItem } from './employee-file-item.model'
import type { EmployeeFileSummary } from './employee-file-summary.model'

export interface EmployeeFileProfile {
  id: string
  identifier: string
  name: string
  roleId: string
  roleName: string
  email: string | null
  phone: string | null
  status: EmployeeStatus
  hireDate: string
  hiredAt: string | null
}

export interface EmployeeFile {
  employee: EmployeeFileProfile
  summary: EmployeeFileSummary
  activeItems: EmployeeFileItem[]
  history: EmployeeFileEvent[]
  documents: EmployeeFileDocument[]
  damages: EmployeeFileDamage[]
  alerts: EmployeeFileAlert[]
  alertsCount: number
}
