import type { TabItem } from '../../shared/infraestructure/components/ui/tabs.model'
import type { EmployeeFile } from '../domain/employee-file.entity'
import {
  EMPLOYEE_FILE_PENDING_BADGE,
  EMPLOYEE_FILE_TABS,
  type EmployeeFileTab,
  type EmployeeFileTabDescriptor,
} from '../domain/employee-file-tab.model'

export class EmployeeFileTabsHelper {
  static toTabItems(file: EmployeeFile | null): TabItem<EmployeeFileTab>[] {
    return EMPLOYEE_FILE_TABS.map((descriptor) =>
      EmployeeFileTabsHelper.toTabItem(descriptor, file),
    )
  }

  private static toTabItem(
    descriptor: EmployeeFileTabDescriptor,
    file: EmployeeFile | null,
  ): TabItem<EmployeeFileTab> {
    const base = { value: descriptor.value, label: descriptor.label, icon: descriptor.icon }
    if (descriptor.pending) {
      return { ...base, badge: EMPLOYEE_FILE_PENDING_BADGE }
    }
    return { ...base, count: EmployeeFileTabsHelper.countFor(descriptor.value, file) }
  }

  private static countFor(tab: EmployeeFileTab, file: EmployeeFile | null): number {
    if (file === null) return 0
    return tab === 'history' ? file.history.length : file.activeItems.length
  }
}
