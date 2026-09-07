import { type JSX, type ReactNode, useCallback, useMemo } from 'react'
import { Spinner } from '@heroui/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import { Button } from './button.component'
import { Icon } from './icon.component'
import { IconButton } from './icon-button.component'
import { Modal } from './modal.component'

interface Props {
  open: boolean
  title: string
  eyebrow?: string
  body?: ReactNode
  icon?: IconSvgElement
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  eyebrow,
  body,
  icon,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: Props): JSX.Element {
  const iconClassName = useMemo(
    () =>
      cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]',
        destructive ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-brand',
      ),
    [destructive],
  )

  const eyebrowClassName = useMemo(
    () =>
      cn(
        'mb-0.5 font-mono text-[10px] font-medium tracking-[0.14em] uppercase',
        destructive ? 'text-danger' : 'text-brand',
      ),
    [destructive],
  )

  const handleClose = useCallback(() => {
    if (loading) return
    onClose()
  }, [loading, onClose])

  if (!open) return <></>

  return (
    <Modal open={open} onClose={handleClose} maxWidth={440}>
      <div className="p-6">
        <div className="mb-3.5 flex items-start gap-3">
          {icon && (
            <span className={iconClassName}>
              <Icon icon={icon} size={17} />
            </span>
          )}
          <div className="flex-1">
            {eyebrow && <div className={eyebrowClassName}>{eyebrow}</div>}
            <div className="text-[19px] leading-tight font-semibold tracking-[-0.015em] text-ink">
              {title}
            </div>
          </div>
          <IconButton
            icon={Cancel01Icon}
            onClick={handleClose}
            disabled={loading}
            bordered
            size="sm"
          />
        </div>

        {body && <div className="text-[13px] leading-[1.5] text-ink-2">{body}</div>}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Spinner size="sm" color="current" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
