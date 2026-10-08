import type { FromLocationState } from './from-location-state.interfaces'

export class FromLocationHelper {
  static resolvePath(state: FromLocationState | null, fallback = '/dashboard'): string {
    const from = state?.from
    if (!from) return fallback
    return `${from.pathname}${from.search ?? ''}`
  }
}
