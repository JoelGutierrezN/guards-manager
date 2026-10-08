import type { StockUnitCustody } from '../../domain/tool-unit.model'
import { StockUnitDateHelper } from './stock-unit-date.helper'

const EMPTY_LABEL = '—'

export class StockUnitCustodyHelper {
  static holderLabel(custody: StockUnitCustody | null): string {
    if (custody === null) return EMPTY_LABEL
    const parts = [custody.employeeName, custody.employeeIdentifier].filter(
      (part): part is string => part !== null && part.trim() !== '',
    )
    return parts.length === 0 ? EMPTY_LABEL : parts.join(' · ')
  }

  static assignedAtLabel(custody: StockUnitCustody | null): string {
    if (custody?.assignedAt == null) return EMPTY_LABEL
    return StockUnitDateHelper.format(custody.assignedAt)
  }
}
