import { type JSX } from 'react'
import { Spinner } from '@heroui/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Button, IconButton, Modal } from '../../../shared/infraestructure/components/ui'
import type { ProductModel } from '../../domain/product-model.entity'
import type { ProductModelDeletionPreview } from '../../domain/product-model-deletion-preview.model'
import { ModelDeletionPreviewHelper } from '../helpers/model-deletion-preview.helper'

interface Props {
  open: boolean
  model: ProductModel | null
  preview: ProductModelDeletionPreview | null
  previewStatus: 'idle' | 'loading' | 'ready' | 'error'
  onClose: () => void
  onConfirm: () => void
}

export function DeleteModelModal({
  open,
  model,
  preview,
  previewStatus,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const canBeDeleted = preview?.canBeDeleted ?? false
  const reasons = preview != null ? ModelDeletionPreviewHelper.blockingReasons(preview) : []

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

        {previewStatus === 'loading' && (
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <Spinner size="sm" /> Revisando existencias y resguardos…
          </div>
        )}

        {previewStatus === 'error' && (
          <p className="text-[13px] leading-relaxed text-danger">
            No se pudo verificar si el modelo puede eliminarse. Inténtalo de nuevo.
          </p>
        )}

        {previewStatus === 'ready' && preview != null && (
          <div className="space-y-3">
            {!canBeDeleted && (
              <ul className="list-disc space-y-1 rounded-[12px] bg-danger-soft px-4 py-3 pl-8 text-[12px] text-danger">
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
            {preview.affectedProducts.length > 0 && (
              <p className="text-[13px] leading-relaxed text-ink-2">
                Recuerda: las {ModelDeletionPreviewHelper.totalAffectedStocks(preview)} unidades de{' '}
                {preview.affectedProducts.length} producto(s) de este modelo quedarán registradas
                como <b className="text-ink">BAJA</b>.
              </p>
            )}
            <p className="text-[13px] leading-relaxed text-ink-2">
              Esta acción es <b className="text-ink">permanente</b>: el modelo se eliminará del
              catálogo y no se podrá recuperar.
            </p>
          </div>
        )}

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
