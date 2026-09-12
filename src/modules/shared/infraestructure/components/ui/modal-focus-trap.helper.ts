const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export class ModalFocusTrapHelper {
  static getFocusableElements(container: HTMLElement | null): HTMLElement[] {
    if (!container) return []
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }

  static focusFirstElement(container: HTMLElement | null): void {
    const focusableElements = ModalFocusTrapHelper.getFocusableElements(container)
    const firstFocusableElement = focusableElements[0]
    if (firstFocusableElement) {
      firstFocusableElement.focus()
      return
    }
    container?.focus()
  }

  static keepFocusInside(container: HTMLElement | null, event: KeyboardEvent): void {
    const focusableElements = ModalFocusTrapHelper.getFocusableElements(container)
    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
      return
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}
