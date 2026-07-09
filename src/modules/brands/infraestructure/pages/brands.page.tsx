import { type JSX } from 'react'
import { PlusSignIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, PageHero, Pager, useToasts } from '../../../shared/infraestructure/components/ui'
import { BrandCard } from '../components/brand-card.component'
import { NewBrandModal } from '../components/new-brand-modal.component'
import { useBrands } from '../../hooks/use-brands.hook'

interface BrandsPageProps {
  /** Abre el detalle de la marca seleccionada (opcional mientras no exista su endpoint). */
  onSelectBrand?: (name: string) => void
}

/** Catálogo de marcas: cuadrícula de tarjetas + alta/edición contra la API. */
export function BrandsPage({ onSelectBrand }: BrandsPageProps): JSX.Element {
  const {
    state,
    reload,
    setPage,
    setQuery,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    createBrand,
    renameBrand,
  } = useBrands()
  const [addToast, ToastHost] = useToasts()

  const handleCreate = async (name: string): Promise<void> => {
    const created = await createBrand(name)
    addToast(created ? `Marca "${name}" creada` : 'No se pudo crear la marca')
  }

  const handleRename = async (name: string): Promise<void> => {
    if (!state.editBrand) return
    const renamed = await renameBrand(state.editBrand.id, name)
    addToast(renamed ? `Marca actualizada a "${name}"` : 'No se pudo actualizar la marca')
  }

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <PageHero
        eyebrow="Catálogos · marcas"
        title="Marcas de herramientas"
        italic="de herramientas"
        lede={`${state.total} marcas registradas. ${state.modelsTotal} modelos y ${state.toolsTotal} herramientas activas en inventario.`}
        actions={
          <>
            <div className="flex h-9 max-w-[260px] items-center gap-2 rounded-full border border-hairline-strong bg-white px-3 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
              <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={1.8} className="shrink-0 text-muted" />
              <input
                className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-muted-soft"
                placeholder="Buscar marca…"
                value={state.query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Button variant="primary" icon={PlusSignIcon} onClick={openCreate}>
              Nueva marca
            </Button>
          </>
        }
      />

      {state.status === 'loading' && (
        <div className="grid min-h-40 place-items-center rounded-[26px] border border-hairline bg-white text-[13px] text-muted">
          Cargando marcas…
        </div>
      )}

      {state.status === 'error' && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-[26px] border border-hairline bg-white">
          <span className="text-[13px] text-muted">{state.error}</span>
          <Button onClick={reload}>Reintentar</Button>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <div className="reveal-d2 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button
              type="button"
              onClick={openCreate}
              className="group/add grid min-h-40 cursor-pointer place-items-center rounded-[26px] border border-dashed border-hairline-strong bg-transparent transition-[border-color,background] duration-200 hover:border-brand hover:bg-brand-soft"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-brand-soft text-brand">
                  <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.8} />
                </div>
                <div className="text-[13px] font-semibold text-ink">Agregar marca</div>
              </div>
            </button>

            {state.brands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                onOpen={() => onSelectBrand?.(brand.name)}
                onEdit={() => openEdit(brand)}
              />
            ))}
          </div>

          {state.brands.length === 0 && state.query !== '' && (
            <div className="mt-3 text-center text-[13px] text-muted">
              Sin resultados para “{state.query}”.
            </div>
          )}

          {state.lastPage > 1 && (
            <div className="mt-5 flex items-center justify-between text-[13px] text-muted">
              <span>
                Página <b className="text-ink">{state.page}</b> de {state.lastPage} · {state.total} marcas
              </span>
              <Pager page={state.page} total={state.lastPage} onChange={setPage} />
            </div>
          )}
        </>
      )}

      <NewBrandModal
        key={state.createOpen ? 'create-open' : 'create-closed'}
        open={state.createOpen}
        onClose={closeCreate}
        onSave={(name) => void handleCreate(name)}
      />

      <NewBrandModal
        key={`edit-${state.editBrand?.id ?? 'closed'}`}
        open={state.editBrand != null}
        editName={state.editBrand?.name ?? null}
        onClose={closeEdit}
        onSave={(name) => void handleRename(name)}
      />

      {ToastHost}
    </div>
  )
}
