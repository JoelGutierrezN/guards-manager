import type { Employee } from '../domain/employee.entity.ts'

export interface EmployeesState {
  rows: Employee[]
  loading: boolean
}

export type EmployeesAction = { type: 'LOAD_START' }

export const initialState: EmployeesState = {
  rows: [],
  loading: false,
}
