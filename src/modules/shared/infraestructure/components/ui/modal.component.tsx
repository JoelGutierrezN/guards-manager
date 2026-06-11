import { type JSX, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

/** Diálogo centrado con backdrop difuminado. Fiel al `.modal` del diseño. */
export function Modal({ open, onClose, children, className }: ModalProps): JSX.Element {
  return (
    <div
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-[100] grid place-items-center p-5 transition-opacity duration-200',
        'bg-[rgba(5,10,26,0.45)] backdrop-blur-[8px] backdrop-saturate-[1.4]',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full max-w-[480px] rounded-[26px] bg-white shadow-[0_36px_70px_-18px_rgba(14,15,60,0.3),0_12px_26px_-8px_rgba(14,15,60,0.12)] transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2.5 scale-[0.98] opacity-0',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
