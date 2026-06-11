import { type JSX } from 'react'
import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { IconButton } from '../../../shared/infraestructure/components/ui'
import { type Brand, usagePct } from '../data/brands.data'

interface BrandCardProps {
  brand: Brand
  onOpen: () => void
  onEdit: () => void
}

/** Tarjeta de marca con logotipo de color, stats y barra de uso. */
export function BrandCard({ brand, onOpen, onEdit }: BrandCardProps): JSX.Element {
  const usage = usagePct(brand.asg, brand.tools)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group/card cursor-pointer overflow-hidden rounded-[26px] border border-hairline bg-white p-[18px] text-left shadow-[0_1px_2px_rgba(14,15,60,0.04)] transition-[transform,box-shadow] duration-[120ms] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(14,15,60,0.1),0_2px_6px_-1px_rgba(14,15,60,0.05)]"
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-[18px] font-bold tracking-[0.04em] text-ink"
          style={{ background: brand.color, boxShadow: `0 4px 12px -3px ${brand.color}80` }}
        >
          {brand.initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{brand.name}</div>
            <IconButton
              icon={PencilEdit02Icon}
              size="sm"
              tip="Editar nombre"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            />
          </div>
          <div className="text-[11px] text-muted">{brand.models} modelos</div>
        </div>
      </div>

      <div className="my-3 h-px bg-hairline" />

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <div className="text-[11px] text-muted">Herramientas</div>
          <div className="font-mono text-[18px] font-semibold text-ink">{brand.tools}</div>
        </div>
        <div>
          <div className="text-[11px] text-muted">Asignadas</div>
          <div className="font-mono text-[18px] font-semibold text-brand">{brand.asg}</div>
        </div>
      </div>

      <div className="mt-2.5 h-1 overflow-hidden rounded-[2px] bg-cream-2">
        <div className="h-full bg-brand" style={{ width: `${usage}%` }} />
      </div>
      <div className="mt-1 font-mono text-[11px] text-muted">{usage}% en uso</div>
    </button>
  )
}
