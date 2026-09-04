export class NumberInputHelper {
  static parse(text: string): number | null {
    const normalized = text.trim().replace(',', '.')
    if (normalized === '') return null
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  static clamp(value: number, min: number, max: number): number {
    if (value < min) return min
    if (value > max) return max
    return value
  }
}
