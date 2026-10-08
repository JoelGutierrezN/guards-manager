import {
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../utils/cn'
import { ModalFocusTrapHelper } from './modal-focus-trap.helper'

interface Props {
  open: boolean
  onClose: () => void
  maxWidth?: number
  className?: string
  children: ReactNode
}

const EXIT_TRANSITION_MS = 200

export function Modal({
  open,
  onClose,
  maxWidth = 480,
  className,
  children,
}: Props): JSX.Element | null {
  const [isMounted, setIsMounted] = useState(open)
  const [isVisible, setIsVisible] = useState(false)
  const [previousOpen, setPreviousOpen] = useState(open)
  const dialogRef = useRef<HTMLDivElement>(null)

  if (open !== previousOpen) {
    setPreviousOpen(open)
    if (open) setIsMounted(true)
    else setIsVisible(false)
  }

  useEffect(() => {
    if (open || !isMounted) return
    const unmountTimeoutId = window.setTimeout(() => setIsMounted(false), EXIT_TRANSITION_MS)
    return () => window.clearTimeout(unmountTimeoutId)
  }, [open, isMounted])

  /**
   * El panel se monta con las clases de cerrado y la apertura se activa en el frame
   * siguiente: sin ese frame intermedio el navegador no tiene estado inicial desde el
   * que animar y la transición de entrada no llega a ejecutarse.
   */
  useEffect(() => {
    if (!open) return
    const entranceFrameId = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(entranceFrameId)
  }, [open])

  /**
   * Solo depende de `open`: si dependiera del manejador de teclado (y por tanto de la
   * identidad de `onClose`), cada render de un consumidor con `onClose` sin memoizar
   * devolvería el foco al fondo y volvería a robarlo al primer elemento del diálogo.
   */
  useEffect(() => {
    if (!open) return
    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    ModalFocusTrapHelper.focusFirstElement(dialogRef.current)
    return () => previouslyFocusedElement?.focus()
  }, [open])

  /**
   * El teclado se escucha en el propio panel (no en `document`) y el evento se detiene
   * aquí: así el modal más interno es el único que reacciona cuando hay diálogos
   * anidados, y una capa interna (el desplegable del Combobox) puede consumir `Escape`
   * antes de que llegue al modal.
   */
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key === 'Tab') {
      event.stopPropagation()
      ModalFocusTrapHelper.keepFocusInside(dialogRef.current, event.nativeEvent)
    }
  }

  const overlayClassName = useMemo(
    () =>
      cn(
        'fixed inset-0 z-[100] grid place-items-center p-5 backdrop-blur-[8px] transition-[opacity] duration-200',
        'bg-[rgba(5,10,26,0.45)] [backdrop-filter:blur(8px)_saturate(140%)]',
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ),
    [isVisible],
  )

  const panelClassName = useMemo(
    () =>
      cn(
        'relative w-full rounded-[26px] bg-white shadow-[0_36px_70px_-18px_rgba(14,15,60,0.3),0_12px_26px_-8px_rgba(14,15,60,0.12)] transition-[transform,opacity]',
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-[10px] scale-[0.98] opacity-0',
        className,
      ),
    [isVisible, className],
  )

  if (!isMounted) return null

  return (
    <div className={overlayClassName} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={panelClassName}
        style={{
          maxWidth,
          transitionDuration: isVisible ? '320ms' : '200ms',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
