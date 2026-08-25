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
}
