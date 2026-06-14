import { type JSX } from 'react'
import { Cancel01Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import { Modal, IconButton, Button, Icon } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'

interface Props {
  open: boolean
  tool: Tool | null
  onClose: () => void
  onConfirm: (tool: Tool) => void
}

export function ToolDeleteModal({ open, tool, onClose, onConfirm }: Props): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} maxWidth={420}>
      <div className="p-6">
        <div className="mb-3.5 flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-danger-soft text-danger">
            <Icon icon={Delete02Icon} size={17} />
          </span>
          <div className="flex-1">
            <div className="mb-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-brand">
              Eliminar herramienta
            </div>
            <div className="text-[19px] font-semibold leading-tight tracking-[-0.015em] text-ink">
              ¿Eliminar del catálogo?
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        {tool && (
          <p className="text-[13px] leading-[1.5] text-ink-2">
            Vas a eliminar <b className="text-ink">{tool.name}</b>{' '}
            <span className="font-mono text-[11px] text-muted">
              ({tool.brand} · {tool.model})
            </span>{' '}
            del catálogo. Esta acción no se puede deshacer.
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" icon={Delete02Icon} onClick={() => tool && onConfirm(tool)}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
