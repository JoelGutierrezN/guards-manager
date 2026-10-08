import { type JSX, type KeyboardEvent } from 'react'
import { Delete02Icon, GitMergeIcon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { IconButton } from '../../../shared/infraestructure/components/ui'
import { BrandService } from '../../application/brand.service'
import type { Brand } from '../../domain/brand.entity'
import { BrandAvatar } from './brand-avatar.component'

interface BrandCardProps {
  brand: Brand
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  onMerge: () => void
}

export function BrandCard({
  brand,
  onOpen,
  onEdit,
  onDelete,
  onMerge,
}: BrandCardProps): JSX.Element {
  const usage = BrandService.usagePercent(brand.toolsAssigned, brand.toolsTotal)

  const handleOpenKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Abrir marca ${brand.name}`}
      onClick={onOpen}
      onKeyDown={handleOpenKeyDown}
      className="group/card cursor-pointer overflow-hidden rounded-[26px] border border-hairline bg-white p-4.5 text-left shadow-[0_1px_2px_rgba(14,15,60,0.04)] transition-[transform,box-shadow] duration-120 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(14,15,60,0.1),0_2px_6px_-1px_rgba(14,15,60,0.05)]"
    >
      <div className="flex items-start gap-3">
        <BrandAvatar name={brand.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div
              title={brand.name}
              className="text-[14px] font-semibold tracking-[-0.01em] truncate text-ink"
            >
              {brand.name}
            </div>
            <div className="flex shrink-0 gap-1">
              <IconButton
                icon={PencilEdit02Icon}
                size="sm"
                tip="Editar nombre"
                aria-label={`Editar ${brand.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              />
              <IconButton
                icon={GitMergeIcon}
                size="sm"
                tip="Fusionar con otra marca"
                aria-label={`Fusionar ${brand.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onMerge()
                }}
              />
              <IconButton
                icon={Delete02Icon}
                size="sm"
                danger
                tip="Eliminar marca"
                aria-label={`Eliminar ${brand.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              />
            </div>
          </div>
          <div className="text-[11px] text-muted">{brand.modelsCount} modelos</div>
        </div>
      </div>

      <div className="my-3 h-px bg-hairline" />

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <div className="text-[11px] text-muted">Herramientas</div>
          <div className="font-mono text-[18px] font-semibold text-ink">{brand.toolsTotal}</div>
        </div>
        <div>
          <div className="text-[11px] text-muted">Asignadas</div>
          <div className="font-mono text-[18px] font-semibold text-brand">
            {brand.toolsAssigned}
          </div>
        </div>
      </div>

      <div className="mt-2.5 h-1 overflow-hidden rounded-sm bg-cream-2">
        <div className="h-full bg-brand" style={{ width: `${usage}%` }} />
      </div>
      <div className="mt-1 font-mono text-[11px] text-muted">{usage}% en uso</div>
    </div>
  )
}
