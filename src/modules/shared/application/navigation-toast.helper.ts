import type { NavigationToastState } from '../domain/navigation-toast.model'

export class NavigationToastHelper {
  static stateFor(message: string): NavigationToastState {
    return { toastMessage: message }
  }

  static messageFrom(state: unknown): string | null {
    if (typeof state !== 'object' || state === null) return null
    const { toastMessage } = state as Partial<NavigationToastState>
    return typeof toastMessage === 'string' && toastMessage !== '' ? toastMessage : null
  }
}
