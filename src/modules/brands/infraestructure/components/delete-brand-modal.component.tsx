import { type JSX } from 'react'
import { Spinner } from '@heroui/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Button, IconButton, Modal } from '../../../shared/infraestructure/components/ui'
import type { Brand } from '../../domain/brand.entity'
import type { BrandDeletionPreview } from '../../domain/brand-deletion-preview.model'

interface Props {
  open: boolean
  brand: Brand | null
  preview: BrandDeletionPreview | null
  previewStatus: 'idle' | 'loading' | 'ready' | 'error'
  deleting: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteBrandModal({
  open,
  brand,
  preview,
  previewStatus,
  deleting,
  error,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const canBeDeleted = preview?.canBeDeleted ?? false

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              Eliminar registro
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Eliminar {brand != null ? `"${brand.name}"` : 'la marca'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        {previewStatus === 'loading' && (
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <Spinner size="sm" /> Revisando modelos y resguardos…
          </div>
        )}

        {previewStatus === 'error' && (
          <p className="text-[13px] leading-relaxed text-danger">
            No se pudo verificar si la marca puede eliminarse. Inténtalo de nuevo.
          </p>
        )}

        {previewStatus === 'ready' && preview != null && (
          <div className="space-y-3">
            {!canBeDeleted && (
              <ul className="list-disc space-y-1 rounded-[12px] bg-danger-soft px-4 py-3 pl-8 text-[12px] text-danger">
                {preview.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
            {preview.models.length > 0 && (
              <p className="text-[13px] leading-relaxed text-ink-2">
                Se eliminarán también sus {preview.models.length} modelo(s) y las unidades asociadas
                quedarán registradas como <b className="text-ink">BAJA</b>.
              </p>
            )}
            <p className="text-[13px] leading-relaxed text-ink-2">
              Esta acción es <b className="text-ink">permanente</b>: la marca se eliminará del
              catálogo y no se podrá recuperar.
            </p>
          </div>
        )}

        {error != null && <p className="mt-2 text-[12px] text-danger">{error}</p>}

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={deleting}>
            Eliminar marca
          </Button>
        </div>
      </div>
    </Modal>
  )
}
