import type { JSX } from 'react'
import { PlusSignIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, PageHero, Pager, useToasts } from '../../../shared/infraestructure/components/ui'
import { BrandCard } from '../components/brand-card.component'
import { BrandCardSkeleton } from '../components/brand-card-skeleton.component'
import { NewBrandModal } from '../components/new-brand-modal.component'
import { useBrands } from '../../hooks/use-brands.hook'
import {CreateBrandCard} from "../components/create-brand-card.component.tsx";

interface Props {
  onSelectBrand?: (name: string) => void
}

export function BrandsPage({ onSelectBrand }: Props): JSX.Element {
  const {
    state,
    showSkeletons,
    skeletonSlots,
    reload,
    setPage,
    setQuery,
    openCreate,
    openEdit,
    saveBrand,
    editingBrand,
    modalKey,
    modalOpen,
    closeModal,
  } = useBrands()
  const [addToast, ToastHost] = useToasts()

  const handleSave = async (name: string): Promise<void> => {
    addToast(await saveBrand(name))
  }

  return (
    <div className="mx-auto w-full max-w-370">
      <PageHero
        eyebrow="Catálogos · marcas"
        title="Marcas de herramientas"
        italic="de herramientas"
        lede={`${state.total} marcas registradas. ${state.modelsTotal} modelos y ${state.toolsTotal} herramientas activas en inventario.`}
        actions={
          <>
            <div className="flex h-9 max-w-65 items-center gap-2 rounded-full border border-hairline-strong bg-white px-3 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
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

      {state.status === 'error' && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-[26px] border border-hairline bg-white">
          <span className="text-[13px] text-muted">{state.error}</span>
          <Button onClick={reload}>Reintentar</Button>
        </div>
      )}

      {state.status !== 'error' && (
        <div className="lg:min-h-160 flex flex-col justify-between">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full">
            <CreateBrandCard openCreate={openCreate} />

            {showSkeletons
                ? skeletonSlots.map((index) => <BrandCardSkeleton key={index} />)
                : state.brands.map((brand) => (
                    <BrandCard
                        key={brand.id}
                        brand={brand}
                        onOpen={() => onSelectBrand?.(brand.name)}
                        onEdit={() => openEdit(brand)}
                    />
                ))
            }
          </div>

          {!showSkeletons && state.brands.length === 0 && state.query !== '' && (
            <div className="mt-3 text-center text-[13px] text-muted">
              Sin resultados para “{state.query}”.
            </div>
          )}

          {state.lastPage > 1 && (
            <div className="mt-5 flex items-center justify-between text-[13px] text-muted">
              <span>
                Página <b className="text-ink">{state.page}</b> de {state.lastPage} · {state.total} marcas
              </span>
              <Pager
                  page={state.page}
                  total={state.lastPage}
                  onChange={setPage}
              />
            </div>
          )}
        </div>
      )}

      <NewBrandModal
        key={modalKey}
        open={modalOpen}
        editName={editingBrand?.name ?? null}
        onClose={closeModal}
        onSave={(name) => void handleSave(name)}
      />

      {ToastHost}
    </div>
  )
}
