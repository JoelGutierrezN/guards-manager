import type { EmployeeFileItem } from '../domain/employee-file-item.model'

export class EmployeeFileSelectionHelper {
  static toggle(selectedIds: ReadonlySet<string>, itemId: string): Set<string> {
    const nextSelection = new Set(selectedIds)
    if (!nextSelection.delete(itemId)) {
      nextSelection.add(itemId)
    }
    return nextSelection
  }

  static selectAll(itemIds: readonly string[]): Set<string> {
    return new Set(itemIds)
  }

  static clear(): Set<string> {
    return new Set<string>()
  }

  static isAllSelected(selectedIds: ReadonlySet<string>, total: number): boolean {
    return total > 0 && selectedIds.size >= total
  }

  static isSomeSelected(selectedIds: ReadonlySet<string>, total: number): boolean {
    return selectedIds.size > 0 && selectedIds.size < total
  }

  static selectedItems(
    items: readonly EmployeeFileItem[],
    selectedIds: ReadonlySet<string>,
  ): EmployeeFileItem[] {
    return items.filter((item) => selectedIds.has(item.id))
  }

  /**
   * Una devolución vive dentro de un solo resguardo (`POST /custodies/{id}/returns`): si la
   * selección mezcla folios no hay un destino válido y se devuelve `null`.
   */
  static custodyIdOf(
    items: readonly EmployeeFileItem[],
    selectedIds: ReadonlySet<string>,
  ): string | null {
    const selected = EmployeeFileSelectionHelper.selectedItems(items, selectedIds)
    if (selected.length === 0) return null
    const [firstItem] = selected
    const sharesCustody = selected.every((item) => item.custodyId === firstItem.custodyId)
    return sharesCustody ? firstItem.custodyId : null
  }

  static stockIdsOf(
    items: readonly EmployeeFileItem[],
    selectedIds: ReadonlySet<string>,
  ): string[] {
    return EmployeeFileSelectionHelper.selectedItems(items, selectedIds).map((item) => item.stockId)
  }

  static firstCustodyId(items: readonly EmployeeFileItem[]): string | null {
    const [firstItem] = items
    return firstItem === undefined ? null : firstItem.custodyId
  }

  static stockIdsOfCustody(items: readonly EmployeeFileItem[], custodyId: string): string[] {
    return items.filter((item) => item.custodyId === custodyId).map((item) => item.stockId)
  }
}
