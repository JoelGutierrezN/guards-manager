const NUMERIC_PATTERN = /^-?\d+(?:[.,]\d+)?$/

export class NumberInputHelper {
  static parse(text: string): number | null {
    const trimmed = text.trim()
    if (!NUMERIC_PATTERN.test(trimmed)) return null
    const parsed = Number(trimmed.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : null
  }

  static clamp(value: number, min: number, max: number): number {
    if (value < min) return min
    if (value > max) return max
    return value
  }

  /** Acota al rango y redondea a entero cuando el paso también lo es. */
  static normalize(value: number, min: number, max: number, step: number): number {
    const rounded = Number.isInteger(step) ? Math.round(value) : value
    return NumberInputHelper.clamp(rounded, min, max)
  }
}
