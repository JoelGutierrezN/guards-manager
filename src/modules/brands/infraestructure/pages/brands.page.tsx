import { type JSX, useState } from 'react'
import { PlusSignIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import { BrandCard } from '../components/brand-card.component'
import { NewBrandModal } from '../components/new-brand-modal.component'
import { BRANDS, type Brand } from '../data/brands.data'

interface BrandsPageProps {
  /** Abre el detalle de la marca seleccionada. */
  onSelectBrand: (name: string) => void
}

/** Catálogo de marcas: cuadrícula de tarjetas + alta/edición. */
export function BrandsPage({ onSelectBrand }: BrandsPageProps): JSX.Element {
  const [createOpen, setCreateOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<Brand | null>(null)
  const [addToast, ToastHost] = useToasts()

  const totalModels = BRANDS.reduce((a, b) => a + b.models, 0)
  const totalTools = BRANDS.reduce((a, b) => a + b.tools, 0)

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <PageHero
        eyebrow="Catálogos · marcas"
        title="Marcas de herramientas"
        italic="de herramientas"
        lede={`${BRANDS.length} marcas registradas. ${totalModels} modelos y ${totalTools} herramientas activas en inventario.`}
        actions={
          <>
            <div className="flex h-9 max-w-[260px] items-center gap-2 rounded-full border border-hairline-strong bg-white px-3 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
              <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.8} className="shrink-0 text-muted" />
              <input
                className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-muted-soft"
                placeholder="Buscar marca…"
              />
            </div>
            <Button variant="primary" icon={PlusSignIcon} onClick={() => setCreateOpen(true)}>
              Nueva marca
            </Button>
          </>
        }
      />

      <div className="reveal-d2 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="group/add grid min-h-40 cursor-pointer place-items-center rounded-[26px] border border-dashed border-hairline-strong bg-transparent transition-[border-color,background] duration-200 hover:border-brand hover:bg-brand-soft"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-brand-soft text-brand">
              <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.8} />
            </div>
            <div className="text-[13px] font-semibold text-ink">Agregar marca</div>
          </div>
        </button>

        {BRANDS.map((brand) => (
          <BrandCard
            key={brand.name}
            brand={brand}
            onOpen={() => onSelectBrand(brand.name)}
            onEdit={() => setEditBrand(brand)}
          />
        ))}
      </div>

      <NewBrandModal
        key={createOpen ? 'create-open' : 'create-closed'}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(name) => {
          addToast(`Marca "${name}" creada`)
          setCreateOpen(false)
        }}
      />

      <NewBrandModal
        key={`edit-${editBrand?.name ?? 'closed'}`}
        open={editBrand != null}
        editName={editBrand?.name ?? null}
        onClose={() => setEditBrand(null)}
        onSave={(name) => {
          addToast(`Marca actualizada a "${name}"`)
          setEditBrand(null)
        }}
      />

      {ToastHost}
    </div>
  )
}
