import { ItemConditionHelper } from '../../shared/domain/item-condition.helper'
import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { CreateCustodyItemInput } from '../domain/custody-input.model'
import type { AvailableStock } from '../domain/new-assignment-option.model'
import type { NewAssignmentCartItem } from './new-assignment-state.model'

const FALLBACK_CONDITION: ItemCondition = 'BUENO'

/** Carrito del wizard: alta, baja y edición de las unidades que entrarán al resguardo. */
export class NewAssignmentCartHelper {
  static add(cart: NewAssignmentCartItem[], stocks: AvailableStock[]): NewAssignmentCartItem[] {
    const newItems = stocks
      .filter((stock) => !NewAssignmentCartHelper.contains(cart, stock.id))
      .map((stock) => NewAssignmentCartHelper.itemOf(stock))
    return newItems.length === 0 ? cart : [...cart, ...newItems]
  }

  static remove(cart: NewAssignmentCartItem[], stockId: string): NewAssignmentCartItem[] {
    return cart.filter((item) => item.stock.id !== stockId)
  }

  static withCondition(
    cart: NewAssignmentCartItem[],
    stockId: string,
    condition: ItemCondition,
  ): NewAssignmentCartItem[] {
    return cart.map((item) => (item.stock.id === stockId ? { ...item, condition } : item))
  }

  static withNotes(
    cart: NewAssignmentCartItem[],
    stockId: string,
    notes: string,
  ): NewAssignmentCartItem[] {
    return cart.map((item) => (item.stock.id === stockId ? { ...item, notes } : item))
  }

  static contains(cart: NewAssignmentCartItem[], stockId: string): boolean {
    return cart.some((item) => item.stock.id === stockId)
  }

  static stockIds(cart: NewAssignmentCartItem[]): string[] {
    return cart.map((item) => item.stock.id)
  }

  static toInputItems(cart: NewAssignmentCartItem[]): CreateCustodyItemInput[] {
    return cart.map((item) => ({
      stockId: item.stock.id,
      condition: item.condition,
      notes: item.notes.trim() === '' ? null : item.notes.trim(),
    }))
  }

  /** La condición por defecto es la actual de la unidad; una condición mala nunca es asignable. */
  private static itemOf(stock: AvailableStock): NewAssignmentCartItem {
    return {
      stock,
      condition: ItemConditionHelper.isBad(stock.condition) ? FALLBACK_CONDITION : stock.condition,
      notes: '',
    }
  }
}
