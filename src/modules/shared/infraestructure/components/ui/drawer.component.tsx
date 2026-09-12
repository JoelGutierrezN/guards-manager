import { type JSX, type ReactNode, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../utils/cn'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  widthPx?: number
  footer?: ReactNode
  children: ReactNode
}

export function Drawer({
  open,
  title,
  onClose,
  widthPx = 460,
  footer,
  children,
}: Props): JSX.Element {
  const overlayClassName = useMemo(
    () =>
      cn(
        'fixed inset-0 z-[100] transition-[opacity] duration-200',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      ),
    [open],
  )

  const panelClassName = useMemo(
    () =>
      cn(
        'flex h-full flex-col bg-white shadow-[-24px_0_60px_-20px_rgba(14,15,60,0.28)] transition-transform duration-[280ms]',
        open ? 'translate-x-0' : 'translate-x-full',
      ),
    [open],
  )

  return (
    <div className={overlayClassName}>
      <div
        className="absolute inset-0 bg-[rgba(5,10,26,0.45)] backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex" style={{ width: widthPx }}>
        <div className={panelClassName}>
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-2 transition-[background,color] duration-[120ms] hover:bg-brand-soft hover:text-ink"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="border-t border-hairline px-5 py-4">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
