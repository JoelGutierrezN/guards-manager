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

  static withSerial(
    cart: NewAssignmentCartItem[],
    stockId: string,
    serial: string,
  ): NewAssignmentCartItem[] {
    return cart.map((item) =>
      item.stock.id === stockId && item.stock.serial === null ? { ...item, serial } : item,
    )
  }

  static serialErrors(cart: NewAssignmentCartItem[]): Record<string, string> {
    const errors: Record<string, string> = {}
    const serialCounts = new Map<string, number>()
    cart.forEach((item) => {
      const serial = (item.stock.serial ?? item.serial).trim().toUpperCase()
      if (serial !== '') serialCounts.set(serial, (serialCounts.get(serial) ?? 0) + 1)
    })
    cart.forEach((item) => {
      const serial = (item.stock.serial ?? item.serial).trim().toUpperCase()
      if (serial === '') errors[item.stock.id] = 'Captura el número de serie de esta unidad.'
      else if (serial.length > 255)
        errors[item.stock.id] = 'La serie no puede superar 255 caracteres.'
      else if ((serialCounts.get(serial) ?? 0) > 1)
        errors[item.stock.id] = 'La serie está repetida en este resguardo.'
    })
    return errors
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
      ...(item.stock.serial === null ? { serial: item.serial.trim().toUpperCase() } : {}),
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
      serial: '',
    }
  }
}
