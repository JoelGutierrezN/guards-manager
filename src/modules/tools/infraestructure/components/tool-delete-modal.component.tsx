import { type JSX } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { ConfirmDialog } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import { ToolDeleteBody } from './tool-delete-body.component'

interface Props {
  open: boolean
  tool: Tool | null
  conflict: string | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ToolDeleteModal({
  open,
  tool,
  conflict,
  loading,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  return (
    <ConfirmDialog
      open={open && tool !== null}
      eyebrow="Eliminar herramienta"
      title="¿Eliminar del catálogo?"
      icon={Delete02Icon}
      destructive
      loading={loading}
      confirmLabel="Eliminar"
      body={tool !== null && <ToolDeleteBody tool={tool} conflict={conflict} />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
