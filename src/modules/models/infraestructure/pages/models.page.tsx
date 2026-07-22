import { type JSX, useMemo, useState } from 'react'
import {
  Delete02Icon,
  Download04Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Button,
  Checkbox,
  IconButton,
  Pager,
  PageHero,
  Tabs,
  useToasts,
} from '../../../shared/infraestructure/components/ui'
import { NewModelModal } from '../components/new-model-modal.component'
import { BRANDS_FILTER, MODELS, usagePct, type ToolModel } from '../data/models.data'

const TH =
  'border-b border-hairline bg-[#fbf9fc] px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase'
const TD = 'border-b border-hairline px-3 py-2.5'

interface ModelRowProps {
  model: ToolModel
  onEdit: () => void
  onDelete: () => void
}

function ModelRow({ model, onEdit, onDelete }: ModelRowProps): JSX.Element {
  const pct = usagePct(model.asg, model.tools)
  return (
    <tr className="group/row transition-colors hover:bg-[#fbf9fc]">
      <td className={`${TD} w-8`}>
        <Checkbox />
      </td>
      <td className={`${TD} w-[130px]`}>
        <span className="font-medium text-ink">{model.brand}</span>
      </td>
      <td className={`${TD} w-[170px] min-w-[200px] font-mono font-medium text-ink`}>
        {model.code}
      </td>
      <td className={`${TD} w-20 font-mono font-medium text-ink-2`}>{model.tools}</td>
      <td className={`${TD} w-[170px]`}>
        <div className="flex items-center gap-2">
          <span className="w-9 font-mono text-[11px] text-ink-2">
            {model.asg}/{model.tools}
          </span>
          <div className="h-1 max-w-20 flex-1 overflow-hidden rounded-[2px] bg-cream-2">
            <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
          <span className="w-8 text-right font-mono text-[11px] text-muted">{pct}%</span>
        </div>
      </td>
      <td className={`${TD} w-[150px] text-right`}>
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
          <IconButton icon={PencilEdit02Icon} tip="Editar" size="sm" onClick={onEdit} />
          <IconButton icon={Delete02Icon} tip="Eliminar" size="sm" danger onClick={onDelete} />
        </div>
      </td>
    </tr>
  )
}

type BrandFilter = (typeof BRANDS_FILTER)[number]

/** Catálogo de modelos: filtro por marca, tabla, alta/edición y borrado. */
export function ModelsPage(): JSX.Element {
  const [brand, setBrand] = useState<BrandFilter>('Todas')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editModel, setEditModel] = useState<ToolModel | null>(null)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<ToolModel[]>(MODELS)
  const [addToast, ToastHost] = useToasts()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (m) =>
        (brand === 'Todas' || m.brand === brand) &&
        (q === '' || m.code.toLowerCase().includes(q)),
    )
  }, [brand, query, rows])

  const brandCount = useMemo(() => new Set(rows.map((m) => m.brand)).size, [rows])
  const totalTools = useMemo(() => rows.reduce((a, b) => a + b.tools, 0), [rows])

  const deleteRow = (m: ToolModel): void => {
    setRows((arr) => arr.filter((r) => !(r.brand === m.brand && r.code === m.code)))
    addToast(`Modelo ${m.brand} ${m.code} eliminado`)
  }

  const modalOpen = createOpen || editModel != null

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <PageHero
        eyebrow="Catálogos · modelos"
        title="Modelos de herramientas"
        italic="de herramientas"
        lede={`${rows.length} modelos en ${brandCount} marcas · ${totalTools} herramientas activas.`}
        actions={
          <>
            <Button icon={Download04Icon} onClick={() => addToast('Exportando catálogo de modelos…')}>
              Exportar
            </Button>
            <Button variant="primary" icon={PlusSignIcon} onClick={() => setCreateOpen(true)}>
              Nuevo modelo
            </Button>
          </>
        }
      />

      <div className="reveal-d2 mb-3">
        <Tabs
          value={brand}
          onChange={(value) => {
            setBrand(value)
            setPage(1)
          }}
          items={BRANDS_FILTER.map((b) => ({
            value: b,
            label: b,
            count: b === 'Todas' ? rows.length : rows.filter((m) => m.brand === b).length,
          }))}
        />
      </div>

      <div className="reveal-d3 overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-3">
          <div className="flex h-8 max-w-[320px] flex-1 items-center gap-2 rounded-full border border-hairline-strong bg-white px-2.5 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
            <HugeiconsIcon icon={Search01Icon} size={13} strokeWidth={1.8} className="shrink-0 text-muted" />
            <input
              className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-muted-soft"
              placeholder="Buscar por código…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className="ml-auto text-[13px] text-muted">
            Mostrando <b className="text-ink">{filtered.length}</b> modelos
          </span>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className={`${TH} w-8`}>
                  <Checkbox />
                </th>
                <th className={TH}>Marca</th>
                <th className={TH}>Código</th>
                <th className={TH}>Herram.</th>
                <th className={TH}>Uso</th>
                <th className={`${TH} w-[150px]`} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <ModelRow
                  key={m.brand + m.code}
                  model={m}
                  onEdit={() => setEditModel(m)}
                  onDelete={() => deleteRow(m)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-hairline px-4 pb-3 text-[13px] text-muted">
          <Pager page={page} lastPage={2} total={rows.length} onChange={setPage} itemsLabel="modelos" />
        </div>
      </div>

      <NewModelModal
        key={editModel ? `edit-${editModel.brand}-${editModel.code}` : createOpen ? 'create-open' : 'closed'}
        open={modalOpen}
        editModel={editModel}
        onClose={() => {
          setCreateOpen(false)
          setEditModel(null)
        }}
        onSave={(draft) => {
          if (editModel) {
            setRows((arr) =>
              arr.map((r) =>
                r.brand === editModel.brand && r.code === editModel.code
                  ? { ...r, brand: draft.brand, code: draft.code }
                  : r,
              ),
            )
            addToast(`Modelo ${draft.brand} ${draft.code} actualizado`)
            setEditModel(null)
          } else {
            setRows((arr) => [
              { brand: draft.brand, code: draft.code, desc: 'Nuevo modelo', tools: 0, asg: 0 },
              ...arr,
            ])
            addToast(`Modelo ${draft.brand} ${draft.code} creado`)
            setCreateOpen(false)
          }
        }}
      />

      {ToastHost}
    </div>
  )
}
