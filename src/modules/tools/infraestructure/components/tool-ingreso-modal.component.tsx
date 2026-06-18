import { type JSX, useState } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Modal, IconButton, Button } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'

interface Props {
  open: boolean
  tool: Tool | null
  onClose: () => void
  onConfirm: (quantity: number) => void
}

export function ToolIngresoModal({ open, tool, onClose, onConfirm }: Props): JSX.Element {
  const [quantityText, setQuantityText] = useState('')

  const parsedQuantity = parseInt(quantityText, 10)
  const isValid = Number.isFinite(parsedQuantity) && parsedQuantity > 0

  const handleClose = () => {
    setQuantityText('')
    onClose()
  }

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(parsedQuantity)
      setQuantityText('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isValid) handleConfirm()
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={440}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-brand">
              Declarar ingreso
            </div>
            <div className="text-[20px] font-semibold leading-tight tracking-[-0.015em] text-ink">
              Ingreso de herramientas
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={handleClose} bordered size="sm" />
        </div>

        {tool && (
          <div className="mb-4 rounded-[12px] bg-cream px-3 py-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-medium text-ink">{tool.name}</span>
              <span className="font-mono text-[11px] text-muted">
                {tool.brand} · {tool.model}
              </span>
            </div>
          </div>
        )}

        <div className="mb-1 flex items-center justify-between text-[12px] font-medium text-ink-2">
          <span>
            ¿Cuántas unidades van a ingresar?{' '}
            <span className="text-danger">*</span>
          </span>
        </div>
        <input
          className="h-[42px] w-full rounded-full border border-hairline-strong bg-white px-4 font-mono text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)] transition-[border-color,box-shadow]"
          type="number"
          min="1"
          placeholder="0"
          value={quantityText}
          autoFocus
          onChange={(event) => setQuantityText(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!isValid} onClick={handleConfirm}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
