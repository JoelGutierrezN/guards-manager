import { useCallback } from 'react'
import type { ComboboxItem } from '../../shared/infraestructure/components/ui'
import { employeesSearchRepository } from '../infraestructure/repositories/employees-search.repository'
import { EmployeeOptionHelper } from '../infraestructure/helpers/employee-option.helper'

export function useEmployeeOptions() {
  const loadEmployeeOptions = useCallback(async (query: string): Promise<ComboboxItem[]> => {
    const employees = await employeesSearchRepository.search(query)
    return employees.map((employee) => EmployeeOptionHelper.toComboboxItem(employee))
  }, [])

  return { loadEmployeeOptions }
}
