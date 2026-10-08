import { ItemConditionHelper } from '../../shared/domain/item-condition.helper'
import type { CustodyDetail, CustodyItem } from '../domain/custody.entity'
import type { CustodyReturnType } from '../domain/custody-return-type.model'
import type { CreateReturnInput } from '../domain/return-input.model'
import type { ReturnItemDraft } from './return-state.model'

export class ReturnFormHelper {
  static pendingItems(custody: CustodyDetail | null): CustodyItem[] {
    if (custody === null) return []
    return custody.items.filter((item) => !item.isReturned)
  }

  /** La condición por defecto de cada unidad es la que se registró al entregarla. */
  static initialDrafts(pendingItems: CustodyItem[]): Record<string, ReturnItemDraft> {
    return pendingItems.reduce<Record<string, ReturnItemDraft>>((drafts, item) => {
      drafts[item.stock.id] = { condition: item.condition, notes: '' }
      return drafts
    }, {})
  }

  static keepPending(stockIds: readonly string[], pendingItems: CustodyItem[]): string[] {
    const pendingStockIds = new Set(pendingItems.map((item) => item.stock.id))
    return stockIds.filter((stockId) => pendingStockIds.has(stockId))
  }

  /**
   * El servidor calcula el `type` definitivo (2.2); esta vista previa aplica la misma regla
   * en el cliente: TOTAL cuando la selección cubre todas las unidades pendientes.
   */
  static previewType(selectedCount: number, pendingCount: number): CustodyReturnType {
    return pendingCount > 0 && selectedCount >= pendingCount ? 'TOTAL' : 'PARCIAL'
  }

  /** Una condición mala deja daño en el expediente (D3): siempre se pide explicarla. */
  static requiresNote(draft: ReturnItemDraft | undefined): boolean {
    if (draft === undefined) return false
    return ItemConditionHelper.isBad(draft.condition) && draft.notes.trim() === ''
  }

  static missingNoteStockIds(
    selectedStockIds: readonly string[],
    drafts: Record<string, ReturnItemDraft>,
  ): string[] {
    return selectedStockIds.filter((stockId) => ReturnFormHelper.requiresNote(drafts[stockId]))
  }

  static toInput(
    selectedStockIds: readonly string[],
    drafts: Record<string, ReturnItemDraft>,
    notes: string,
  ): CreateReturnInput {
    return {
      notes: notes.trim() === '' ? null : notes.trim(),
      items: selectedStockIds.map((stockId) => {
        const draft = drafts[stockId]
        return {
          stockId,
          condition: draft.condition,
          notes: draft.notes.trim() === '' ? null : draft.notes.trim(),
        }
      }),
    }
  }
}
