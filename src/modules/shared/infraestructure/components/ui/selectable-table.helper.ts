export class SelectableTableSelectionHelper {
  static toggle(selectedIds: string[], rowId: string): string[] {
    if (selectedIds.includes(rowId)) {
      return selectedIds.filter((selectedId) => selectedId !== rowId)
    }
    return [...selectedIds, rowId]
  }

  static toggleAll(selectedIds: string[], selectableIds: string[]): string[] {
    if (SelectableTableSelectionHelper.areAllSelected(selectedIds, selectableIds)) {
      return selectedIds.filter((selectedId) => !selectableIds.includes(selectedId))
    }

    const missingIds = selectableIds.filter((selectableId) => !selectedIds.includes(selectableId))
    return [...selectedIds, ...missingIds]
  }

  static areAllSelected(selectedIds: string[], selectableIds: string[]): boolean {
    if (selectableIds.length === 0) return false
    return selectableIds.every((selectableId) => selectedIds.includes(selectableId))
  }

  static countSelected(selectedIds: string[], selectableIds: string[]): number {
    return selectableIds.filter((selectableId) => selectedIds.includes(selectableId)).length
  }
}
