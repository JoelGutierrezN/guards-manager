import type { WindowManager } from '../../shared/domain/window-manager.model'
import type { Employee } from '../domain/employee.entity'

export type EmployeesWindow = 'create' | 'edit'

export type EmployeesWindowManager = WindowManager<EmployeesWindow, Employee>
