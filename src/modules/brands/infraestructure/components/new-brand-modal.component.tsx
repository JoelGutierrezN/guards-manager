import { type JSX, useState } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Button, IconButton, Modal } from '../../../shared/infraestructure/components/ui'

interface NewBrandModalProps {
  open: boolean
  /** Nombre actual cuando se edita; `null` para crear. */
  editName?: string | null
  onClose: () => void
  onSave: (name: string) => void
}

/**
 * Modal para crear o editar una marca.
 *
 * El estado del campo se inicializa desde `editName`. El padre debe pasar una
 * `key` que cambie al abrir (p. ej. el nombre editado) para reiniciar el campo.
 */
export function NewBrandModal({
  open,
  editName = null,
  onClose,
  onSave,
}: NewBrandModalProps): JSX.Element {
  const isEdit = editName != null
  const [name, setName] = useState(() => editName ?? '')

  const valid = name.trim().length >= 2

  return (
    <Modal open={open} onClose={onClose}>
      <div className="px-6 pt-6 pb-5">
        <div className="mb-3.5 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              {isEdit ? 'Editar registro' : 'Nuevo registro'}
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              {isEdit ? 'Editar marca' : 'Crear nueva marca'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <label className="flex items-center justify-between text-[12px] font-medium text-ink-2">
            <span>
              Nombre de la marca <span className="text-danger">*</span>
            </span>
          </label>
          <div className="flex h-[42px] items-center rounded-full border border-hairline-strong bg-white px-4 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
            <input
              className="h-full min-w-0 flex-1 border-none bg-transparent text-[14px] text-ink outline-none placeholder:text-muted-soft"
              placeholder="Ej. Hilti, Stanley, Bahco…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <span className="text-[11px] text-muted">
            Estará disponible al crear herramientas y modelos.
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!valid}
            onClick={() => {
              onSave(name.trim())
              setName('')
            }}
          >
            {isEdit ? 'Guardar cambios' : 'Crear marca'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
