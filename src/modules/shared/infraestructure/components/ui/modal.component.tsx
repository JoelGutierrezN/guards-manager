import { type JSX, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [previousOpen, setPreviousOpen] = useState(open)
  const dialogRef = useRef<HTMLDivElement>(null)

  if (open !== previousOpen) {
    setPreviousOpen(open)
    if (open) setIsMounted(true)
  }

  useEffect(() => {
    if (open || !isMounted) return
    const unmountTimeoutId = window.setTimeout(() => setIsMounted(false), EXIT_TRANSITION_MS)
    return () => window.clearTimeout(unmountTimeoutId)
  }, [open, isMounted])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key === 'Tab') {
        ModalFocusTrapHelper.keepFocusInside(dialogRef.current, event)
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return

    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    ModalFocusTrapHelper.focusFirstElement(dialogRef.current)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement?.focus()
    }
  }, [open, handleKeyDown])

  const overlayClassName = useMemo(
    () =>
      cn(
        'fixed inset-0 z-[100] grid place-items-center p-5 backdrop-blur-[8px] transition-[opacity] duration-200',
        'bg-[rgba(5,10,26,0.45)] [backdrop-filter:blur(8px)_saturate(140%)]',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ),
    [open],
  )

  const panelClassName = useMemo(
    () =>
      cn(
        'relative w-full rounded-[26px] bg-white shadow-[0_36px_70px_-18px_rgba(14,15,60,0.3),0_12px_26px_-8px_rgba(14,15,60,0.12)] transition-[transform,opacity]',
        open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-[10px] scale-[0.98] opacity-0',
        className,
      ),
    [open, className],
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
          transitionDuration: open ? '320ms' : '200ms',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
