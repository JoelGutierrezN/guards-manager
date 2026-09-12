const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export class ModalFocusTrapHelper {
  static getFocusableElements(container: HTMLElement | null): HTMLElement[] {
    if (!container) return []
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }

  /**
   * No roba el foco si el diálogo ya tiene algo enfocado dentro: así gana el `autoFocus`
   * declarado en el primer campo de los formularios, que React aplica en el commit
   * (antes de que corra el efecto del Modal).
   */
  static focusFirstElement(container: HTMLElement | null): void {
    if (!container) return
    if (container.contains(document.activeElement)) return

    const focusableElements = ModalFocusTrapHelper.getFocusableElements(container)
    const firstFocusableElement = focusableElements[0]
    if (firstFocusableElement) {
      firstFocusableElement.focus()
      return
    }
    container.focus()
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

    /**
     * El foco puede estar en el propio panel (`tabIndex={-1}`, se enfoca al hacer clic en
     * una zona no interactiva) o haberse perdido al desaparecer el elemento enfocado: sin
     * este caso el `Tab` nativo saca el foco del diálogo hacia la página de detrás.
     */
    if (!activeElement || activeElement === container || !container?.contains(activeElement)) {
      event.preventDefault()
      const fallbackElement = event.shiftKey ? lastElement : firstElement
      fallbackElement.focus()
      return
    }

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
