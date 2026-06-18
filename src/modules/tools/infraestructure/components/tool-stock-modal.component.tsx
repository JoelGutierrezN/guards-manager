import { type JSX, useMemo, useRef, useState } from 'react'
import { Cancel01Icon, Search01Icon, ViewIcon, SentIcon, File01Icon } from '@hugeicons/core-free-icons'
import { Modal, IconButton, Icon, Chip } from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import type { ToolUnits } from '../../domain/tool-unit.model'
import { INUTIL_STATE_LABEL } from '../../domain/tool-unit.model'
import { ToolUnitsMock } from '../mocks/tool-units.mock'
import { ToolStockSectionTitle } from './tool-stock-section-title.component'

interface Props {
  open: boolean
  tool: Tool | null
  onClose: () => void
}

const EMPTY_UNITS: ToolUnits = { disponibles: [], asignadas: [], inutilizables: [] }

export function ToolStockModal({ open, tool, onClose }: Props): JSX.Element {
  const [query, setQuery] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const dispRef = useRef<HTMLDivElement>(null)
  const asigRef = useRef<HTMLDivElement>(null)
  const inutRef = useRef<HTMLDivElement>(null)

  // TODO API: las unidades vienen de GET /api/tools/{id}/units (ver ToolUnitsMock).
  const units = useMemo(() => (tool ? ToolUnitsMock.build(tool) : EMPTY_UNITS), [tool])

  const normalized = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!normalized) return units
    const matches = (serial: string, assignee?: string) =>
      serial.toLowerCase().includes(normalized) ||
      (assignee ? assignee.toLowerCase().includes(normalized) : false)
    return {
      disponibles: units.disponibles.filter((unit) => matches(unit.serial)),
      asignadas: units.asignadas.filter((unit) => matches(unit.serial, unit.assignee)),
      inutilizables: units.inutilizables.filter((unit) => matches(unit.serial)),
    }
  }, [units, normalized])

  const totalShown =
    filtered.disponibles.length + filtered.asignadas.length + filtered.inutilizables.length
  const searching = normalized.length > 0

  const handleClose = () => {
    setQuery('')
    onClose()
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goItemDetail = () => {
    // TODO: enlazar con el detalle de ítem / resguardo cuando exista esa pantalla.
  }
  const goNewAssignment = () => {
    // TODO: enlazar con el flujo de nueva asignación cuando exista esa pantalla.
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth={820}
      className="flex h-[min(720px,88vh)] max-h-[88vh] flex-col overflow-hidden"
    >
      <div className="flex shrink-0 items-start justify-between border-b border-hairline px-6 pb-4 pt-5">
        <div className="min-w-0">
          <div className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-brand">
            Existencias en detalle
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              {tool?.name ?? ''}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {tool ? `${tool.brand} · ${tool.model}` : ''}
            </span>
          </div>
        </div>
        <IconButton icon={Cancel01Icon} onClick={handleClose} bordered size="sm" />
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-b border-hairline px-6 py-3.5">
        <div className="flex h-9 items-center gap-2 rounded-full border border-hairline-strong bg-white px-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] transition-[border-color,box-shadow]">
          <Icon icon={Search01Icon} size={14} className="shrink-0 text-muted" />
          <input
            className="h-full min-w-0 flex-1 border-none bg-transparent p-0 font-mono text-[13px] text-ink outline-none placeholder:text-muted-soft"
            placeholder="Buscar por número de serie o persona…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="shrink-0 text-muted hover:text-ink"
              onClick={() => setQuery('')}
              aria-label="Limpiar"
            >
              <Icon icon={Cancel01Icon} size={13} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="transition-transform hover:-translate-y-px"
            onClick={() => scrollToSection(dispRef)}
          >
            <Chip tone="ok" dot size="sm">
              {filtered.disponibles.length} disponibles
            </Chip>
          </button>
          <button
            type="button"
            className="transition-transform hover:-translate-y-px"
            onClick={() => scrollToSection(asigRef)}
          >
            <Chip tone="navy" dot size="sm">
              {filtered.asignadas.length} asignadas
            </Chip>
          </button>
          <button
            type="button"
            className="transition-transform hover:-translate-y-px"
            onClick={() => scrollToSection(inutRef)}
          >
            <Chip tone="danger" dot size="sm">
              {filtered.inutilizables.length} inutilizables
            </Chip>
          </button>
          {searching && (
            <span className="ml-0.5 text-[11px] text-muted">
              {totalShown} coincidencia{totalShown === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      <div ref={bodyRef} className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6 pt-4">
        {searching && totalShown === 0 && (
          <div className="px-0.5 py-4 text-center text-[13px] text-muted">
            Sin coincidencias para{' '}
            <span className="font-mono text-ink-2">“{query.trim()}”</span>.
          </div>
        )}

        {(!searching || filtered.disponibles.length > 0) && (
          <section ref={dispRef}>
            <ToolStockSectionTitle
              color="var(--color-ok)"
              label="Disponibles"
              count={filtered.disponibles.length}
            />
            {filtered.disponibles.length === 0 ? (
              <div className="px-0.5 pt-2 text-[11px] text-muted">Sin unidades en esta categoría.</div>
            ) : (
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      N.º de serie
                    </th>
                    <th className="border-b border-hairline" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.disponibles.map((unit) => (
                    <tr key={unit.serial}>
                      <td className="border-b border-hairline px-3 py-1.5 font-mono font-medium text-ink">
                        {unit.serial}
                      </td>
                      <td className="w-px whitespace-nowrap border-b border-hairline px-3 py-1 text-right">
                        <span className="inline-flex gap-1">
                          <IconButton icon={ViewIcon} tip="Ver ítem" size="sm" onClick={goItemDetail} />
                          <IconButton icon={SentIcon} tip="Asignar" size="sm" onClick={goNewAssignment} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {(!searching || filtered.asignadas.length > 0) && (
          <section ref={asigRef}>
            <ToolStockSectionTitle
              color="var(--color-brand)"
              label="Asignadas"
              count={filtered.asignadas.length}
            />
            {filtered.asignadas.length === 0 ? (
              <div className="px-0.5 pt-2 text-[11px] text-muted">Sin unidades en esta categoría.</div>
            ) : (
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      N.º de serie
                    </th>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Asignada a
                    </th>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Desde
                    </th>
                    <th className="border-b border-hairline" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.asignadas.map((unit) => (
                    <tr key={unit.serial}>
                      <td className="border-b border-hairline px-3 py-1.5 font-mono font-medium text-ink">
                        {unit.serial}
                      </td>
                      <td className="border-b border-hairline px-3 py-1.5 text-ink-2">
                        {unit.assignee}
                      </td>
                      <td className="border-b border-hairline px-3 py-1.5 font-mono text-[12px] text-muted">
                        {unit.since}
                      </td>
                      <td className="w-px whitespace-nowrap border-b border-hairline px-3 py-1 text-right">
                        <span className="inline-flex gap-1">
                          <IconButton icon={ViewIcon} tip="Ver ítem" size="sm" onClick={goItemDetail} />
                          <IconButton icon={File01Icon} tip="Ver resguardo" size="sm" onClick={goItemDetail} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {(!searching || filtered.inutilizables.length > 0) && (
          <section ref={inutRef}>
            <ToolStockSectionTitle
              color="var(--color-danger)"
              label="Inutilizables"
              count={filtered.inutilizables.length}
            />
            {filtered.inutilizables.length === 0 ? (
              <div className="px-0.5 pt-2 text-[11px] text-muted">Sin unidades en esta categoría.</div>
            ) : (
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      N.º de serie
                    </th>
                    <th className="border-b border-hairline px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Estado
                    </th>
                    <th className="border-b border-hairline" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.inutilizables.map((unit) => (
                    <tr key={unit.serial}>
                      <td className="border-b border-hairline bg-danger-soft px-3 py-1.5 font-mono font-semibold text-danger">
                        {unit.serial}
                      </td>
                      <td className="border-b border-hairline bg-danger-soft px-3 py-1.5">
                        <Chip tone="danger" size="sm" dot>
                          {INUTIL_STATE_LABEL[unit.state]}
                        </Chip>
                      </td>
                      <td className="w-px whitespace-nowrap border-b border-hairline bg-danger-soft px-3 py-1 text-right">
                        <IconButton icon={ViewIcon} tip="Ver ítem" size="sm" onClick={goItemDetail} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </div>
    </Modal>
  )
}
