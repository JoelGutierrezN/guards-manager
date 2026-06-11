import { type JSX } from 'react'
import {
  ArrowLeft01Icon,
  PencilEdit02Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Chip, IconButton, useToasts } from '../../../shared/infraestructure/components/ui'
import { BRAND_DB, usagePct } from '../data/brands.data'

interface BrandDetailPageProps {
  brandName: string
  onBack: () => void
  /** Navega al catálogo de modelos (para "Nuevo modelo"). */
  onModels?: () => void
}

function Kpi({ label, value, accent }: { label: string; value: string | number; accent?: boolean }): JSX.Element {
  return (
    <div className="rounded-[26px] border border-hairline bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
      <div className="text-[11px] text-muted">{label}</div>
      <div
        className={`mt-0.5 font-mono text-[26px] font-semibold tracking-[-0.02em] ${accent ? 'text-brand' : 'text-ink'}`}
      >
        {value}
      </div>
    </div>
  )
}

/** Detalle de una marca: cabecera, KPIs y tabla de modelos. */
export function BrandDetailPage({ brandName, onBack, onModels }: BrandDetailPageProps): JSX.Element {
  const brand = BRAND_DB[brandName] ?? BRAND_DB.DeWalt
  const [addToast, ToastHost] = useToasts()
  const usage = usagePct(brand.asg, brand.tools)

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <button
        type="button"
        onClick={onBack}
        className="reveal-d1 mb-3 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold text-ink-2 transition-colors hover:bg-brand-soft hover:text-ink"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={1.8} /> Volver a marcas
      </button>

      <div className="reveal-d1 mb-[22px] flex items-start gap-[18px]">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-[16px] text-[28px] font-bold tracking-[0.03em] text-ink"
          style={{ background: brand.color, boxShadow: `0 8px 22px -6px ${brand.color}90` }}
        >
          {brand.initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
            Catálogos · marca
          </div>
          <div className="text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
            {brand.name}
          </div>
          <div className="mt-1.5 text-[12px] text-muted">
            En catálogo desde {brand.since} · {brand.models} modelos y {brand.tools} herramientas
            registradas.
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button icon={PencilEdit02Icon} onClick={() => addToast(`Editar ${brand.name}`)}>
            Editar marca
          </Button>
          <Button variant="primary" icon={PlusSignIcon} onClick={() => onModels?.()}>
            Nuevo modelo
          </Button>
        </div>
      </div>

      <div className="reveal-d2 mb-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Kpi label="Modelos" value={brand.models} />
        <Kpi label="Herramientas" value={brand.tools} />
        <Kpi label="Asignadas" value={brand.asg} accent />
        <Kpi label="En uso" value={`${usage}%`} accent />
      </div>

      <div className="reveal-d3 overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-hairline px-4 py-3">
          <div>
            <div className="font-mono text-[11px] tracking-[0.04em] text-muted uppercase">Modelos</div>
            <div className="text-[14px] font-semibold text-ink">
              {brand.models} modelos de {brand.name}
            </div>
          </div>
          <Chip tone="navy" size="sm">
            {brand.tools} herramientas
          </Chip>
        </div>

        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="w-[150px] border-b border-hairline bg-[#fbf9fc] px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
                Código
              </th>
              <th className="border-b border-hairline bg-[#fbf9fc] px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
                Descripción
              </th>
              <th className="w-20 border-b border-hairline bg-[#fbf9fc] px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
                Herram.
              </th>
              <th className="w-40 border-b border-hairline bg-[#fbf9fc] px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
                Uso
              </th>
              <th className="w-14 border-b border-hairline bg-[#fbf9fc] px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {brand.rows.map((m) => {
              const pct = usagePct(m.asg, m.tools)
              return (
                <tr key={m.code} className="group/row transition-colors hover:bg-[#fbf9fc]">
                  <td className="border-b border-hairline px-3 py-2.5 font-mono font-medium text-ink">
                    {m.code}
                  </td>
                  <td className="border-b border-hairline px-3 py-2.5 text-ink-2">{m.desc}</td>
                  <td className="border-b border-hairline px-3 py-2.5 font-mono font-medium text-ink-2">
                    {m.tools}
                  </td>
                  <td className="border-b border-hairline px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-[38px] font-mono text-[11px] text-ink-2">
                        {m.asg}/{m.tools}
                      </span>
                      <div className="h-1 max-w-[70px] flex-1 overflow-hidden rounded-[2px] bg-cream-2">
                        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-[30px] text-right font-mono text-[11px] text-muted">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-hairline px-3 py-2.5 text-right">
                    <span className="opacity-0 transition-opacity group-hover/row:opacity-100">
                      <IconButton
                        icon={PencilEdit02Icon}
                        tip="Editar"
                        size="sm"
                        onClick={() => addToast(`Editar ${m.code}`)}
                      />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {ToastHost}
    </div>
  )
}
