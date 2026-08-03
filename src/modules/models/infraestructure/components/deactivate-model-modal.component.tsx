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

export function DeactivateModelModal({ open, model, onClose, onConfirm }: Props): JSX.Element {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              Baja de modelo
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Dar de baja {model != null ? `"${model.name}"` : 'el modelo'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-ink-2">
          <p>
            Un modelo dado de baja{' '}
            <b className="text-ink">no permite dar de alta nuevas existencias</b>. Las herramientas
            ya resguardadas siguen operando con normalidad.
          </p>
          <p>
            Para poder <b className="text-ink">eliminar</b> el modelo más adelante, primero hay que
            recolectar las herramientas que estén en resguardo.
          </p>
          <p className="text-[12px] text-muted">Podrás reactivar el modelo cuando quieras.</p>
        </div>

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Dar de baja
          </Button>
        </div>
      </div>
    </Modal>
  )
}
