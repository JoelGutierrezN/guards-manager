import { type JSX, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  open: boolean
  onClose: () => void
  maxWidth?: number
  className?: string
  children: ReactNode
}

export function Modal({ open, onClose, maxWidth = 480, className, children }: Props): JSX.Element {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] grid place-items-center p-5 backdrop-blur-[8px] transition-[opacity] duration-200',
        'bg-[rgba(5,10,26,0.45)] [backdrop-filter:blur(8px)_saturate(140%)]',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full rounded-[26px] bg-white shadow-[0_36px_70px_-18px_rgba(14,15,60,0.3),0_12px_26px_-8px_rgba(14,15,60,0.12)] transition-[transform,opacity]',
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-[10px] scale-[0.98] opacity-0',
          className,
        )}
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
