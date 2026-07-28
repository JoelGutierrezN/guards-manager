import { type JSX } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Button, IconButton, Modal } from '../../../shared/infraestructure/components/ui'
import type { ProductModel } from '../../domain/product-model.entity'

interface Props {
  open: boolean
  model: ProductModel | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteModelModal({ open, model, onClose, onConfirm }: Props): JSX.Element {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              Eliminar registro
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Eliminar {model != null ? `"${model.name}"` : 'el modelo'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        <p className="text-[13px] leading-relaxed text-ink-2">
          Esta acción es <b className="text-ink">permanente</b>: el modelo se eliminará del catálogo
          y no se podrá recuperar.
        </p>

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Eliminar modelo
          </Button>
        </div>
      </div>
    </Modal>
  )
}
